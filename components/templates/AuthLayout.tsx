import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
}

export default function AuthLayout({
	children,
	title,
	subtitle,
}: AuthLayoutProps) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<Image
						src="/logo.png"
						alt="GC Yofinder logo"
						width={64}
						height={64}
						className="mx-auto rounded-full mb-4"
					/>
					{title && (
						<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
							{title}
						</h2>
					)}
					{subtitle && (
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							{subtitle}
						</p>
					)}
				</div>
				<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-8">
					{children}
				</div>
			</div>
		</div>
	);
}

