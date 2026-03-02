import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const session = await getSession();
	console.log("🚀 ~ Dashboard ~ session:", session);

	if (!session?.user) {
		redirect("/sign-in");
	}
	return <div>Dashboard</div>;
}
