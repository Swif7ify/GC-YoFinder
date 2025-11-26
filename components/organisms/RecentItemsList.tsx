import React from "react";
import Link from "next/link";
import { RecentItemCard } from "../molecules";
import { RecentItems } from "@/types/types";

interface RecentItemsListProps {
	recentItems: RecentItems[];
}

export default function RecentItemsList({ recentItems }: RecentItemsListProps) {
	return (
		<section
			aria-labelledby="recent-items-heading"
			className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
		>
			<div className="flex items-center justify-between mb-4">
				<h2
					id="recent-items-heading"
					className="text-lg font-semibold text-gray-900 dark:text-gray-100"
				>
					Recent Items
				</h2>
				<Link
					href="/dashboard?tab=my-items"
					className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-2 py-1"
				>
					View All
				</Link>
			</div>
			<ul className="space-y-3 h-full" role="list">
				{recentItems.length > 0 ? (
					recentItems.map((item) => (
						<li key={item.id}>
							<RecentItemCard
								item={item}
								href={`/dashboard?tab=search-items&itemId=${item.id}`}
							/>
						</li>
					))
				) : (
					<li>
						<p className="text-gray-600 dark:text-gray-400">
							No recent items found.
						</p>
					</li>
				)}
			</ul>
		</section>
	);
}

