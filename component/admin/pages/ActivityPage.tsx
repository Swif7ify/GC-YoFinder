"use client";

import React from "react";
import { ClockIcon, PackageIcon, UserIcon, MapPinIcon } from "lucide-react";

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
}

export default function ActivityPage({ stats }: ActivityPageProps) {
	if (!stats) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
			</div>
		);
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 60) return `${diffMins} minutes ago`;
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

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Activity Logs</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-1">Recent platform activity and submissions</p>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
					<p className="text-blue-100 text-sm">Items Today</p>
					<p className="text-2xl font-bold">{stats.itemsToday || 0}</p>
				</div>
				<div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
					<p className="text-emerald-100 text-sm">Items This Week</p>
					<p className="text-2xl font-bold">{stats.itemsThisWeek || 0}</p>
				</div>
				<div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
					<p className="text-purple-100 text-sm">Items This Month</p>
					<p className="text-2xl font-bold">{stats.itemsThisMonth || 0}</p>
				</div>
			</div>

			{/* Activity Timeline */}
			<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>

				{!stats.recentItems || stats.recentItems.length === 0 ? (
					<div className="text-center py-8">
						<ClockIcon size={48} className="mx-auto text-gray-400 mb-4" />
						<p className="text-gray-500 dark:text-gray-400">No recent activity</p>
					</div>
				) : (
					<div className="space-y-4">
						{stats.recentItems.map((item) => (
							<div
								key={item.id}
								className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg"
							>
								<div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
									<PackageIcon size={20} className="text-emerald-600 dark:text-emerald-400" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between">
										<div>
											<p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
											<div className="flex items-center gap-2 mt-1">
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
										<span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
											{formatDate(item.createdAt)}
										</span>
									</div>
									<div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
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
