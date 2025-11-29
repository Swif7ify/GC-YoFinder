import React, { useEffect, useState } from "react";
import Dynamic from "next/dynamic";
import { PackageSearch, PackagePlus, MessageSquare, Clock } from "lucide-react";
import { RecentItems, RecentActivity, ItemStatus } from "@/types/types";
import { apiCached } from "@/lib/api.config";

// Re-export ItemStatus for backward compatibility
export type { ItemStatus } from "@/types/types";

export const getStatusColor = (status: ItemStatus) => {
	const colors = {
		pending: {
			bg: "bg-yellow-100 dark:bg-yellow-900/30",
			text: "text-yellow-800 dark:text-yellow-300",
			border: "border-yellow-300 dark:border-yellow-700",
			dot: "bg-yellow-500",
		},
		active: {
			bg: "bg-green-100 dark:bg-green-900/30",
			text: "text-green-800 dark:text-green-300",
			border: "border-green-300 dark:border-green-700",
			dot: "bg-green-500",
		},
		claimed: {
			bg: "bg-blue-100 dark:bg-blue-900/30",
			text: "text-blue-800 dark:text-blue-300",
			border: "border-blue-300 dark:border-blue-700",
			dot: "bg-blue-500",
		},
		rejected: {
			bg: "bg-red-100 dark:bg-red-900/30",
			text: "text-red-800 dark:text-red-300",
			border: "border-red-300 dark:border-red-700",
			dot: "bg-red-500",
		},
		removed: {
			bg: "bg-gray-100 dark:bg-gray-900/30",
			text: "text-gray-800 dark:text-gray-300",
			border: "border-gray-300 dark:border-gray-700",
			dot: "bg-gray-500",
		},
	};
	return colors[status] || colors.pending;
};

// Status badge component
export const StatusBadge = ({ status }: { status: ItemStatus }) => {
	const colors = getStatusColor(status);
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}
		>
			<span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</span>
	);
};

interface HomeComponentProps {
	userFullName: string;
	recentItems: RecentItems[];
}
import Stats from "@/component/dashboard/pages/Home/Stats";

import { StatsCard } from "@/types/types";
const QuickActions = Dynamic(() => import("@/component/dashboard/pages/Home/QuickActions").then((mod) => mod.default), {
	ssr: false,
});
const RecentItemsComponent = Dynamic(
	() => import("@/component/dashboard/pages/Home/RecentItems").then((mod) => mod.default),
	{ ssr: false }
);
const RecentActivityComponent = Dynamic(
	() => import("@/component/dashboard/pages/Home/RecentActivity").then((mod) => mod.default),

	{ ssr: false }
);

export default function HomeComponent({ userFullName, recentItems }: HomeComponentProps) {
	const [stats, setStats] = useState<StatsCard[]>([]);
	const [recentItems_n, setRecentItems_n] = useState<RecentItems[]>([]);
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

	useEffect(() => {
		setRecentItems_n(recentItems);
	}, [recentItems]);

	// Fetch real user stats
	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await apiCached("/api/dashboard/stats", { method: "GET" });
				if (response.status === 200) {
					const data = await response.json();
					const userStats = data.data;

					setStats([
						{
							label: "Items Posted",
							value: String(userStats.itemsPosted?.total || 0),
							change: `+${userStats.itemsPosted?.thisWeek || 0} this week`,
							icon: PackagePlus,
							color: "emerald",
							bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
							iconColor: "text-emerald-600 dark:text-emerald-400",
							trend: userStats.itemsPosted?.thisWeek > 0 ? "up" : "neutral",
						},
						{
							label: "Items Found",
							value: String(userStats.itemsFound?.total || 0),
							change: `${userStats.breakdown?.found || 0} found items`,
							icon: PackageSearch,
							color: "blue",
							bgColor: "bg-blue-50 dark:bg-blue-900/20",
							iconColor: "text-blue-600 dark:text-blue-400",
							trend: userStats.itemsFound?.total > 0 ? "up" : "neutral",
						},
						{
							label: "Active Items",
							value: String(userStats.activeClaims?.total || 0),
							change: `${userStats.activeClaims?.pending || 0} pending approval`,
							icon: Clock,
							color: "amber",
							bgColor: "bg-amber-50 dark:bg-amber-900/20",
							iconColor: "text-amber-600 dark:text-amber-400",
							trend: "neutral",
						},
						{
							label: "Messages",
							value: String(userStats.messages?.total || 0),
							change: `${userStats.messages?.unread || 0} unread`,
							icon: MessageSquare,
							color: "purple",
							bgColor: "bg-purple-50 dark:bg-purple-900/20",
							iconColor: "text-purple-600 dark:text-purple-400",
							trend: userStats.messages?.unread > 0 ? "up" : "neutral",
						},
					]);
				}
			} catch (error) {
				console.error("Error fetching stats:", error);
				// Set default stats on error
				setStats([
					{
						label: "Items Posted",
						value: "0",
						change: "+0 this week",
						icon: PackagePlus,
						color: "emerald",
						bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
						iconColor: "text-emerald-600 dark:text-emerald-400",
						trend: "neutral",
					},
					{
						label: "Items Found",
						value: "0",
						change: "0 found items",
						icon: PackageSearch,
						color: "blue",
						bgColor: "bg-blue-50 dark:bg-blue-900/20",
						iconColor: "text-blue-600 dark:text-blue-400",
						trend: "neutral",
					},
					{
						label: "Active Items",
						value: "0",
						change: "0 pending approval",
						icon: Clock,
						color: "amber",
						bgColor: "bg-amber-50 dark:bg-amber-900/20",
						iconColor: "text-amber-600 dark:text-amber-400",
						trend: "neutral",
					},
					{
						label: "Messages",
						value: "0",
						change: "0 unread",
						icon: MessageSquare,
						color: "purple",
						bgColor: "bg-purple-50 dark:bg-purple-900/20",
						iconColor: "text-purple-600 dark:text-purple-400",
						trend: "neutral",
					},
				]);
			}
		};

		fetchStats();
	}, []);

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<section aria-labelledby="welcome-heading" className="mb-8">
				<h1
					id="welcome-heading"
					className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
				>
					Welcome back,{" "}
					<span className="text-emerald-700 font-medium dark:text-emerald-400">{userFullName}!</span>
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Here's what's happening with your lost and found items today.
				</p>
			</section>

			{/* Stats Grid */}
			<Stats stats={stats} />

			{/* Quick Actions */}
			<QuickActions />

			{/* Recent Items and Activity - Two Columns */}
			<div className="flex flex-col gap-6">
				{/* Recent Items */}
				<RecentItemsComponent recentItems_n={recentItems_n} />

				{/* Recent Activity */}
				<RecentActivityComponent recentActivity={recentActivity} />
			</div>

			{/* Tips Section */}
			<section
				aria-labelledby="tips-heading"
				className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 p-6"
			>
				<h2
					id="tips-heading"
					className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2"
				>
					<PackageSearch size={24} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
					Tips for Finding Your Items
				</h2>
				<ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
					<li className="flex items-start gap-2">
						<span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
						<span>
							Check the <strong>Search Items</strong> tab regularly for new matches
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
						<span>
							Visit <strong>campus lost & found locations</strong> listed in the Locations tab
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
						<span>Respond quickly to messages about potential matches</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
						<span>Provide detailed descriptions and photos when posting items</span>
					</li>
				</ul>
			</section>
		</div>
	);
}
