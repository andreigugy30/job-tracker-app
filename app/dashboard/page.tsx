import BoardSection from "@/components/board-section";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/sign-in");
	}

	//Being a Next server componet - we can directly connect to the database and fetch the data (we can directly access the collection from Board data)
	await connectDB();

	const board = await Board.findOne({
		userId: session.user.id,
		name: "Job Hunt",
	}).populate({
		path: "columns",
	}); //columns being only stored as a reference in models/board.ts we need to use populate ->
	// will tell mongoose to not only fetch the data , but also populate the columns with the appropriate data

	const boardData = JSON.parse(JSON.stringify(board));
	console.log("🚀 ~ Dashboard ~ boardData:", boardData);
	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto py-6">
				<div className="mb-5">
					<h1 className="text-3xl font-bold text-black">{board?.name}</h1>
					<p className="text-gray-600">Track job applications</p>
				</div>
				<BoardSection board={boardData} userId={session.user.id} />
			</div>
		</div>
	);
}
