"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";

type JobApplicationData = {
	company: string;
	position: string;
	location?: string;
	columnId: string;
	boardId: string;
	notes?: string;
	salary?: string;
	jobUrl?: string;
	tags?: string[];
	description?: string;
};

type JobApplicationDataUpdates = JobApplicationData & {
	order: number;
};

export async function createJobApplication(data: JobApplicationData) {
	//Get session data
	const session = await getSession();

	if (!session?.user) {
		return {
			error: "Unauthorized!",
		};
	}

	//Connect to MongoDB
	await connectDB();

	const {
		company,
		position,
		jobUrl,
		location,
		notes,
		salary,
		description,
		tags,
		boardId,
		columnId,
	} = data;

	//Check if required fields are null

	if (!company || !position || !columnId || !boardId) {
		return { error: "Missing required fields!" };
	}

	// verify if user logged in has ownership over the board

	const board = await Board.findOne({
		_id: boardId,
		userId: session.user.id,
	});

	if (!board) {
		return { error: "Board not found!" };
	}

	//Verify if the column belong to the board

	const column = await Column.findOne({
		_id: columnId,
		boardId: boardId,
	});

	if (!column) {
		return { error: "Column not found!" };
	}

	//Create a job application

	const maxOrder = (await JobApplication.findOne({
		// find an item
		columnId,
	})
		.sort({ order: -1 }) //sort on descending order - last item
		.select("order") // return one field = order field
		.lean()) as { order: number } | null; //accessing as a JS object

	const jobApplication = await JobApplication.create({
		company,
		position,
		jobUrl,
		location,
		notes,
		salary,
		description,
		tags: tags || [],
		boardId,
		columnId,
		userId: session.user.id,
		status: "applied",
		order: maxOrder ? maxOrder?.order + 1 : 0,
	});

	//Assign the jobApplication to the column's list
	await Column.findByIdAndUpdate(columnId, {
		$push: { jobApplications: jobApplication._id },
	});

	//Invalidate all cache in a specific route
	revalidatePath("/dashboard");

	// Mongoose documents contain lots of internal state and circular references
	// which break Next.js server action serialization. Convert to a plain object
	// before returning so the result can be structured‑cloned on the client.

	const plainJob = JSON.parse(JSON.stringify(jobApplication));
	console.log("🚀 ~ createJobApplication ~ plainJob:", plainJob);

	return {
		data: plainJob,
	};
}

export async function updateJobApplication(
	id: string,
	updates: JobApplicationDataUpdates,
) {
	//1. check to see if the session is valid

	const session = await getSession();
	if (!session?.user) {
		return { error: "Unauthorized" };
	}

	//2.Get the job application

	const jobApplication = await JobApplication.findById(id);

	//3.If the job application doesn't exist or if the user with the session !== user is supposed to be return error

	if (!jobApplication) {
		return { error: "Job application not found" };
	}

	if (jobApplication.userId !== session?.user.id) {
		return { error: "Unauthorized" };
	}

	//4. Handle success case: get what updates exist

	const { columnId, order, ...otherUpdates } = updates;

	//5.Create an object that will hold all the updates we want to apply

	const updatesToApply: Partial<JobApplicationDataUpdates> = otherUpdates;

	//6.Prepare a column id for comparison and convert to strings to ensure that we can compare them properly

	const currentColumnId = jobApplication.columnId.toString();
	const newColumnId = columnId.toString();

	//7.Detect to see if it is actually moving to a different column

	const isMovingToDifferentColumn =
		newColumnId && newColumnId !== currentColumnId;

	if (isMovingToDifferentColumn) {
		//8. in this case remove  the job applciation from the old column
		await Column.findByIdAndUpdate(currentColumnId, {
			$pull: { jobApplication: id }, // removes an item from an array by passing the value of it : {jobApplications : id}
		});

		//9. Get all of the jobs currently  in the target column (where we want to move the job) excluding the one we are moving
		const jobsInTargetColumn = await JobApplication.find({
			columnId: newColumnId,
			_id: { $ne: id }, //$ne = notEqual
		})
			.sort({ order: 1 }) //sort asc order
			.lean();

		//10.Calculate where to put the job in the new column

		let newOrderValue: number;
		if (order !== undefined && order !== null) {
			newOrderValue = order * 100; // multiplying by 100 to leave room for inserting items in between the positions
			//shift the existing jobs to make room for the new added one
			const jobsThatNeedToShift = jobsInTargetColumn.slice(order);
			for (const job of jobsThatNeedToShift) {
				await JobApplication.findByIdAndUpdate(job._id, {
					$set: { order: job.order + 100 }, //set a new value - order to be increased
				});
			}
		} else {
			if (jobsInTargetColumn.length > 0) {
				const lastJobOrder =
					jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0;
				newOrderValue = lastJobOrder + 100;
			} else {
				newOrderValue = 0;
			}
		}

		updatesToApply.columnId = newColumnId;
		updatesToApply.order = newOrderValue;

		await Column.findByIdAndUpdate(newColumnId, {
			$push: { jobApplications: id },
		});
	} else if (order !== undefined && order !== null) {
		const otherJobsInCOlumn = await JobApplication.find({
			columnId: currentColumnId,
			_id: { $ne: id }, //$ne = notEqual
		})
			.sort({ order: 1 }) //sort asc order
			.lean();

		const currentJobOrder = jobApplication.order || 0;
		const currPositionIndex = otherJobsInCOlumn.findIndex(
			(job) => job.order > currentJobOrder,
		);
		const oldPositionIndex =
			currPositionIndex === -1 ? otherJobsInCOlumn.length : currPositionIndex; // check to see if it is the last item

		const newOrderValue = order * 100;

		if (order < oldPositionIndex) {
			const jobsToShiftDown = otherJobsInCOlumn.slice(order, oldPositionIndex);

			for (const job of jobsToShiftDown) {
				await JobApplication.findByIdAndUpdate(job._id, {
					$set: { order: job.order + 100 },
				});
			}
		} else if (order > oldPositionIndex) {
			const jobsToShiftUp = otherJobsInCOlumn.slice(oldPositionIndex, order);
			for (const job of jobsToShiftUp) {
				const newOrder = Math.max(0, job.order - 100);
				await JobApplication.findByIdAndUpdate(job._id, {
					$set: { order: newOrder },
				});
			}
		}

		updatesToApply.order = newOrderValue;
	}

	const updated = await JobApplication.findByIdAndUpdate(id, updatesToApply, {
		new: true,
	});

	//Invalidate all cache in a specific route - add actually see that a job is changing the order or moved to another column
	revalidatePath("/dashboard");
	return { data: JSON.parse(JSON.stringify(updated)) };
}
