"use client";

import React from "react";
import {
	UsersIcon,
	PackageIcon,
	ClockIcon,
	CheckCircleIcon,
	TrendingUpIcon,
	MessageSquareIcon,
	EyeIcon,
	SearchIcon,
	RefreshCwIcon,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";

interface DashboardStats {
	totalUsers: number;
	activeUsers: number;
	newUsersToday: number;
	newUsersThisWeek: number;
	totalItems: number;
	pendingItems: number;
	activeItems: number;
	claimedItems: number;
	rejectedItems: number;
	lostItems: number;
	foundItems: number;
	itemsToday: number;
	itemsThisWeek: number;
	itemsThisMonth: number;
	totalConversations: number;
	totalMessages: number;
	totalViews: number;
	totalMatches: number;
	successRate: number;
	categoryBreakdown: { _id: string; count: number }[];
	locationBreakdown: { _id: string; count: number }[];
	recentItems: {
		id: string;
		name: string;
		type: string;
		status: string;
		category: string;
		location: string;
		createdAt: string;
		user: {
			id: string;
			name: string;
			username: string;
			photo: string | null;
		} | null;
	}[];
}

interface DashboardPageProps {
	stats?: DashboardStats | null;
	onRefresh?: () => void;
}

export default function DashboardPage({
	stats,
	onRefresh,
}: DashboardPageProps) {
	if (!stats) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
			</div>
		);
	}

	const statCards = [
		{
			title: "Total Users",
			value: stats.totalUsers,
			subtitle: `${stats.activeUsers} online now`,
			icon: UsersIcon,
			color: "bg-blue-500",
			trend: `+${stats.newUsersThisWeek} this week`,
		},
		{
			title: "Pending Approvals",
			value: stats.pendingItems,
			subtitle: "Awaiting review",
			icon: ClockIcon,
			color: "bg-orange-500",
			trend: stats.pendingItems > 0 ? "Needs attention" : "All clear",
			urgent: stats.pendingItems > 0,
		},
		{
			title: "Active Listings",
			value: stats.activeItems,
			subtitle: `${stats.lostItems} lost, ${stats.foundItems} found`,
			icon: PackageIcon,
			color: "bg-emerald-500",
			trend: `+${stats.itemsToday} today`,
		},
		{
			title: "Success Rate",
			value: `${stats.successRate}%`,
			subtitle: `${stats.claimedItems} items claimed`,
			icon: CheckCircleIcon,
			color: "bg-green-500",
			trend: "Items successfully returned",
		},
	];

	const engagementStats = [
		{ label: "Total Views", value: stats.totalViews, icon: EyeIcon },
		{ label: "Total Matches", value: stats.totalMatches, icon: SearchIcon },
		{
			label: "Conversations",
			value: stats.totalConversations,
			icon: MessageSquareIcon,
		},
		{
			label: "Messages Sent",
			value: stats.totalMessages,
			icon: MessageSquareIcon,
		},
	];

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
			{/* Header */}
			<div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
						Dashboard Overview
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Welcome back! Here&apos;s what&apos;s happening with
						your platform.
					</p>
				</div>
				<button
					onClick={onRefresh}
					className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors max-sm:w-full"
				>
					<RefreshCwIcon size={16} />
					Refresh
				</button>
			</div>

			{/* Main Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{statCards.map((stat, index) => (
					<div
						key={index}
						className={`bg-white dark:bg-neutral-900 rounded-xl shadow-sm border ${
							stat.urgent
								? "border-orange-300 dark:border-orange-700"
								: "border-gray-200 dark:border-neutral-800"
						} p-5 transition-all hover:shadow-md`}
					>
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									{stat.title}
								</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
									{stat.value}
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
									{stat.subtitle}
								</p>
							</div>
							<div className={`${stat.color} p-3 rounded-lg`}>
								<stat.icon size={24} className="text-white" />
							</div>
						</div>
						<div className="mt-3 flex items-center text-sm">
							<TrendingUpIcon
								size={14}
								className="text-emerald-500 mr-1"
							/>
							<span
								className={
									stat.urgent
										? "text-orange-600 dark:text-orange-400"
										: "text-gray-600 dark:text-gray-400"
								}
							>
								{stat.trend}
							</span>
						</div>
					</div>
				))}
			</div>

			{/* Secondary Stats Row */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Engagement Stats */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-5">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						Platform Engagement
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{engagementStats.map((stat, index) => (
							<div
								key={index}
								className="text-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
							>
								<stat.icon
									size={20}
									className="mx-auto text-emerald-600 dark:text-emerald-400 mb-2"
								/>
								<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
									{stat.value.toLocaleString()}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Item Status - Bar Chart with Recharts */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-5">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						Item Status
					</h3>
					{(() => {
						const statusData = [
							{
								name: "Pending",
								value: stats.pendingItems,
								fill: "#f97316",
							},
							{
								name: "Active",
								value: stats.activeItems,
								fill: "#22c55e",
							},
							{
								name: "Claimed",
								value: stats.claimedItems,
								fill: "#3b82f6",
							},
							{
								name: "Rejected",
								value: stats.rejectedItems,
								fill: "#ef4444",
							},
						];

						return (
							<div className="h-48">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={statusData}
										margin={{
											top: 10,
											right: 10,
											left: -10,
											bottom: 0,
										}}
									>
										<XAxis
											dataKey="name"
											tick={{
												fontSize: 12,
												fill: "#9ca3af",
											}}
											axisLine={false}
											tickLine={false}
										/>
										<YAxis
											tick={{
												fontSize: 12,
												fill: "#9ca3af",
											}}
											axisLine={false}
											tickLine={false}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor: "#ffffff",
												border: "none",
												borderRadius: "8px",
												color: "#000000",
											}}
											cursor={{ fill: "rgba(0,0,0,0.1)" }}
										/>
										<Bar
											dataKey="value"
											radius={[4, 4, 0, 0]}
											maxBarSize={50}
										>
											{statusData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={entry.fill}
												/>
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						);
					})()}
				</div>

				{/* Top Categories - Pie Chart with Recharts */}
				<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-5">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						Top Categories
					</h3>
					{(() => {
						const categories = stats.categoryBreakdown.slice(0, 5);
						const colors = [
							"#10b981",
							"#3b82f6",
							"#8b5cf6",
							"#f59e0b",
							"#ec4899",
						];

						if (categories.length === 0) {
							return (
								<p className="text-gray-500 dark:text-gray-400 text-center py-8">
									No category data
								</p>
							);
						}

						const pieData = categories.map((cat, idx) => ({
							name: cat._id || "Unknown",
							value: cat.count,
							fill: colors[idx % colors.length],
						}));

						return (
							<div className="h-48">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={pieData}
											cx="50%"
											cy="50%"
											innerRadius={40}
											outerRadius={70}
											paddingAngle={2}
											dataKey="value"
											label={({ name, percent }) =>
												`${name} ${(
													(percent || 0) * 100
												).toFixed(0)}%`
											}
											labelLine={false}
										>
											{pieData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={entry.fill}
												/>
											))}
										</Pie>
										<Tooltip
											contentStyle={{
												backgroundColor: "#ffffff",
												border: "none",
												borderRadius: "8px",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							</div>
						);
					})()}
				</div>
			</div>
			{/* Recent Activity */}
			<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-5">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						Recent Items
					</h3>
					<span className="text-sm text-gray-500 dark:text-gray-400">
						Last 5 submissions
					</span>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200 dark:border-neutral-700">
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Item
								</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Type
								</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Status
								</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Category
								</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Location
								</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Submitted By
								</th>
							</tr>
						</thead>
						<tbody>
							{stats.recentItems.map((item) => (
								<tr
									key={item.id}
									className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
								>
									<td className="py-3 px-4">
										<span className="font-medium text-gray-900 dark:text-gray-100">
											{item.name}
										</span>
									</td>
									<td className="py-3 px-4">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(
												item.type
											)}`}
										>
											{item.type}
										</span>
									</td>
									<td className="py-3 px-4">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
												item.status
											)}`}
										>
											{item.status}
										</span>
									</td>
									<td className="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize">
										{item.category}
									</td>
									<td className="py-3 px-4 text-gray-600 dark:text-gray-400">
										{item.location}
									</td>
									<td className="py-3 px-4">
										<span className="text-gray-700 dark:text-gray-300">
											{item.user?.name || "Unknown"}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			{/* Quick Stats Footer */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
					<p className="text-blue-100 text-sm">Items Today</p>
					<p className="text-2xl font-bold">{stats.itemsToday}</p>
				</div>
				<div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
					<p className="text-emerald-100 text-sm">Items This Week</p>
					<p className="text-2xl font-bold">{stats.itemsThisWeek}</p>
				</div>
				<div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
					<p className="text-purple-100 text-sm">Items This Month</p>
					<p className="text-2xl font-bold">{stats.itemsThisMonth}</p>
				</div>
				<div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
					<p className="text-orange-100 text-sm">
						New Users This Week
					</p>
					<p className="text-2xl font-bold">
						{stats.newUsersThisWeek}
					</p>
				</div>
			</div>
		</div>
	);
}
