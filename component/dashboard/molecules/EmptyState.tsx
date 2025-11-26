"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description?: string;
	action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
	return (
		<div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
			<div
				className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
				aria-hidden="true"
			>
				<Icon size={32} className="text-gray-400 dark:text-gray-500" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
			{description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
			{action}
		</div>
	);
}
