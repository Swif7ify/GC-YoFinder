"use client";

import React, { useState } from "react";
import {
	TrendingUpIcon,
	UsersIcon,
	PackageIcon,
	CheckCircleIcon,
	MapPinIcon,
	TagIcon,
	PieChartIcon,
	BarChart2Icon,
} from "lucide-react";

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
	itemsToday?: number;
	itemsThisWeek?: number;
	itemsThisMonth?: number;
	categoryBreakdown: { _id: string; count: number }[];
	locationBreakdown: { _id: string; count: number }[];
}

interface ReportsPageProps {
	stats?: DashboardStats | null;
}

// Simple Bar Chart Component
function BarChart({
	data,
	maxValue,
	color,
}: {
	data: { label: string; value: number }[];
	maxValue: number;
	color: string;
}) {
	return (
		<div className="space-y-3">
			{data.map((item, idx) => (
				<div key={idx}>
					<div className="flex justify-between text-sm mb-1">
						<span className="text-gray-700 dark:text-gray-300 capitalize truncate">{item.label}</span>
						<span className="font-medium text-gray-900 dark:text-gray-100">{item.value}</span>
					</div>
					<div className="h-6 bg-gray-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
						<div
							className={`h-full ${color} rounded-lg transition-all duration-500`}
							style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

// Donut Chart Component
function DonutChart({ data, colors }: { data: { label: string; value: number; color: string }[]; colors: string[] }) {
	const total = data.reduce((sum, item) => sum + item.value, 0);
	let cumulativePercent = 0;

	const segments = data.map((item, idx) => {
		const percent = total > 0 ? (item.value / total) * 100 : 0;
		const startPercent = cumulativePercent;
		cumulativePercent += percent;
		return { ...item, percent, startPercent, color: colors[idx] };
	});

	return (
		<div className="flex items-center gap-6">
			<div className="relative w-32 h-32">
				<svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
					{segments.map((segment, idx) => (
						<circle
							key={idx}
							cx="18"
							cy="18"
							r="15.915"
							fill="transparent"
							stroke={segment.color}
							strokeWidth="3"
							strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
							strokeDashoffset={-segment.startPercent}
							className="transition-all duration-500"
						/>
					))}
				</svg>
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-xl font-bold text-gray-900 dark:text-gray-100">{total}</span>
				</div>
			</div>
			<div className="space-y-2">
				{segments.map((segment, idx) => (
					<div key={idx} className="flex items-center gap-2">
						<div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
						<span className="text-sm text-gray-600 dark:text-gray-400">{segment.label}</span>
						<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{segment.value}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default function ReportsPage({ stats }: ReportsPageProps) {
	const [activeChart, setActiveChart] = useState<"status" | "type">("status");

	if (!stats) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
			</div>
		);
	}

	const statusData = [
		{ label: "Pending", value: stats.pendingItems, color: "#f97316" },
		{ label: "Active", value: stats.activeItems, color: "#22c55e" },
		{ label: "Claimed", value: stats.claimedItems, color: "#3b82f6" },
		{ label: "Rejected", value: stats.rejectedItems, color: "#ef4444" },
	];

	const typeData = [
		{ label: "Lost", value: stats.lostItems, color: "#ef4444" },
		{ label: "Found", value: stats.foundItems, color: "#10b981" },
	];

	const categoryData = stats.categoryBreakdown.slice(0, 6).map((cat) => ({
		label: cat._id || "Unknown",
		value: cat.count,
	}));

	const locationData = stats.locationBreakdown.slice(0, 6).map((loc) => ({
		label: loc._id || "Unknown",
		value: loc.count,
	}));

	const maxCategoryValue = Math.max(...categoryData.map((c) => c.value), 1);
	const maxLocationValue = Math.max(...locationData.map((l) => l.value), 1);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Reports & Analytics</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-1">Platform statistics and visual insights</p>
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

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Donut Chart - Item Distribution */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<PieChartIcon size={20} className="text-emerald-600" />
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								Item Distribution
							</h3>
						</div>
						<div className="flex gap-1 bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
							<button
								onClick={() => setActiveChart("status")}
								className={`px-3 py-1 text-sm rounded-md transition-colors ${
									activeChart === "status"
										? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 shadow-sm"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								By Status
							</button>
							<button
								onClick={() => setActiveChart("type")}
								className={`px-3 py-1 text-sm rounded-md transition-colors ${
									activeChart === "type"
										? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 shadow-sm"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								By Type
							</button>
						</div>
					</div>
					<DonutChart
						data={activeChart === "status" ? statusData : typeData}
						colors={
							activeChart === "status"
								? ["#f97316", "#22c55e", "#3b82f6", "#ef4444"]
								: ["#ef4444", "#10b981"]
						}
					/>
				</div>

				{/* Timeline Stats */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center gap-2 mb-6">
						<TrendingUpIcon size={20} className="text-emerald-600" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Activity Timeline</h3>
					</div>
					<div className="space-y-4">
						<div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg">
							<div className="flex items-center justify-between">
								<span className="text-gray-700 dark:text-gray-300">Today</span>
								<span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
									{stats.itemsToday || 0}
								</span>
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">items submitted</p>
						</div>
						<div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-lg">
							<div className="flex items-center justify-between">
								<span className="text-gray-700 dark:text-gray-300">This Week</span>
								<span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
									{stats.itemsThisWeek || 0}
								</span>
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">items submitted</p>
						</div>
						<div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg">
							<div className="flex items-center justify-between">
								<span className="text-gray-700 dark:text-gray-300">This Month</span>
								<span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
									{stats.itemsThisMonth || 0}
								</span>
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">items submitted</p>
						</div>
					</div>
				</div>
			</div>

			{/* Bar Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Category Breakdown */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center gap-2 mb-6">
						<TagIcon size={20} className="text-emerald-600" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Items by Category</h3>
					</div>
					{categoryData.length > 0 ? (
						<BarChart data={categoryData} maxValue={maxCategoryValue} color="bg-emerald-500" />
					) : (
						<p className="text-gray-500 dark:text-gray-400 text-center py-8">No category data available</p>
					)}
				</div>

				{/* Location Breakdown */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center gap-2 mb-6">
						<MapPinIcon size={20} className="text-emerald-600" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Items by Location</h3>
					</div>
					{locationData.length > 0 ? (
						<BarChart data={locationData} maxValue={maxLocationValue} color="bg-blue-500" />
					) : (
						<p className="text-gray-500 dark:text-gray-400 text-center py-8">No location data available</p>
					)}
				</div>
			</div>

			{/* Status Summary */}
			<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
				<div className="flex items-center gap-2 mb-6">
					<BarChart2Icon size={20} className="text-emerald-600" />
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Status Overview</h3>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
						<p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.pendingItems}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</p>
					</div>
					<div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
						<p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.activeItems}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active</p>
					</div>
					<div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.claimedItems}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Claimed</p>
					</div>
					<div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
						<p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejectedItems}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rejected</p>
					</div>
				</div>
			</div>
		</div>
	);
}
