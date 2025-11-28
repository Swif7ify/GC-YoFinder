"use client";

import React, { useState } from "react";
import { ArchiveIcon, RefreshCwIcon, SearchIcon, MapPinIcon, CalendarIcon, UserIcon, ImageIcon } from "lucide-react";
import Image from "next/image";

interface Item {
	_id: string;
	name: string;
	description: string;
	type: "lost" | "found";
	status: string;
	category: string;
	location: string;
	photos: { url: string }[];
	user_id: {
		firstname: string;
		lastname: string;
	} | null;
	created_at: string;
	updated_at: string;
}

interface ItemArchivedPageProps {
	items?: Item[];
	onRefresh?: () => void;
}

export default function ItemArchivedPage({ items = [], onRefresh }: ItemArchivedPageProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredItems = items.filter(
		(item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.location.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Archived Items</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Removed item listings ({items.length} total)
					</p>
				</div>
				<button
					onClick={onRefresh}
					className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
				>
					<RefreshCwIcon size={16} />
					Refresh
				</button>
			</div>

			<div className="relative">
				<SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder="Search archived items..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100"
				/>
			</div>

			<div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-6 text-white">
				<div className="flex items-center gap-4">
					<ArchiveIcon size={32} />
					<div>
						<h3 className="text-2xl font-bold">{items.length} Items Archived</h3>
						<p className="text-gray-200">Removed from active listings</p>
					</div>
				</div>
			</div>

			{filteredItems.length === 0 ? (
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
					<ArchiveIcon size={48} className="mx-auto text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No archived items</h3>
					<p className="text-gray-500 dark:text-gray-400 mt-1">Removed items will appear here</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredItems.map((item) => (
						<div
							key={item._id}
							className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4 opacity-75"
						>
							<div className="flex items-start gap-3">
								<div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
									{item.photos?.[0]?.url ? (
										<Image
											src={item.photos[0].url}
											alt={item.name}
											width={64}
											height={64}
											className="w-full h-full object-cover grayscale"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<ImageIcon size={24} className="text-gray-400" />
										</div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
										{item.name}
									</h3>
									<div className="flex items-center gap-2 mt-1">
										<span
											className={`inline-block px-2 py-0.5 rounded-full text-xs ${
												item.type === "lost"
													? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
													: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
											}`}
										>
											{item.type.toUpperCase()}
										</span>
										<span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
											Archived
										</span>
									</div>
									<div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
										<MapPinIcon size={12} />
										{item.location}
									</div>
									<div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
										<UserIcon size={12} />
										{item.user_id
											? `${item.user_id.firstname} ${item.user_id.lastname}`
											: "Unknown"}
									</div>
									<div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
										<CalendarIcon size={12} />
										Archived {formatDate(item.updated_at || item.created_at)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
