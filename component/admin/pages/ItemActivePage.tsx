"use client";

import React, { useState, useMemo } from "react";
import {
	RefreshCwIcon,
	SearchIcon,
	MapPinIcon,
	CalendarIcon,
	UserIcon,
	ImageIcon,
	EyeIcon,
	PackageIcon,
	XIcon,
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
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);

	const filteredItems = useMemo(() => {
		return items.filter((item) => {
			const matchesSearch =
				item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.location.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesType = typeFilter === "all" || item.type === typeFilter;
			return matchesSearch && matchesType;
		});
	}, [items, searchQuery, typeFilter]);

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
			<div className="flex items-center gap-4 flex-wrap">
				<div className="relative flex-1 min-w-[200px]">
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
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Items List */}
				<div className="lg:col-span-2 space-y-4">
					{filteredItems.length === 0 ? (
						<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
							<PackageIcon size={48} className="mx-auto text-gray-400 mb-4" />
							<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No active items</h3>
							<p className="text-gray-500 dark:text-gray-400 mt-1">No items match your search criteria</p>
						</div>
					) : (
						filteredItems.map((item) => (
							<div
								key={item._id}
								className={`bg-white dark:bg-neutral-900 rounded-xl border ${
									selectedItem?._id === item._id
										? "border-emerald-500 ring-2 ring-emerald-500/20"
										: "border-gray-200 dark:border-neutral-800"
								} p-4 cursor-pointer hover:shadow-md transition-all`}
								onClick={() => setSelectedItem(item)}
							>
								<div className="flex items-start gap-4">
									<div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
										{item.photos && item.photos.length > 0 ? (
											<Image
												src={item.photos[0].url}
												alt={item.name}
												width={80}
												height={80}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<ImageIcon size={24} className="text-gray-400" />
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
													{item.name}
												</h3>
												<div className="flex items-center gap-2 mt-1">
													<span
														className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
															item.type === "lost"
																? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
																: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
														}`}
													>
														{item.type.toUpperCase()}
													</span>
													<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
														Active
													</span>
												</div>
											</div>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{formatDate(item.created_at)}
											</span>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
											{item.description}
										</p>
										<div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
											<span className="flex items-center gap-1">
												<MapPinIcon size={12} />
												{item.location}
											</span>
											<span className="flex items-center gap-1">
												<EyeIcon size={12} />
												{item.views} views
											</span>
											<span className="flex items-center gap-1">
												<UserIcon size={12} />
												{item.user_id
													? `${item.user_id.firstname} ${item.user_id.lastname}`
													: "Unknown"}
											</span>
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{/* Detail Panel */}
				<div className="lg:col-span-1">
					{selectedItem ? (
						<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5 sticky top-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">Item Details</h3>
								<button
									onClick={() => setSelectedItem(null)}
									className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded"
								>
									<XIcon size={16} className="text-gray-500" />
								</button>
							</div>

							{selectedItem.photos && selectedItem.photos.length > 0 && (
								<div className="mb-4">
									<div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800">
										<Image
											src={selectedItem.photos[0].url}
											alt={selectedItem.name}
											width={400}
											height={225}
											className="w-full h-full object-cover"
										/>
									</div>
									{selectedItem.photos.length > 1 && (
										<div className="flex gap-2 mt-2">
											{selectedItem.photos.slice(1, 4).map((photo, idx) => (
												<div
													key={idx}
													className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800"
												>
													<Image
														src={photo.url}
														alt={`${selectedItem.name} ${idx + 2}`}
														width={64}
														height={64}
														className="w-full h-full object-cover"
													/>
												</div>
											))}
										</div>
									)}
								</div>
							)}

							<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{selectedItem.name}</h4>

							<div className="flex flex-wrap gap-2 mb-3">
								<span
									className={`px-2 py-0.5 rounded-full text-xs font-medium ${
										selectedItem.type === "lost"
											? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
											: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
									}`}
								>
									{selectedItem.type.toUpperCase()}
								</span>
								<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
									Active
								</span>
								<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300 capitalize">
									{selectedItem.category}
								</span>
							</div>

							<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{selectedItem.description}</p>

							<div className="space-y-2 text-sm">
								<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
									<MapPinIcon size={14} />
									<span>{selectedItem.location}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
									<CalendarIcon size={14} />
									<span>
										{selectedItem.type === "lost" ? "Lost on" : "Found on"}{" "}
										{formatDate(selectedItem.date_lost_or_found)}
									</span>
								</div>
								<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
									<EyeIcon size={14} />
									<span>
										{selectedItem.views} views • {selectedItem.matched} matches
									</span>
								</div>
								<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
									<UserIcon size={14} />
									<span>
										{selectedItem.user_id
											? `${selectedItem.user_id.firstname} ${selectedItem.user_id.lastname}`
											: "Unknown User"}
									</span>
								</div>
								{selectedItem.user_id?.email && (
									<div className="text-xs text-gray-500 dark:text-gray-500 ml-5">
										{selectedItem.user_id.email}
									</div>
								)}
							</div>
						</div>
					) : (
						<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
							<EyeIcon size={48} className="mx-auto text-gray-400 mb-4" />
							<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select an item</h3>
							<p className="text-gray-500 dark:text-gray-400 mt-1">Click on an item to view details</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
