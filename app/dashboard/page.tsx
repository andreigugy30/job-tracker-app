import BoardSection from "@/components/board-section";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function getBoard(userId: string) {
	//cache = store the information in memory in order to be accesed quicker and then tell the caching system when the data is becaming Stale
	// need to setup in next.config.ts - cacheComponents:true (Next.js v16)
	//in Next.js you can't use 'use cache in a component that uses headers function'
	"use cache";

	//Being a Next server componet - we can directly connect to the database and fetch the data (we can directly access the collection from Board data)
	await connectDB();

	//columns being only stored as a reference in models/board.ts we need to use populate ->
	//will tell mongoose to not only fetch the data , but also populate the columns with the appropriate data

	const boardDocument = await Board.findOne({
		userId: userId,
		name: "Job Hunt",
	}).populate({
		path: "columns",
		populate: {
			path: "jobApplications",
		},
	});

	if (!boardDocument) return null;
	const board = JSON.parse(JSON.stringify(boardDocument));

	return board;
}

async function DashboardPageWrapper() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/sign-in");
	}

	const board = await getBoard(session?.user.id ?? "");
	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto py-6">
				<div className="mb-5">
					<h1 className="text-3xl font-bold text-black">{board?.name}</h1>
					<p className="text-gray-600">Track job applications</p>
				</div>
				<BoardSection board={board} userId={session.user.id} />
			</div>
		</div>
	);
}

export default async function Dashboard() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<DashboardPageWrapper />
		</Suspense>
	);
}
