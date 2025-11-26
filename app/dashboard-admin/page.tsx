import React, { Suspense } from "react";
import AdminClient from "@/clients/AdminClient";
import { HashLoader } from "react-spinners";

function AdminDashboardFallback() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
			<div className="text-center flex items-center flex-col">
				<HashLoader color="#4ade80" />
				<p className="mt-4 text-gray-800 dark:text-gray-300">Loading dashboard...</p>
			</div>
		</div>
	);
}

export default function AdminDashboardPage() {
	return (
		<Suspense fallback={<AdminDashboardFallback />}>
			<AdminClient />
		</Suspense>
	);
}
