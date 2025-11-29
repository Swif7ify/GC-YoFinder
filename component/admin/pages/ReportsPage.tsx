"use client";

import React, { useState } from "react";
import {
	TrendingUpIcon,
	UsersIcon,
	PackageIcon,
	CheckCircleIcon,
	MapPinIcon,
	TagIcon,
	CalendarIcon,
	ArrowUpIcon,
	ArrowDownIcon,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
	AreaChart,
	Area,
} from "recharts";

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
	totalViews?: number;
	totalMatches?: number;
	categoryBreakdown: { _id: string; count: number }[];
	locationBreakdown: { _id: string; count: number }[];
}

interface ReportsPageProps {
	stats?: DashboardStats | null;
}

const COLORS = {
	pending: "#f59e0b",
	active: "#10b981",
	claimed: "#3b82f6",
	rejected: "#ef4444",
	lost: "#ef4444",
	found: "#10b981",
};

const PIE_COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899"];

export default function ReportsPage({ stats }: ReportsPageProps) {
	const [chartView, setChartView] = useState<"status" | "type">("status");

	if (!stats) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
			</div>
		);
	}

	// Prepare data for charts
	const statusPieData = [
		{ name: "Pending", value: stats.pendingItems, color: COLORS.pending },
		{ name: "Active", value: stats.activeItems, color: COLORS.active },
		{ name: "Claimed", value: stats.claimedItems, color: COLORS.claimed },
		{ name: "Rejected", value: stats.rejectedItems, color: COLORS.rejected },
	].filter((d) => d.value > 0);

	const typePieData = [
		{ name: "Lost", value: stats.lostItems, color: COLORS.lost },
		{ name: "Found", value: stats.foundItems, color: COLORS.found },
	].filter((d) => d.value > 0);

	const categoryBarData = stats.categoryBreakdown.slice(0, 8).map((cat) => ({
		name: cat._id || "Other",
		items: cat.count,
	}));

	const locationBarData = stats.locationBreakdown.slice(0, 8).map((loc) => ({
		name: loc._id?.length > 15 ? loc._id.substring(0, 15) + "..." : loc._id || "Other",
		items: loc.count,
	}));

	const timelineData = [
		{ name: "Today", items: stats.itemsToday || 0 },
		{ name: "This Week", items: stats.itemsThisWeek || 0 },
		{ name: "This Month", items: stats.itemsThisMonth || 0 },
	];

	const statusBarData = [
		{ name: "Pending", value: stats.pendingItems, fill: COLORS.pending },
		{ name: "Active", value: stats.activeItems, fill: COLORS.active },
		{ name: "Claimed", value: stats.claimedItems, fill: COLORS.claimed },
		{ name: "Rejected", value: stats.rejectedItems, fill: COLORS.rejected },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Reports & Analytics</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-1">Platform statistics and insights</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
								{stats.totalUsers}
							</p>
						</div>
						<div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
							<UsersIcon size={22} className="text-blue-600 dark:text-blue-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
								{stats.totalItems}
							</p>
						</div>
						<div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
							<PackageIcon size={22} className="text-emerald-600 dark:text-emerald-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
							<div className="flex items-center gap-2 mt-1">
								<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
									{stats.successRate}%
								</p>
								{stats.successRate >= 50 ? (
									<ArrowUpIcon size={16} className="text-green-500" />
								) : (
									<ArrowDownIcon size={16} className="text-red-500" />
								)}
							</div>
						</div>
						<div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
							<CheckCircleIcon size={22} className="text-green-600 dark:text-green-400" />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">Items Claimed</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
								{stats.claimedItems}
							</p>
						</div>
						<div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
							<TrendingUpIcon size={22} className="text-purple-600 dark:text-purple-400" />
						</div>
					</div>
				</div>
			</div>

			{/* Charts Row 1 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Pie Chart */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Item Distribution</h3>
						<div className="flex gap-1 bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
							<button
								onClick={() => setChartView("status")}
								className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									chartView === "status"
										? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 shadow-sm"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								Status
							</button>
							<button
								onClick={() => setChartView("type")}
								className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									chartView === "type"
										? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 shadow-sm"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								Type
							</button>
						</div>
					</div>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={chartView === "status" ? statusPieData : typePieData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={90}
									paddingAngle={2}
									dataKey="value"
								>
									{(chartView === "status" ? statusPieData : typePieData).map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: "rgba(255, 255, 255, 0.95)",
										border: "1px solid #e5e7eb",
										borderRadius: "8px",
									}}
								/>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Status Bar Chart */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Status Overview</h3>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={statusBarData} layout="vertical">
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
								<XAxis type="number" stroke="#9ca3af" fontSize={12} />
								<YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={70} />
								<Tooltip
									contentStyle={{
										backgroundColor: "rgba(255, 255, 255, 0.95)",
										border: "1px solid #e5e7eb",
										borderRadius: "8px",
									}}
								/>
								<Bar dataKey="value" radius={[0, 4, 4, 0]}>
									{statusBarData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.fill} />
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Charts Row 2 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Category Chart */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center gap-2 mb-4">
						<TagIcon size={18} className="text-emerald-600" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Items by Category</h3>
					</div>
					<div className="h-64">
						{categoryBarData.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={categoryBarData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis
										dataKey="name"
										stroke="#9ca3af"
										fontSize={11}
										angle={-45}
										textAnchor="end"
										height={60}
									/>
									<YAxis stroke="#9ca3af" fontSize={12} />
									<Tooltip
										contentStyle={{
											backgroundColor: "rgba(255, 255, 255, 0.95)",
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
										}}
									/>
									<Bar dataKey="items" fill="#10b981" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="h-full flex items-center justify-center text-gray-500">
								No data available
							</div>
						)}
					</div>
				</div>

				{/* Location Chart */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center gap-2 mb-4">
						<MapPinIcon size={18} className="text-blue-600" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Items by Location</h3>
					</div>
					<div className="h-64">
						{locationBarData.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={locationBarData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis
										dataKey="name"
										stroke="#9ca3af"
										fontSize={11}
										angle={-45}
										textAnchor="end"
										height={60}
									/>
									<YAxis stroke="#9ca3af" fontSize={12} />
									<Tooltip
										contentStyle={{
											backgroundColor: "rgba(255, 255, 255, 0.95)",
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
										}}
									/>
									<Bar dataKey="items" fill="#3b82f6" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="h-full flex items-center justify-center text-gray-500">
								No data available
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Activity Timeline */}
			<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
				<div className="flex items-center gap-2 mb-4">
					<CalendarIcon size={18} className="text-purple-600" />
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Activity Timeline</h3>
				</div>
				<div className="h-48">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={timelineData}>
							<defs>
								<linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
									<stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
							<XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
							<YAxis stroke="#9ca3af" fontSize={12} />
							<Tooltip
								contentStyle={{
									backgroundColor: "rgba(255, 255, 255, 0.95)",
									border: "1px solid #e5e7eb",
									borderRadius: "8px",
								}}
							/>
							<Area
								type="monotone"
								dataKey="items"
								stroke="#8b5cf6"
								strokeWidth={2}
								fill="url(#colorItems)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Quick Stats Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 rounded-xl p-4 text-center">
					<p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pendingItems}</p>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending Review</p>
				</div>
				<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl p-4 text-center">
					<p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.activeItems}</p>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Listings</p>
				</div>
				<div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-4 text-center">
					<p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.claimedItems}</p>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Successfully Claimed</p>
				</div>
				<div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-xl p-4 text-center">
					<p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejectedItems}</p>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rejected Items</p>
				</div>
			</div>

			{/* Lost vs Found Summary */}
			<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Lost vs Found Items</h3>
				<div className="grid grid-cols-2 gap-4">
					<div className="relative p-4 bg-red-50 dark:bg-red-900/20 rounded-xl overflow-hidden">
						<div className="relative z-10">
							<p className="text-sm text-gray-600 dark:text-gray-400">Lost Items</p>
							<p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.lostItems}</p>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
								{stats.totalItems > 0 ? Math.round((stats.lostItems / stats.totalItems) * 100) : 0}% of
								total
							</p>
						</div>
						<div className="absolute right-0 bottom-0 opacity-10">
							<PackageIcon size={80} className="text-red-600" />
						</div>
					</div>
					<div className="relative p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl overflow-hidden">
						<div className="relative z-10">
							<p className="text-sm text-gray-600 dark:text-gray-400">Found Items</p>
							<p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
								{stats.foundItems}
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
								{stats.totalItems > 0 ? Math.round((stats.foundItems / stats.totalItems) * 100) : 0}% of
								total
							</p>
						</div>
						<div className="absolute right-0 bottom-0 opacity-10">
							<PackageIcon size={80} className="text-emerald-600" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
