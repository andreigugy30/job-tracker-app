import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface CreateJobApplicationProps {
	columnId: string;
	boardId: string;
	onCreatedJob: () => void;
}
export default function CreateJobApplicationDialog({
	columnId,
	boardId,
	onCreatedJob,
}: CreateJobApplicationProps) {
	return (
		<Dialog>
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
				<form className="space-y-5">
					<div className="space-y-5">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="company">Company *</Label>
								<Input id="company" readOnly />
							</div>
							<div className="space-y-2">
								<Label htmlFor="position">Position *</Label>
								<Input id="position" readOnly />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="location">Location </Label>
								<Input id="location" readOnly />
							</div>
							<div className="space-y-2">
								<Label htmlFor="salary">Salary </Label>
								<Input id="salary" placeholder="e.g. 10000e-20000e" readOnly />
							</div>
						</div>
						<div className="space-y-3">
							<Label htmlFor="jobUrl">Job Url </Label>
							<Input id="jobUrl" placeholder="https://..." />
						</div>
						<div className="space-y-3">
							<Label htmlFor="tags">Tags </Label>
							<Input id="tags" placeholder="React, Typescript, ..." />
						</div>
						<div className="space-y-3">
							<Label htmlFor="description">Description </Label>
							<Textarea
								id="description"
								placeholder="Description of the role"
								rows={3}
							/>
						</div>
						<div className="space-y-3">
							<Label htmlFor="notes">Notes </Label>
							<Textarea
								id="notes"
								placeholder="Description of the role"
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant={"outline"}>
							Cancel
						</Button>
						<Button type="button">Add application</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
