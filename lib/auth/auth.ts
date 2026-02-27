import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();
export const auth = betterAuth({
	database: mongodbAdapter(db, { client }),
	emailAndPassword: { enabled: true },
});

//Use auth to detect if there is a current user sign in - for server components
export async function getSession() {
	const result = auth.api.getSession({
		headers: await headers(),
	});
	return result;
}

//Sign Out - in server components

export async function signOut() {
	const result = auth.api.signOut({
		headers: await headers(),
	});
	if ((await result).success) {
		redirect("/sign-in");
	}
}
