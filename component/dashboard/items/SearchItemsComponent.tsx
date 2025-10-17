"use client";

import React, { useState, useEffect } from "react";
import {
	Search,
	Filter,
	MapPin,
	Calendar,
	AlertCircle,
	CheckCircle2,
	Eye,
	MessageSquare,
	X,
	Grid3x3,
	List,
	RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { Items } from "@/types/types";
import CustomSelect from "@/ui/CustomSelect";

export default function SearchItemsComponent() {
	const [items, setItems] = useState<Items[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState<"all" | "lost" | "found">(
		"all"
	);
	const [filterStatus, setFilterStatus] = useState<
		"all" | "active" | "claimed"
	>("all");
	const [filterCategory, setFilterCategory] = useState<string>("all");
	const [filterLocation, setFilterLocation] = useState<string>("all");
	const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	const categories = [
		"Electronics",
		"Personal Items",
		"Bags & Accessories",
		"Books & Supplies",
		"Clothing",
		"Keys & Cards",
		"Sports Equipment",
		"Other",
	];

	const locations = [
		"Library 2nd Floor",
		"Cafeteria",
		"Gym Locker Room",
		"Building A",
		"Science Building 3rd Floor",
		"Admin Building Hallway",
	];

	const filterTypeOptions = ["all", "lost", "found"];

	useEffect(() => {
		// Mock data with timestamps for sorting
		setItems([
			{
				id: "1",
				title: "Black Laptop Bag",
				description:
					"A black laptop bag with a silver logo on the front. Contains my laptop and charger.",
				type: "lost",
				location: "Library 2nd Floor",
				date: "2024-10-17T10:00:00",
				status: "active",
				image_url:
					"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
				category: "Bags & Accessories",
			},
			{
				id: "2",
				title: "Blue Water Bottle",
				description:
					"A blue Hydro Flask water bottle with a floral sticker.",
				type: "found",
				location: "Cafeteria",
				date: "2024-10-17T07:00:00",
				status: "claimed",
				image_url:
					"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
				category: "Personal Items",
			},
			{
				id: "3",
				title: "Student ID Card - John Smith",
				description:
					"A college student ID card with photo. Name: John Smith, ID: 2021-12345",
				type: "found",
				location: "Gym Locker Room",
				date: "2024-10-16T12:00:00",
				status: "active",
				image_url:
					"https://images.unsplash.com/photo-1589395937784-2f3a87df93e6?w=400&h=400&fit=crop",
				category: "Personal Items",
			},
			{
				id: "4",
				title: "Red Umbrella",
				description:
					"A red umbrella with a wooden handle and auto-open feature.",
				type: "lost",
				location: "Building A",
				date: "2024-10-15T09:00:00",
				status: "active",
				image_url:
					"https://images.unsplash.com/photo-1527693224088-e54750ee3ea9?w=400&h=400&fit=crop",
				category: "Personal Items",
			},
			{
				id: "5",
				title: "Organic Chemistry Textbook",
				description:
					"8th Edition Organic Chemistry textbook with notes inside.",
				type: "found",
				location: "Science Building 3rd Floor",
				date: "2024-10-14T15:00:00",
				status: "active",
				image_url:
					"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop",
				category: "Books & Supplies",
			},
			{
				id: "6",
				title: "Wireless Earbuds (AirPods)",
				description:
					"White Apple AirPods Pro with charging case. Left near the water fountain.",
				type: "found",
				location: "Admin Building Hallway",
				date: "2024-10-13T11:00:00",
				status: "active",
				image_url:
					"https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop",
				category: "Personal Items",
			},
		]);
	}, []);

	const resetFilters = () => {
		setSearchQuery("");
		setFilterType("all");
		setFilterStatus("all");
		setFilterCategory("all");
		setFilterLocation("all");
		setSortBy("latest");
	};

	const filteredItems = items
		.filter((item) => {
			const matchesSearch =
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				item.location.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesType =
				filterType === "all" || item.type === filterType;
			const matchesStatus =
				filterStatus === "all" || item.status === filterStatus;
			const matchesLocation =
				filterLocation === "all" || item.location === filterLocation;
			const matchesCategory =
				filterCategory === "all" || item.category === filterCategory;

			return (
				matchesSearch &&
				matchesType &&
				matchesStatus &&
				matchesLocation &&
				matchesCategory
			);
		})
		.sort((a, b) => {
			const dateA = new Date(a.date).getTime();
			const dateB = new Date(b.date).getTime();
			return sortBy === "latest" ? dateB - dateA : dateA - dateB;
		});

	return (
		<div className="space-y-6">
			{/* Header */}
			<section aria-labelledby="search-heading">
				<h1
					id="search-heading"
					className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
				>
					Search Items
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Browse and search through lost and found items
				</p>
			</section>

			{/* Search and Filters */}
			<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					{/* Search Bar */}
					<div className="flex-1 relative">
						<Search
							size={20}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
							aria-hidden="true"
						/>
						<input
							type="search"
							placeholder="Search by title, description, or location..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-neutral-700  rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
							aria-label="Search items"
						/>
					</div>
				</div>

				{/* Filter Panel */}
				<div
					id="filter-panel"
					className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800 space-y-4"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
						<div>
							<label
								htmlFor="filter-type"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Item Type
							</label>
							<CustomSelect
								value={filterType}
								onValueChange={(value) =>
									setFilterType(
										value as "all" | "lost" | "found"
									)
								}
								options={filterTypeOptions.map((type) => ({
									value: type,
									label:
										type.charAt(0).toUpperCase() +
										type.slice(1),
								}))}
							/>
						</div>

						<div>
							<label
								htmlFor="filter-category"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Category
							</label>
							<CustomSelect
								value={filterCategory}
								onValueChange={(value) =>
									setFilterCategory(value)
								}
								options={[
									{ value: "all", label: "All Categories" },
									...categories.map((cat) => ({
										value: cat,
										label:
											cat.charAt(0).toUpperCase() +
											cat.slice(1),
									})),
								]}
							/>
						</div>

						<div>
							<label
								htmlFor="filter-location"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Location
							</label>

							<CustomSelect
								value={filterLocation}
								onValueChange={(value) =>
									setFilterLocation(value)
								}
								options={[
									{ value: "all", label: "All Locations" },
									...locations.map((loc) => ({
										value: loc,
										label:
											loc.charAt(0).toUpperCase() +
											loc.slice(1),
									})),
								]}
							/>
						</div>

						<div>
							<label
								htmlFor="filter-status"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Status
							</label>
							<CustomSelect
								value={filterStatus}
								onValueChange={(value) =>
									setFilterStatus(
										value as "all" | "active" | "claimed"
									)
								}
								options={[
									{ value: "all", label: "All Status" },
									{ value: "active", label: "Active" },
									{ value: "claimed", label: "Claimed" },
								]}
							/>
						</div>

						<div>
							<label
								htmlFor="sort-by"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Sort By Date
							</label>
							<CustomSelect
								value={sortBy}
								onValueChange={(value) =>
									setSortBy(value as "latest" | "oldest")
								}
								options={[
									{ value: "latest", label: "Latest First" },
									{ value: "oldest", label: "Oldest First" },
								]}
							/>
						</div>
					</div>

					{/* Reset Filters Button */}
					<div className="flex justify-end">
						<button
							type="button"
							onClick={resetFilters}
							className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center gap-2"
							aria-label="Reset all filters"
						>
							<RotateCcw size={16} aria-hidden="true" />
							Reset Filters
						</button>
					</div>
				</div>
			</div>

			{/* Results Count and View Toggle */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-gray-600 dark:text-gray-400">
					<span className="font-medium text-gray-900 dark:text-gray-100">
						{filteredItems.length}
					</span>{" "}
					{filteredItems.length === 1 ? "item" : "items"} found
				</p>

				{/* View Toggle */}
				<div
					className="flex gap-2 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-1"
					role="group"
					aria-label="View mode"
				>
					<button
						type="button"
						onClick={() => setViewMode("grid")}
						className={`p-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
							viewMode === "grid"
								? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
						aria-label="Grid view"
						aria-pressed={viewMode === "grid"}
					>
						<Grid3x3 size={18} aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={() => setViewMode("list")}
						className={`p-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
							viewMode === "list"
								? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
						aria-label="List view"
						aria-pressed={viewMode === "list"}
					>
						<List size={18} aria-hidden="true" />
					</button>
				</div>
			</div>

			{/* Items Grid/List */}
			<section aria-labelledby="results-heading">
				<h2 id="results-heading" className="sr-only">
					Search Results
				</h2>

				{filteredItems.length > 0 ? (
					<div
						className={
							viewMode === "grid"
								? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
								: "space-y-4"
						}
					>
						{filteredItems.map((item) =>
							viewMode === "grid" ? (
								<article
									key={item.id}
									className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow group"
								>
									{/* Image */}
									<div className="relative h-48 bg-gray-100 dark:bg-gray-700">
										<Image
											src={
												item.image_url ||
												"https://images.unsplash.com/photo-1654965778976-409444e9826b?w=400"
											}
											alt={item.title}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
										/>

										{/* Type Badge */}
										<div
											className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
												item.type === "lost"
													? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
													: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
											}`}
										>
											{item.type === "lost" ? (
												<AlertCircle
													size={14}
													aria-hidden="true"
												/>
											) : (
												<CheckCircle2
													size={14}
													aria-hidden="true"
												/>
											)}
											{item.type === "lost"
												? "Lost"
												: "Found"}
										</div>

										{/* Status Badge */}
										{item.status === "claimed" && (
											<div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
												Claimed
											</div>
										)}
									</div>

									{/* Content */}
									<div className="p-4">
										<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
											{item.title}
										</h3>

										<p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
											{item.description}
										</p>

										<div className="space-y-2 mb-4">
											<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
												<MapPin
													size={14}
													className="flex-shrink-0"
													aria-hidden="true"
												/>
												<span className="truncate">
													{item.location}
												</span>
											</div>

											<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
												<Calendar
													size={14}
													className="flex-shrink-0"
													aria-hidden="true"
												/>
												<span>{item.date}</span>
											</div>
										</div>

										{/* Actions */}
										<div className="flex gap-2">
											<button
												type="button"
												className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center justify-center gap-2"
												aria-label={`View details of ${item.title}`}
											>
												<Eye
													size={16}
													aria-hidden="true"
												/>
												View Details
											</button>

											<button
												type="button"
												className="px-4 py-2 border border-gray-300 dark:border-neutral-700  hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
												aria-label={`Contact about ${item.title}`}
											>
												<MessageSquare
													size={16}
													aria-hidden="true"
												/>
											</button>
										</div>
									</div>
								</article>
							) : (
								<article
									key={item.id}
									className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow"
								>
									<div className="flex flex-col sm:flex-row gap-4 p-4">
										{/* Image */}
										<div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
											<Image
												src={
													item.image_url ||
													"https://images.unsplash.com/photo-1654965778976-409444e9826b?w=400"
												}
												alt={item.title}
												fill
												className="object-cover"
												sizes="(max-width: 768px) 100vw, 128px"
											/>
										</div>

										{/* Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-4 mb-2">
												<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
													{item.title}
												</h3>

												{/* Badges */}
												<div className="flex gap-2 flex-shrink-0">
													<div
														className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
															item.type === "lost"
																? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
																: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
														}`}
													>
														{item.type ===
														"lost" ? (
															<AlertCircle
																size={12}
																aria-hidden="true"
															/>
														) : (
															<CheckCircle2
																size={12}
																aria-hidden="true"
															/>
														)}
														{item.type === "lost"
															? "Lost"
															: "Found"}
													</div>
													{item.status ===
														"claimed" && (
														<div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
															Claimed
														</div>
													)}
												</div>
											</div>

											<p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
												{item.description}
											</p>

											<div className="flex flex-wrap items-center gap-4 mb-3">
												<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
													<MapPin
														size={14}
														className="flex-shrink-0"
														aria-hidden="true"
													/>
													<span className="truncate">
														{item.location}
													</span>
												</div>

												<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
													<Calendar
														size={14}
														className="flex-shrink-0"
														aria-hidden="true"
													/>
													<span>
														{new Date(
															item.date
														).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															}
														)}
													</span>
												</div>
											</div>

											{/* Actions */}
											<div className="flex gap-2">
												<button
													type="button"
													className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center gap-2"
													aria-label={`View details of ${item.title}`}
												>
													<Eye
														size={16}
														aria-hidden="true"
													/>
													View Details
												</button>

												<button
													type="button"
													className="px-4 py-2 border border-gray-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
													aria-label={`Contact about ${item.title}`}
												>
													<MessageSquare
														size={16}
														aria-hidden="true"
													/>
												</button>
											</div>
										</div>
									</div>
								</article>
							)
						)}
					</div>
				) : (
					<div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
						<div
							className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
							aria-hidden="true"
						>
							<Search
								size={32}
								className="text-gray-400 dark:text-gray-500"
							/>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
							No items found
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Try adjusting your search or filters
						</p>
					</div>
				)}
			</section>
		</div>
	);
}
