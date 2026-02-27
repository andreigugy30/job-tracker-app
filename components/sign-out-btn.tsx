"use client";
import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function SignOutBtn() {
	const router = useRouter();
	const handleDropdownMenuClick = async () => {
		const result = await signOut();
		if (result.data?.success) {
			router.push("/sign-in");
		} else {
			alert("Error signing out!");
		}
	};
	return (
		<DropdownMenuItem onClick={handleDropdownMenuClick}>
			Log Out
		</DropdownMenuItem>
	);
}
