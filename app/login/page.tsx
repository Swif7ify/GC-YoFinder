"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { EyeOff, Eye, Mail, Lock, Shield, Search } from "lucide-react";
import { toastError, toastSuccess } from "@/utils/toast";
import { api } from "@/lib/api.config";
import { useRouter } from "next/navigation";
import { useApiLoading } from "@/hooks/useApiLoading";

export default function LoginPage() {
	const router = useRouter();
	const { withLoading } = useApiLoading();
	const [showPassword, setShowPassword] = useState(false);
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
		if (!/\S+@\S+\.\S+/.test(email)) {
			toastError(
				"Email is invalid.",
				"Please enter a valid email address."
			);
			return false;
		}
		return true;
	};

	useEffect(() => {
		withLoading(async () => {
			// await a real promise, not a plain setTimeout call
			await new Promise((resolve) => setTimeout(resolve, 5000));
		});
		// include withLoading in deps
	}, [withLoading]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);

		if (!validateEmail()) {
			return;
		}

		try {
			const response = await api("/api/signin-user", {
				method: "POST",
				body: JSON.stringify(form),
			});

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

	return (
		<div className="relative">
			<div className="fixed inset-0 -z-10 select-none">
				<Image
					src="/signin/GordonCollegeSchool.png"
					alt="Gordon College campus"
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
			</div>

			{/* form */}
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md mx-auto mt-12 bg-white/95 shadow-lg rounded-xl p-8"
				aria-label="Gordon College sign in"
			>
				<div className="flex flex-col items-center mb-6">
					<Image
						src="/logo.png"
						alt="Logo"
						width={84}
						height={84}
						className="rounded-full mb-4"
					/>
					<h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
						Student Sign In
					</h1>
					<p className="text-sm text-gray-600">
						Gordon College · YoFinder
					</p>
				</div>

				<div className="space-y-4">
					<label htmlFor="email" className="block">
						<span className="text-sm font-medium text-gray-700">
							Student ID / Email
						</span>
						<div className="relative mt-1">
							<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
								<Mail size={20} />
							</span>
							<input
								id="email"
								name="email"
								type="email"
								onChange={(e) =>
									setform({ ...form, email: e.target.value })
								}
								required
								autoComplete="username"
								placeholder="you@gordoncollege.edu.ph"
								className="w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
								aria-label="Student ID or Email"
							/>
						</div>
					</label>

					<label htmlFor="password" className="block">
						<span className="text-sm font-medium text-gray-700">
							Password
						</span>
						<div className="relative mt-1">
							<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
								<Lock size={20} />
							</span>
							<input
								id="password"
								name="password"
								type={`${showPassword ? "text" : "password"}`}
								onChange={(e) =>
									setform({
										...form,
										password: e.target.value,
									})
								}
								required
								autoComplete="current-password"
								placeholder="Enter your password"
								className="w-full pl-10 pr-12 py-2 border rounded-md border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
								aria-label="Password"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
								onClick={() => setShowPassword(!showPassword)}
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
								id="remember"
								className="h-4 w-4 rounded border-gray-300 mr-2 accent-green-600"
							/>
							Remember me
						</label>
					</div>
				</div>

				<button
					type="submit"
					className="mt-6 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-all duration-300 mb-6"
				>
					Sign In
				</button>

				<p className="text-center text-gray-500 text-sm">
					For Gordon College students only
				</p>
			</form>

			<div className="flex flex-row max-w-md justify-center items-center gap-4 mt-6 mx-auto h-full">
				<div className="w-full bg-white/95 shadow-lg rounded-xl p-4 flex flex-col items-center h-full ">
					<Search className="text-blue-600 text-2xl h-6 w-6 mb-2" />
					<h1 className="text-gray-900">Find Items</h1>
				</div>
				<div className="w-full bg-white/95 shadow-lg rounded-xl p-4 flex flex-col items-center h-full">
					<Shield className="text-green-600 text-2xl h-6 w-6 mb-2" />
					<h1 className="text-gray-900">Secure Claims</h1>
				</div>
			</div>
			<p className="text-center text-gray-300 text-sm mt-6">
				&copy; {new Date().getFullYear()} GC YoFinder. All rights
				reserved.
			</p>
		</div>
	);
}
