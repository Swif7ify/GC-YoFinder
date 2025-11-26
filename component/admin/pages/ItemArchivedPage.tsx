"use client";

import React from "react";
import { ArchiveIcon } from "lucide-react";

export default function ItemArchivedPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Archived Items</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-1">View rejected and removed item listings</p>
			</div>

			<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
				<ArchiveIcon size={48} className="mx-auto text-gray-400 mb-4" />
				<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No archived items</h3>
				<p className="text-gray-500 dark:text-gray-400 mt-1">Rejected and removed items will appear here</p>
			</div>
		</div>
	);
}
