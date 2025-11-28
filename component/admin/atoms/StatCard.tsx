"use client";

import React from "react";

interface StatCardProps {
	label: string;
	value: string | number;
	icon: React.ReactNode;
	iconBgColor?: string;
	trend?: "up" | "down";
}

export default function StatCard({
	label,
	value,
	icon,
	iconBgColor = "bg-emerald-100 dark:bg-emerald-900/30",
}: StatCardProps) {
	return (
		<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
					<p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
				</div>
				<div className={`p-3 rounded-xl ${iconBgColor}`}>{icon}</div>
			</div>
		</div>
	);
}
