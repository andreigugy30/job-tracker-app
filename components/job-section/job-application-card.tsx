import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "../ui/card";
import {
	DeleteIcon,
	Edit2,
	ExternalLink,
	MoreVertical,
	Trash2,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

type JobApplicationCardprops = {
	job: JobApplication;
	columns: Column[];
};
export default function JobApplicationCard({
	job,
	columns,
}: JobApplicationCardprops) {
	return (
		<>
			<Card className="cursor-pointer transition-shadow hover:shadow">
				<CardContent className="p-5">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-sm mb-2">
								<span className=" mr-1">Job Position:</span>
								{job.position}
							</h3>
							<p className="text-xs text-muted-foreground mb-2">
								<span className="mr-1">Company:</span>
								{job.company}
							</p>
							{job.description && (
								<p className="text-xs text-muted-foreground mb-2">
									<span className="mr-1">Description:</span>
									{job.description}
								</p>
							)}
							{job.tags && job.tags.length > 0 && (
								<div className="flex flex-wrap gap-2 mb-2">
									{job.tags.map((tag, key) => (
										<span
											className="px-2 py-1 text-xs rounded-full bg-primary text-white"
											key={key}
										>
											{tag}
										</span>
									))}
								</div>
							)}
							{job.jobUrl && (
								<a
									target="_blank"
									href={job.jobUrl}
									onClick={(e) => e.stopPropagation()}
								>
									<ExternalLink />
								</a>
							)}
						</div>
						<div>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button variant={"ghost"} size={"icon"}>
										<MoreVertical></MoreVertical>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>
										<Edit2 className="h-5 w-5" />
										Edit
									</DropdownMenuItem>
									{columns.length > 1 && (
										<>
											{columns
												.filter((column) => column._id !== job.columnId)
												.map((col, key) => (
													<DropdownMenuItem key={key}>
														Move to {col.name}
													</DropdownMenuItem>
												))}
										</>
									)}
									<DropdownMenuItem>
										<Trash2 className="h-5 w-5" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
