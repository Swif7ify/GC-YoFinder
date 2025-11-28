"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api.config";
import { toastError, toastSuccess } from "@/utils/toast";

const AdminLogin = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await api("/api/signin-admin", {
				method: "POST",
				body: JSON.stringify(formData),
			});

			if (response.status !== 200) {
				toastError("Invalid credentials", "Please Try Again");
				return;
			}
			toastSuccess("Login Successful", "Redirecting to dashboard");
			router.replace("/dashboard-admin");
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
				{/* Header Section */}
				<header className="flex items-center flex-col px-8 pt-8">
					<Image src="/logo.png" alt="Logo" width={100} height={100} className="rounded-full" />
					<div className="bg-white  text-center mt-2">
						<h2 className="text-2xl font-bold text-black">Admin Portal</h2>
						<p className="text-slate-400 text-sm mt-1">Secure access to dashboard</p>
					</div>
				</header>

				{/* Form Section */}
				<div className="p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Input */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Email Address</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="email"
									name="email"
									required
									className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-400"
									placeholder="admin@company.com"
									value={formData.email}
									onChange={handleChange}
								/>
							</div>
						</div>

						{/* Password Input */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label className="text-sm font-medium text-gray-700">Password</label>
							</div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									required
									className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-400"
									placeholder="••••••••"
									value={formData.password}
									onChange={handleChange}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
								>
									{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<svg
										className="animate-spin h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Signing in...
								</span>
							) : (
								<span className="flex items-center gap-2">
									Sign In <ArrowRight className="w-4 h-4" />
								</span>
							)}
						</button>
					</form>
				</div>

				{/* Footer */}
				<div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-center">
					<p className="text-xs text-gray-500">
						Protected by Enterprise Security.{" "}
						<span className="underline cursor-pointer">Privacy Policy</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
