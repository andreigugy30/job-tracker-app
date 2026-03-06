"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui//input";
import { Textarea } from "@/components/ui//textarea";
import { useState } from "react";
import { createJobApplication } from "@/lib/actions/job-applications";

interface CreateJobApplicationProps {
	columnId: string;
	boardId: string;
	// onCreatedJob: () => void;
}

const INITIAL_FORM_DATA = {
	company: "",
	position: "",
	location: "",
	notes: "",
	salary: "",
	jobUrl: "",
	tags: "",
	description: "",
};

export default function CreateJobApplicationDialog({
	columnId,
	boardId,
	// onCreatedJob,
}: CreateJobApplicationProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [formData, setFormData] = useState(INITIAL_FORM_DATA);

	async function handleFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			//SERVER ACTION(lib/actions/job-applications.ts file) - special function to be called on the server but call from client components.It is an alternative to making an API route
			const result = await createJobApplication({
				...formData,
				columnId,
				boardId,
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag.length > 0),
			});

			if (!result.error) {
				setFormData(INITIAL_FORM_DATA);
				setOpen(false);
			} else {
				console.error("Failed to create a job:", result.error);
			}
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<Button
					variant={"outline"}
					className="w-full mb-5 justify-start text-muted-foreground border-dashed border-2"
				>
					<Plus className="mr-3 h-5 w-5" />
					Add a job
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Add Job Application</DialogTitle>
					<DialogDescription>Track new job applications</DialogDescription>
				</DialogHeader>
				<form className="space-y-5" onSubmit={handleFormSubmit}>
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
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit">Add application</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
