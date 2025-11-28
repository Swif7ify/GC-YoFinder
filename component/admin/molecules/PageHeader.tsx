"use client";

import React from "react";
import { RefreshCwIcon } from "lucide-react";

interface PageHeaderProps {
	title: string;
	description: string;
	onRefresh?: () => void;
	actions?: React.ReactNode;
}

export default function PageHeader({ title, description, onRefresh, actions }: PageHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
			</div>
			<div className="flex items-center gap-2">
				{actions}
				{onRefresh && (
					<button
						onClick={onRefresh}
						className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
					>
						<RefreshCwIcon size={16} />
						Refresh
					</button>
				)}
			</div>
		</div>
	);
}
