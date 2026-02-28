//When run, this function will iniatialize the default board for user

//Connect to the database using connectDB from db.ts file
import connectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
	{ name: "Wish List", order: 0 },
	{ name: "Applied", order: 1 },
	{ name: "Interview", order: 2 },
	{ name: "Offer", order: 3 },
	{ name: "Rejected", order: 4 },
];

export default async function initializeUserBoard(userId: string) {
	try {
		//connect to db
		await connectDB();
		//Check if the board already exist - findOne -> allows to go through a collection and find one record that mat5ches a specific condition
		const existingBoard = await Board.findOne({
			userId: userId,
			name: "Job Hunt",
		});

		if (existingBoard) {
			return existingBoard;
		}

		//Create the Board if not existingBoard
		const board = await Board.create({
			name: "Job Hunt",
			userId: userId,
			column: [],
		});

		//Create the column - this will run after the board is created

		const columns = await Promise.all(
			DEFAULT_COLUMNS.map((column) =>
				Column.create({
					name: column.name,
					boardId: board._id,
					order: column.order,
					jobApplications: [],
				}),
			),
		);

		//Update the board with the new column Ids
		board.columns = columns.map((col) => col._id);

		await board.save();

		return board;
	} catch (error) {
		throw error;
	}
}
