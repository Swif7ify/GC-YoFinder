"use client";

import React from "react";

interface EmptyStateProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
	return (
		<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
			<div className="mx-auto text-gray-400 mb-4">{icon}</div>
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
			<p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}
