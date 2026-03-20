// "use client";

// import {
// 	Dialog,
// 	DialogContent,
// 	DialogFooter,
// 	DialogHeader,
// 	DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui//input";
// import { Textarea } from "@/components/ui//textarea";
// import { useState } from "react";
// import { JobApplication } from "@/lib/models/models.types";
// import { updateJobApplication } from "@/lib/actions/job-applications";

// interface EditJobApplicationProps {
// 	job: JobApplication;
// 	onOpenChange: (open: boolean) => void;
// 	isOpen: boolean;
// 	handleEditChanges: (formData: JobApplication) => void;
// }

// export default function EditJobApplicationDialog({
// 	job,
// 	onOpenChange,
// 	isOpen,
// 	handleEditChanges,
// }: EditJobApplicationProps) {
// 	const [formData, setFormData] = useState({
// 		company: job.company,
// 		position: job.position,
// 		location: job.location || "",
// 		notes: job.notes || "",
// 		salary: job.salary || "",
// 		jobUrl: job.jobUrl || "",
// 		tags: job.tags?.join(",") || "",
// 		description: job.description || "",
// 		columnId: job.columnId || "",
// 	});

// 	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// 		e.preventDefault();
// 		const updatedJob = {
// 			...formData,
// 			tags: formData.tags
// 				.split(",")
// 				.map((tag) => tag.trim())
// 				.filter((tag) => tag.length > 0),
// 		};
// 		handleEditChanges(updatedJob as JobApplication);
// 	};

// 	return (
// 		<Dialog open={isOpen} onOpenChange={onOpenChange}>
// 			<DialogContent className="max-w-2xl">
// 				<DialogHeader>
// 					<DialogTitle>Edit Job Application</DialogTitle>
// 				</DialogHeader>
// 				<form className="space-y-5" onSubmit={onSubmit}>
// 					<div className="space-y-5">
// 						<div className="grid grid-cols-2 gap-4">
// 							<div className="space-y-2">
// 								<Label htmlFor="company">Company *</Label>
// 								<Input
// 									id="company"
// 									required
// 									onChange={(e) =>
// 										setFormData({ ...formData, company: e.target.value })
// 									}
// 									value={formData.company}
// 								/>
// 							</div>
// 							<div className="space-y-2">
// 								<Label htmlFor="position">Position *</Label>
// 								<Input
// 									id="position"
// 									required
// 									onChange={(e) =>
// 										setFormData({ ...formData, position: e.target.value })
// 									}
// 									value={formData.position}
// 								/>
// 							</div>
// 						</div>
// 						<div className="grid grid-cols-2 gap-4">
// 							<div className="space-y-2">
// 								<Label htmlFor="location">Location </Label>
// 								<Input
// 									id="location"
// 									onChange={(e) =>
// 										setFormData({ ...formData, location: e.target.value })
// 									}
// 									value={formData.location}
// 								/>
// 							</div>
// 							<div className="space-y-2">
// 								<Label htmlFor="salary">Salary </Label>
// 								<Input
// 									id="salary"
// 									placeholder="e.g. 10000e-20000e"
// 									onChange={(e) =>
// 										setFormData({ ...formData, salary: e.target.value })
// 									}
// 									value={formData.salary}
// 								/>
// 							</div>
// 						</div>
// 						<div className="space-y-3">
// 							<Label htmlFor="jobUrl">Job Url </Label>
// 							<Input
// 								id="jobUrl"
// 								placeholder="https://..."
// 								onChange={(e) =>
// 									setFormData({ ...formData, jobUrl: e.target.value })
// 								}
// 								value={formData.jobUrl}
// 							/>
// 						</div>
// 						<div className="space-y-3">
// 							<Label htmlFor="tags">Tags </Label>
// 							<Input
// 								id="tags"
// 								placeholder="React, Typescript, ..."
// 								onChange={(e) =>
// 									setFormData({ ...formData, tags: e.target.value })
// 								}
// 								value={formData.tags}
// 							/>
// 						</div>
// 						<div className="space-y-3">
// 							<Label htmlFor="description">Description </Label>
// 							<Textarea
// 								id="description"
// 								placeholder="Description of the role"
// 								rows={3}
// 								onChange={(e) =>
// 									setFormData({ ...formData, description: e.target.value })
// 								}
// 								value={formData.description}
// 							/>
// 						</div>
// 						<div className="space-y-3">
// 							<Label htmlFor="notes">Notes </Label>
// 							<Textarea
// 								id="notes"
// 								placeholder="Notes of the role"
// 								rows={3}
// 								onChange={(e) =>
// 									setFormData({ ...formData, notes: e.target.value })
// 								}
// 								value={formData.notes}
// 							/>
// 						</div>
// 					</div>
// 					<DialogFooter>
// 						<Button
// 							type="button"
// 							variant={"outline"}
// 							onClick={() => onOpenChange(false)}
// 						>
// 							Cancel
// 						</Button>
// 						<Button type="submit">Save application</Button>
// 					</DialogFooter>
// 				</form>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
