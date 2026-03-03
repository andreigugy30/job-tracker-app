"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";

interface JobApplicationData {
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
}

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
