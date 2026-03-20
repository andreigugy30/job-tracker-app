"use client";

import { useState } from "react";
import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "../ui/card";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
	deleteJobApplication,
	updateJobApplication,
} from "@/lib/actions/job-applications";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type JobApplicationCardprops = {
	job: JobApplication;
	columns: Column[];
};
export default function JobApplicationCard({
	job,
	columns,
}: JobApplicationCardprops) {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [formData, setFormData] = useState({
		company: job.company,
		position: job.position,
		location: job.location || "",
		notes: job.notes || "",
		salary: job.salary || "",
		jobUrl: job.jobUrl || "",
		tags: job.tags?.join(",") || "",
		description: job.description || "",
		columnId: job.columnId || "",
		boardId: job.boardId || "",
		order: job.order || 0,
	});

	async function handleMove(newColumnId: string) {
		try {
			const updatedJob = { ...job, columnId: newColumnId };
			const result = await updateJobApplication(job._id, updatedJob);
			return result;
		} catch (error) {
			console.error("Failed to move job application:", error);
		}
	}

	async function handleDelete() {
		try {
			const result = await deleteJobApplication(job._id);
			if (result.error) {
				console.error("Failed to delete a job application", result.error);
			}
			return result;
		} catch (error) {
			console.error("Failed to move job application:", error);
		}
	}

	async function handleEditChanges(e: React.FormEvent) {
		e.preventDefault();
		try {
			const updatedJob = {
				...formData,
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag.length > 0),
			};
			const result = await updateJobApplication(job._id, updatedJob);
			if (!result.error) {
				setIsEditing(false);
			}
		} catch (error) {
			console.error("Failed to edit job application:", error);
		}
	}

	function openEdit() {
		setIsEditing(true);
	}

	// function closeEdit(open: boolean) {
	// 	setIsEditing(open);
	// }

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
							{job.notes && (
								<p className="text-xs text-muted-foreground mb-2">
									<span className="mr-1">Notes:</span>
									{job.notes}
								</p>
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
									<DropdownMenuItem onClick={openEdit}>
										<Edit2 className="h-5 w-5" />
										Edit
									</DropdownMenuItem>
									{columns.length > 1 && (
										<>
											{columns
												.filter((column) => column._id !== job.columnId)
												.map((col, key) => (
													<DropdownMenuItem
														key={key}
														onClick={() => handleMove(col._id)}
													>
														Move to {col.name}
													</DropdownMenuItem>
												))}
										</>
									)}
									<DropdownMenuItem onClick={() => handleDelete()}>
										<Trash2 className="h-5 w-5" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</CardContent>
			</Card>
			<Dialog open={isEditing} onOpenChange={setIsEditing}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Job Application</DialogTitle>
					</DialogHeader>
					<form className="space-y-5" onSubmit={handleEditChanges}>
						<div className="space-y-5">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="company">Company *</Label>
									<Input
										id="company"
										required
										onChange={(e) =>
											setFormData({ ...formData, company: e.target.value })
										}
										value={formData.company}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="position">Position *</Label>
									<Input
										id="position"
										required
										onChange={(e) =>
											setFormData({ ...formData, position: e.target.value })
										}
										value={formData.position}
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="location">Location </Label>
									<Input
										id="location"
										onChange={(e) =>
											setFormData({ ...formData, location: e.target.value })
										}
										value={formData.location}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="salary">Salary </Label>
									<Input
										id="salary"
										placeholder="e.g. 10000e-20000e"
										onChange={(e) =>
											setFormData({ ...formData, salary: e.target.value })
										}
										value={formData.salary}
									/>
								</div>
							</div>
							<div className="space-y-3">
								<Label htmlFor="jobUrl">Job Url </Label>
								<Input
									id="jobUrl"
									placeholder="https://..."
									onChange={(e) =>
										setFormData({ ...formData, jobUrl: e.target.value })
									}
									value={formData.jobUrl}
								/>
							</div>
							<div className="space-y-3">
								<Label htmlFor="tags">Tags </Label>
								<Input
									id="tags"
									placeholder="React, Typescript, ..."
									onChange={(e) =>
										setFormData({ ...formData, tags: e.target.value })
									}
									value={formData.tags}
								/>
							</div>
							<div className="space-y-3">
								<Label htmlFor="description">Description </Label>
								<Textarea
									id="description"
									placeholder="Description of the role"
									rows={3}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									value={formData.description}
								/>
							</div>
							<div className="space-y-3">
								<Label htmlFor="notes">Notes </Label>
								<Textarea
									id="notes"
									placeholder="Notes of the role"
									rows={3}
									onChange={(e) =>
										setFormData({ ...formData, notes: e.target.value })
									}
									value={formData.notes}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant={"outline"}
								onClick={() => setIsEditing(false)}
							>
								Cancel
							</Button>
							<Button type="submit">Save application</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
