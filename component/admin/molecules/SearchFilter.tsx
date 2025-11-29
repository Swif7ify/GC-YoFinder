"use client";

import React from "react";
import { SearchIcon } from "lucide-react";

interface SearchFilterProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	placeholder?: string;
	typeFilter?: "all" | "lost" | "found";
	onTypeFilterChange?: (value: "all" | "lost" | "found") => void;
	showTypeFilter?: boolean;
}

export default function SearchFilter({
	searchQuery,
	onSearchChange,
	placeholder = "Search items...",
	typeFilter = "all",
	onTypeFilterChange,
	showTypeFilter = true,
}: SearchFilterProps) {
	return (
		<div className="flex items-center gap-4 flex-wrap">
			{/* Search */}
			<div className="relative flex-1 min-w-[200px]">
				<SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder={placeholder}
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
				/>
			</div>

			{/* Type Filter */}
			{showTypeFilter && onTypeFilterChange && (
				<div className="flex gap-2">
					{(["all", "lost", "found"] as const).map((type) => (
						<button
							key={type}
							onClick={() => onTypeFilterChange(type)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
								typeFilter === type
									? type === "lost"
										? "bg-red-600 text-white"
										: type === "found"
										? "bg-emerald-600 text-white"
										: "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
									: "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
							}`}
						>
							{type}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
