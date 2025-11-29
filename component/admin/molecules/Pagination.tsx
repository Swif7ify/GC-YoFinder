"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
}: PaginationProps) {
	if (totalPages <= 1) return null;

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= 4; i++) pages.push(i);
				pages.push("...");
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1);
				pages.push("...");
				for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
			} else {
				pages.push(1);
				pages.push("...");
				for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
				pages.push("...");
				pages.push(totalPages);
			}
		}
		return pages;
	};

	return (
		<div className="mt-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
				{/* Page Info */}
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Showing <span className="font-medium text-gray-900 dark:text-gray-100">{startIndex + 1}</span> to{" "}
					<span className="font-medium text-gray-900 dark:text-gray-100">{endIndex}</span> of{" "}
					<span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span> results
				</p>

				{/* Pagination Buttons */}
				<div className="flex items-center gap-2">
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						aria-label="Previous page"
					>
						<ChevronLeftIcon size={18} />
					</button>

					<div className="flex items-center gap-1">
						{getPageNumbers().map((page, idx) => {
							if (page === "...") {
								return (
									<span
										key={`ellipsis-${idx}`}
										className="px-3 py-2 text-gray-500 dark:text-gray-400"
									>
										...
									</span>
								);
							}
							return (
								<button
									key={page}
									onClick={() => onPageChange(page as number)}
									className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										currentPage === page
											? "bg-emerald-600 text-white"
											: "border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300"
									}`}
								>
									{page}
								</button>
							);
						})}
					</div>

					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						aria-label="Next page"
					>
						<ChevronRightIcon size={18} />
					</button>
				</div>
			</div>
		</div>
	);
}
