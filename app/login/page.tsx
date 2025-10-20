"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { EyeOff, Eye, Mail, Lock, Shield, Search } from "lucide-react";
import { toastError, toastSuccess } from "@/utils/toast";
import { api } from "@/lib/api.config";
import { useRouter } from "next/navigation";
import { useApiLoading } from "@/hooks/useApiLoading";

export default function LoginPage() {
	const { withLoading } = useApiLoading();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [includesProceeding, setIncludesProceeding] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setform] = useState({
		email: "",
		password: "",
		remember_me: false,
	});

	const validateEmail = () => {
		const email = form.email.trim();

		if (!email) {
			toastError("Email is required.", "Please enter your email.");
			return false;
		}
		const domainRegex = /^[A-Za-z0-9._%+-]+@gordoncollege\.edu\.ph$/i;
		if (!domainRegex.test(email)) {
			toastError(
				"Email is invalid.",
				"Please use your @gordoncollege.edu.ph email."
			);
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);

		if (
			!form.email.includes("@") &&
			form.email.endsWith("@gordoncollege.edu.ph") === false
		) {
			form.email = form.email.concat("@gordoncollege.edu.ph");
		}
		if (!validateEmail()) {
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await withLoading(() =>
				api("/api/signin-user", {
					method: "POST",
					body: JSON.stringify(form),
				})
			);

			if (response.status !== 200) {
				toastError("Sign in failed.", "Please check your credentials.");
				return;
			}
			toastSuccess("Successfully signed in!", "Welcome back.");
			router.replace("/dashboard");
		} catch (error) {
			console.log(error);
			toastError(
				"Please try again.",
				"An error occurred while signing in."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (
			form.email.includes("@") ||
			form.email.includes("gordoncollege.edu.ph")
		) {
			setIncludesProceeding(false);
		} else {
			setIncludesProceeding(true);
		}
	}, [form.email, setform]);

	return (
		<div className="relative">
			{/* skip link for keyboard users */}
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white/95 p-2 rounded"
			>
				Skip to main content
			</a>

			<div className="fixed inset-0 -z-10 select-none" aria-hidden="true">
				<Image
					src="/signin/GordonCollegeSchool.png"
					alt="Gordon College School"
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
			</div>

			<main
				id="main"
				role="main"
				aria-labelledby="signInHeading"
				className="px-4"
			>
				{/* form */}
				<form
					onSubmit={handleSubmit}
					className="w-full max-w-md mx-auto mt-12 bg-white/95 shadow-lg rounded-xl p-8"
					aria-label="Gordon College sign in"
				>
					<div className="flex flex-col items-center mb-6">
						<Image
							src="/logo.png"
							alt="Gordon College logo"
							width={84}
							height={84}
							className="rounded-full mb-4"
						/>
						<h1
							id="signInHeading"
							className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2"
						>
							Student Sign In
						</h1>
						<p className="text-sm text-gray-600">
							Gordon College · YoFinder
						</p>
					</div>

					<div className="space-y-4">
						<div className="relative">
							<label htmlFor="email" className="block">
								<span className="text-sm font-medium text-gray-700">
									Student ID / Email
								</span>
								<div className="relative mt-1">
									<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
										<Mail size={20} aria-hidden="true" />
									</span>
									<input
										id="email"
										name="email"
										type="text"
										onChange={(e) =>
											setform({
												...form,
												email: e.target.value,
											})
										}
										required
										autoComplete="username"
										placeholder="xxxxxxxxx"
										pattern="[A-Za-z0-9._%+-]+@gordoncollege\.edu\.ph"
										title="Use your @gordoncollege.edu.ph email"
										aria-describedby="emailHelp"
										className="w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 transition"
										aria-label="Student ID or Email"
									/>
								</div>
								<p id="emailHelp" className="sr-only">
									Use your Gordon College email:
									username@gordoncollege.edu.ph
								</p>
							</label>
							{includesProceeding && (
								<span className="absolute text-gray-400 text-sm right-3 top-9.5 pointer-events-none	">
									@gordoncollege.edu.ph
								</span>
							)}
						</div>

						<label htmlFor="password" className="block">
							<span className="text-sm font-medium text-gray-700">
								Password
							</span>
							<div className="relative mt-1">
								<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
									<Lock size={20} aria-hidden="true" />
								</span>
								<input
									id="password"
									name="password"
									type={`${
										showPassword ? "text" : "password"
									}`}
									onChange={(e) =>
										setform({
											...form,
											password: e.target.value,
										})
									}
									required
									autoComplete="current-password"
									placeholder="Enter your password"
									className="w-full pl-10 pr-12 py-2 border rounded-md border-gray-300 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 transition"
									aria-label="Password"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									aria-pressed={showPassword}
									aria-label={
										showPassword
											? "Hide password"
											: "Show password"
									}
								>
									{showPassword ? <EyeOff /> : <Eye />}
								</button>
							</div>
						</label>

						<div className="flex items-center justify-between text-sm select-none">
							<label
								htmlFor="remember"
								className="inline-flex items-center text-gray-700 cursor-pointer"
							>
								<input
									type="checkbox"
									checked={form.remember_me}
									onChange={(e) =>
										setform({
											...form,
											remember_me: e.target.checked,
										})
									}
									id="remember"
									className="h-4 w-4 rounded border-gray-300 mr-2 accent-green-600"
								/>
								Remember me
							</label>
						</div>
					</div>

					<button
						disabled={isSubmitting}
						type="submit"
						className={`mt-6 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-all duration-300 mb-6 ${
							isSubmitting ? "opacity-60 cursor-not-allowed" : ""
						}`}
						aria-label="Sign In"
						aria-busy={isSubmitting}
						aria-disabled={isSubmitting}
					>
						{isSubmitting ? "Signing In..." : "Sign In"}
					</button>

					<p className="text-center text-gray-500 text-sm">
						For Gordon College students only
					</p>
				</form>

				<nav aria-label="Quick actions" className="mt-6">
					<div className="flex flex-row max-w-md justify-center items-center gap-4 mt-6 mx-auto h-full">
						<a
							href="/search"
							role="button"
							className="w-full bg-white/95 shadow-lg rounded-xl p-4 flex flex-col items-center h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
							aria-label="Find Items"
						>
							<Search
								className="text-blue-600 text-2xl h-6 w-6 mb-2"
								aria-hidden="true"
							/>
							<h2 className="text-gray-900 text-sm font-medium">
								Find Items
							</h2>
						</a>

						<a
							href="/claims"
							role="button"
							className="w-full bg-white/95 shadow-lg rounded-xl p-4 flex flex-col items-center h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
							aria-label="Secure Claims"
						>
							<Shield
								className="text-green-600 text-2xl h-6 w-6 mb-2"
								aria-hidden="true"
							/>
							<h2 className="text-gray-900 text-sm font-medium">
								Secure Claims
							</h2>
						</a>
					</div>
				</nav>

				<p className="text-center text-gray-300 text-sm mt-6">
					&copy; {new Date().getFullYear()} GC YoFinder. All rights
					reserved.
				</p>
			</main>
		</div>
	);
}
