import React, { Suspense } from "react";
import DashboardClient from "@/clients/DashboardClient";
import { HashLoader } from "react-spinners";

function DashboardFallback() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
			<div className="text-center flex items-center flex-col">
				<HashLoader color="#4ade80" />
				<p className="mt-4 text-gray-800 dark:text-gray-300">
					Loading dashboard...
				</p>
			</div>
		</div>
	);
}

export default function DashboardPage() {
	return (
		<Suspense fallback={<DashboardFallback />}>
			<DashboardClient />
		</Suspense>
	);
}
