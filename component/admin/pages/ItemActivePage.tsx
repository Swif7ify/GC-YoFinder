"use client";

import React, { useState } from "react";
import {
	RefreshCwIcon,
	SearchIcon,
	MapPinIcon,
	CalendarIcon,
	UserIcon,
	ImageIcon,
	EyeIcon,
	PackageIcon,
} from "lucide-react";
import Image from "next/image";

interface Item {
	_id: string;
	name: string;
	description: string;
	type: "lost" | "found";
	status: string;
	category: string;
	location: string;
	date_lost_or_found: string;
	views: number;
	matched: number;
	photos: { url: string }[];
	user_id: {
		_id: string;
		firstname: string;
		lastname: string;
		email: string;
		username: string;
	} | null;
	created_at: string;
}

interface ItemActivePageProps {
	items?: Item[];
	onRefresh?: () => void;
}

export default function ItemActivePage({ items = [], onRefresh }: ItemActivePageProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<"all" | "lost" | "found">("all");

	const filteredItems = items.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.location.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = typeFilter === "all" || item.type === typeFilter;
		return matchesSearch && matchesType;
	});

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Active Listings</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						View all active lost & found items ({items.length} active)
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

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search active items..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
					/>
				</div>
				<div className="flex gap-2">
					{(["all", "lost", "found"] as const).map((type) => (
						<button
							key={type}
							onClick={() => setTypeFilter(type)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
								typeFilter === type
									? "bg-emerald-600 text-white"
									: "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
							}`}
						>
							{type}
						</button>
					))}
				</div>
			</div>

			{/* Items Grid */}
			{filteredItems.length === 0 ? (
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
					<PackageIcon size={48} className="mx-auto text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No active items</h3>
					<p className="text-gray-500 dark:text-gray-400 mt-1">No items match your search criteria</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredItems.map((item) => (
						<div
							key={item._id}
							className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-all"
						>
							{/* Image */}
							<div className="aspect-video bg-gray-100 dark:bg-neutral-800 relative">
								{item.photos && item.photos.length > 0 ? (
									<Image src={item.photos[0].url} alt={item.name} fill className="object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<ImageIcon size={32} className="text-gray-400" />
									</div>
								)}
								<span
									className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
										item.type === "lost" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
									}`}
								>
									{item.type.toUpperCase()}
								</span>
							</div>

							{/* Content */}
							<div className="p-4">
								<h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
									{item.description}
								</p>

								<div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
									<span className="flex items-center gap-1">
										<MapPinIcon size={12} />
										{item.location}
									</span>
									<span className="flex items-center gap-1">
										<EyeIcon size={12} />
										{item.views} views
									</span>
								</div>

								<div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800">
									<div className="flex items-center gap-2">
										<UserIcon size={14} className="text-gray-400" />
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{item.user_id
												? `${item.user_id.firstname} ${item.user_id.lastname}`
												: "Unknown"}
										</span>
									</div>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{formatDate(item.created_at)}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
