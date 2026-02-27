"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	async function handleFormSubmit(event: FormEvent) {
		event.preventDefault();
		setError("");
		setLoading(true);
		try {
			const result = await signIn.email({
				email,
				password,
			});
			if (result.error) {
				setError(result.error.message ?? "Failed to sign in");
			} else {
				router.push("/dashboard");
			}
		} catch (e) {
			setError("An unexpected error occured");
		} finally {
			setLoading(false);
		}
	}
	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p=4">
			<Card className="w-full max-w-md border-gray-200 shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold tex-black">
						Sign In
					</CardTitle>
					<CardDescription className="text-gray-600">
						Enter your credentials to access the account
					</CardDescription>
				</CardHeader>
				<form className="space-y-4" onSubmit={handleFormSubmit}>
					{error && (
						<div className="rounded-md bg-destructive/15 p-3 tex-sm text-destructive">
							{error}
						</div>
					)}
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-700">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="john.doe@gmail.com"
								required
								className="border-gray-300 focus:border-primary focus:ring-primary"
								value={email}
								onChange={(ev) => setEmail(ev.target.value)}
							></Input>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-700">
								Password
							</Label>
							<Input
								id="password"
								type="password"
								placeholder=""
								required
								minLength={8}
								className="border-gray-300 focus:border-primary focus:ring-primary"
								value={password}
								onChange={(ev) => setPassword(ev.target.value)}
							></Input>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button
							type="submit"
							className="text-center text-sm text-gray-600"
							disabled={loading}
						>
							{loading ? "Signing in..." : "Sign in"}
						</Button>
						<p>
							Don't have an account?{" "}
							<Link
								href={"/sign-up"}
								className="font-medium text-primary hover:underline"
							>
								Sign Up
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
