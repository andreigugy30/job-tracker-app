"use client";

import { Board, Column } from "@/lib/models/models.types";
import {
	Award,
	Calendar,
	CheckCircle2,
	Mic,
	MoreVertical,
	Trash2,
	XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobApplicationDialog from "./job-section/create-job-application-dialog";
import SortableJobCard from "./job-section/sortable-job-card";

type BoardSectionProps = {
	board: Board;
	userId: string;
};

type ColumnConfig = {
	color: string;
	icon: React.ReactNode;
};

const COLUMN_CONFIG: Array<ColumnConfig> = [
	{
		color: "bg-cyan-500",
		icon: <Calendar className="h-4 w-4" />,
	},
	{
		color: "bg-purple-500",
		icon: <CheckCircle2 className="h-4 w-4" />,
	},
	{
		color: "bg-green-500",
		icon: <Mic className="h-4 w-4" />,
	},
	{
		color: "bg-yellow-500",
		icon: <Award className="h-4 w-4" />,
	},
	{
		color: "bg-red-500",
		icon: <XCircle className="h-4 w-4" />,
	},
];

function DroppableColumn({
	column,
	config,
	boardId,
	sortedColumns,
}: {
	column: Column;
	config: ColumnConfig;
	boardId: string;
	sortedColumns: Column[];
}) {
	const sortedJobs =
		column.jobApplications?.sort((a, b) => a.order - b.order) || [];
	return (
		<Card className="min-w-[300px] flex-shrink-0 shadow-md p-0">
			<CardHeader
				className={`${config.color} text-white rounded-t-lg pb-5 pt-5`}
			>
				<div className="flex items-center justify-between">
					<div className="flex flex-row items-center gap-3">
						{config.icon}
						<CardTitle className="text-white text-base font-semibold">
							{column.name}
						</CardTitle>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant={"ghost"}
								size={"icon"}
								className="h-5 w-5 text-white hover:bg-white/20"
							>
								<MoreVertical className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem className="text-destructive">
								<Trash2 className="h-5 w-5" />
								Delete Column
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent className="space-y-2 pt-5 bg-gray-50/50 min-h-[400px] rounded-b-lg">
				{sortedJobs.map((job, key) => (
					<SortableJobCard
						key={key}
						job={{ ...job, columnId: job.columnId || column._id }}
						columns={sortedColumns}
					/>
				))}
				<CreateJobApplicationDialog
					columnId={column._id}
					boardId={boardId}
				></CreateJobApplicationDialog>
			</CardContent>
		</Card>
	);
}

export default function BoardSection({ board, userId }: BoardSectionProps) {
	const columns = board.columns;
	console.log("Job applciation", columns[0].jobApplications);
	const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];
	return (
		<>
			<div>
				<div>
					{columns.map((column, key) => {
						const config = COLUMN_CONFIG[key] || {
							color: "bg-gray-500",
							icon: <Calendar />,
						};
						return (
							<>
								<DroppableColumn
									key={key}
									column={column}
									config={config}
									boardId={board._id}
									sortedColumns={sortedColumns}
								/>
							</>
						);
					})}
				</div>
			</div>
			;
		</>
	);
}
