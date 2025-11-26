"use client";

import React from "react";
import { TrendingUpIcon, UsersIcon, PackageIcon, CheckCircleIcon, MapPinIcon, TagIcon } from "lucide-react";

interface DashboardStats {
	totalUsers: number;
	totalItems: number;
	pendingItems: number;
	activeItems: number;
	claimedItems: number;
	rejectedItems: number;
	lostItems: number;
	foundItems: number;
	successRate: number;
	categoryBreakdown: { _id: string; count: number }[];
	locationBreakdown: { _id: string; count: number }[];
}

interface ReportsPageProps {
	stats?: DashboardStats | null;
}

export default function ReportsPage({ stats }: ReportsPageProps) {
	if (!stats) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Reports & Analytics</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-1">Platform statistics and insights</p>
			</div>

			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
							<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
								{stats.totalUsers}
							</p>
						</div>
						<div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
							<UsersIcon size={24} className="text-blue-600 dark:text-blue-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
							<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
								{stats.totalItems}
							</p>
						</div>
						<div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
							<PackageIcon size={24} className="text-emerald-600 dark:text-emerald-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
							<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
								{stats.successRate}%
							</p>
						</div>
						<div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
							<CheckCircleIcon size={24} className="text-green-600 dark:text-green-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">Items Claimed</p>
							<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
								{stats.claimedItems}
							</p>
						</div>
						<div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
							<TrendingUpIcon size={24} className="text-purple-600 dark:text-purple-400" />
						</div>
					</div>
				</div>
			</div>

			{/* Item Type Breakdown */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Item Types</h3>
					<div className="space-y-4">
						<div>
							<div className="flex justify-between mb-1">
								<span className="text-gray-700 dark:text-gray-300">Lost Items</span>
								<span className="font-medium text-gray-900 dark:text-gray-100">{stats.lostItems}</span>
							</div>
							<div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
								<div
									className="h-full bg-red-500 rounded-full"
									style={{
										width: `${
											stats.totalItems > 0 ? (stats.lostItems / stats.totalItems) * 100 : 0
										}%`,
									}}
								/>
							</div>
						</div>
						<div>
							<div className="flex justify-between mb-1">
								<span className="text-gray-700 dark:text-gray-300">Found Items</span>
								<span className="font-medium text-gray-900 dark:text-gray-100">{stats.foundItems}</span>
							</div>
							<div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
								<div
									className="h-full bg-emerald-500 rounded-full"
									style={{
										width: `${
											stats.totalItems > 0 ? (stats.foundItems / stats.totalItems) * 100 : 0
										}%`,
									}}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Item Status</h3>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-gray-700 dark:text-gray-300">Pending</span>
							<span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-medium">
								{stats.pendingItems}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-700 dark:text-gray-300">Active</span>
							<span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
								{stats.activeItems}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-700 dark:text-gray-300">Claimed</span>
							<span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
								{stats.claimedItems}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-700 dark:text-gray-300">Rejected</span>
							<span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">
								{stats.rejectedItems}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Category & Location Breakdown */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center gap-2 mb-4">
						<TagIcon size={20} className="text-emerald-600" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Categories</h3>
					</div>
					<div className="space-y-3">
						{stats.categoryBreakdown.slice(0, 5).map((cat, idx) => (
							<div key={idx} className="flex items-center justify-between">
								<span className="text-gray-700 dark:text-gray-300 capitalize">
									{cat._id || "Unknown"}
								</span>
								<span className="font-medium text-gray-900 dark:text-gray-100">{cat.count}</span>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center gap-2 mb-4">
						<MapPinIcon size={20} className="text-emerald-600" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Locations</h3>
					</div>
					<div className="space-y-3">
						{stats.locationBreakdown.slice(0, 5).map((loc, idx) => (
							<div key={idx} className="flex items-center justify-between">
								<span className="text-gray-700 dark:text-gray-300">{loc._id || "Unknown"}</span>
								<span className="font-medium text-gray-900 dark:text-gray-100">{loc.count}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
