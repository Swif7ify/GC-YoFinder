"use client";

import React, { useState } from "react";
import {
	ClockIcon,
	PackageIcon,
	UserIcon,
	MapPinIcon,
	FilterIcon,
	SearchIcon,
	RefreshCwIcon,
	CalendarIcon,
} from "lucide-react";

interface RecentItem {
	id: string;
	name: string;
	type: string;
	status: string;
	category: string;
	location: string;
	createdAt: string;
	user: { id: string; name: string; username: string; photo: string | null } | null;
}

interface DashboardStats {
	recentItems?: RecentItem[];
	itemsToday?: number;
	itemsThisWeek?: number;
	itemsThisMonth?: number;
}

interface ActivityPageProps {
	stats?: DashboardStats | null;
	onRefresh?: () => void;
}

export default function ActivityPage({ stats, onRefresh }: ActivityPageProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<"all" | "lost" | "found">("all");
	const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "active" | "claimed" | "rejected">("all");
	const [showFilters, setShowFilters] = useState(false);

	if (!stats) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
			</div>
		);
	}

	const filteredItems = (stats.recentItems || []).filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.user?.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = typeFilter === "all" || item.type === typeFilter;
		const matchesStatus = statusFilter === "all" || item.status === statusFilter;
		return matchesSearch && matchesType && matchesStatus;
	});

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins} min ago`;
		if (diffHours < 24) return `${diffHours} hours ago`;
		if (diffDays < 7) return `${diffDays} days ago`;
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
			case "active":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
			case "claimed":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
			case "rejected":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
		}
	};

	const getTypeColor = (type: string) => {
		return type === "lost"
			? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
			: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
	};

	const activeFiltersCount = (typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Activity Logs</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">Recent platform activity and submissions</p>
				</div>
				<button
					onClick={onRefresh}
					className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
				>
					<RefreshCwIcon size={16} />
					Refresh
				</button>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
					<div className="flex items-center gap-3">
						<CalendarIcon size={24} className="text-blue-200" />
						<div>
							<p className="text-blue-100 text-sm">Items Today</p>
							<p className="text-2xl font-bold">{stats.itemsToday || 0}</p>
						</div>
					</div>
				</div>
				<div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
					<div className="flex items-center gap-3">
						<CalendarIcon size={24} className="text-emerald-200" />
						<div>
							<p className="text-emerald-100 text-sm">Items This Week</p>
							<p className="text-2xl font-bold">{stats.itemsThisWeek || 0}</p>
						</div>
					</div>
				</div>
				<div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
					<div className="flex items-center gap-3">
						<CalendarIcon size={24} className="text-purple-200" />
						<div>
							<p className="text-purple-100 text-sm">Items This Month</p>
							<p className="text-2xl font-bold">{stats.itemsThisMonth || 0}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					{/* Search */}
					<div className="relative flex-1">
						<SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search by item name, location, or user..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
						/>
					</div>

					{/* Filter Toggle */}
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
							showFilters || activeFiltersCount > 0
								? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
								: "border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
						}`}
					>
						<FilterIcon size={16} />
						Filters
						{activeFiltersCount > 0 && (
							<span className="px-1.5 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
								{activeFiltersCount}
							</span>
						)}
					</button>
				</div>

				{/* Filter Options */}
				{showFilters && (
					<div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
						<div className="flex flex-wrap gap-4">
							{/* Type Filter */}
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Type
								</label>
								<div className="flex gap-2">
									{(["all", "lost", "found"] as const).map((type) => (
										<button
											key={type}
											onClick={() => setTypeFilter(type)}
											className={`px-3 py-1.5 text-sm rounded-lg transition-colors capitalize ${
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

							{/* Status Filter */}
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Status
								</label>
								<div className="flex flex-wrap gap-2">
									{(["all", "pending", "active", "claimed", "rejected"] as const).map((status) => (
										<button
											key={status}
											onClick={() => setStatusFilter(status)}
											className={`px-3 py-1.5 text-sm rounded-lg transition-colors capitalize ${
												statusFilter === status
													? "bg-emerald-600 text-white"
													: "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
											}`}
										>
											{status}
										</button>
									))}
								</div>
							</div>

							{/* Clear Filters */}
							{activeFiltersCount > 0 && (
								<div className="flex items-end">
									<button
										onClick={() => {
											setTypeFilter("all");
											setStatusFilter("all");
										}}
										className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
									>
										Clear filters
									</button>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Activity Timeline */}
			<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
					<span className="text-sm text-gray-500 dark:text-gray-400">
						{filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
					</span>
				</div>

				{filteredItems.length === 0 ? (
					<div className="text-center py-12">
						<ClockIcon size={48} className="mx-auto text-gray-400 mb-4" />
						<h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">No activity found</h4>
						<p className="text-gray-500 dark:text-gray-400 mt-1">
							{searchQuery || activeFiltersCount > 0
								? "Try adjusting your search or filters"
								: "No recent activity to display"}
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{filteredItems.map((item) => (
							<div
								key={item.id}
								className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors"
							>
								<div
									className={`p-2 rounded-lg ${
										item.type === "lost"
											? "bg-red-100 dark:bg-red-900/30"
											: "bg-emerald-100 dark:bg-emerald-900/30"
									}`}
								>
									<PackageIcon
										size={20}
										className={
											item.type === "lost"
												? "text-red-600 dark:text-red-400"
												: "text-emerald-600 dark:text-emerald-400"
										}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
											<div className="flex flex-wrap items-center gap-2 mt-1">
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
														item.type
													)}`}
												>
													{item.type.toUpperCase()}
												</span>
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
														item.status
													)}`}
												>
													{item.status}
												</span>
												<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 capitalize">
													{item.category}
												</span>
											</div>
										</div>
										<span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex items-center gap-1">
											<ClockIcon size={12} />
											{formatDate(item.createdAt)}
										</span>
									</div>
									<div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
										<span className="flex items-center gap-1">
											<MapPinIcon size={14} />
											{item.location}
										</span>
										<span className="flex items-center gap-1">
											<UserIcon size={14} />
											{item.user?.name || "Unknown User"}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
