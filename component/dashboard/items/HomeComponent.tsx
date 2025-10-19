import React, { useEffect, useState } from "react";
import Dynamic from "next/dynamic";
import { PackageSearch, PackagePlus, MessageSquare, Clock } from "lucide-react";
import { RecentItems, RecentActivity } from "@/types/types";

interface HomeComponentProps {
	userFullName: string;
}
import Stats from "@/component/dashboard/items/Home/Stats";

import { StatsCard } from "@/types/types";
const QuickActions = Dynamic(
	() =>
		import("@/component/dashboard/items/Home/QuickActions").then(
			(mod) => mod.default
		),
	{ ssr: false }
);
const RecentItemsComponent = Dynamic(
	() =>
		import("@/component/dashboard/items/Home/RecentItems").then(
			(mod) => mod.default
		),
	{ ssr: false }
);
const RecentActivityComponent = Dynamic(
	() =>
		import("@/component/dashboard/items/Home/RecentActivity").then(
			(mod) => mod.default
		),

	{ ssr: false }
);

export default function HomeComponent({ userFullName }: HomeComponentProps) {
	const [stats, setStats] = useState<StatsCard[]>([]);
	const [recentItems, setRecentItems] = useState<RecentItems[]>([]);
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

	useEffect(() => {
		setRecentItems([
			{
				id: "1",
				title: "Black Laptop Bag",
				description: "A black laptop bag with a silver logo",
				type: "lost",
				location: "Library 2nd Floor",
				date: "2 hours ago",
				status: "active",
				image_url:
					"https://images.unsplash.com/photo-1654965778976-409444e9826b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGl0ZW1zJTIwcGxhY2Vob2xkZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
			},
			{
				id: "2",
				title: "Blue Water Bottle",
				description: "A blue water bottle with a flip-top lid",
				type: "found",
				location: "Cafeteria",
				date: "5 hours ago",
				status: "claimed",
				image_url:
					"https://images.unsplash.com/photo-1654965778976-409444e9826b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGl0ZW1zJTIwcGxhY2Vob2xkZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
			},
			{
				id: "3",
				title: "Student ID Card",
				description: "A college student ID card with photo",
				type: "found",
				location: "Gym",
				date: "1 day ago",
				status: "active",
				image_url:
					"https://images.unsplash.com/photo-1654965778976-409444e9826b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGl0ZW1zJTIwcGxhY2Vob2xkZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
			},
			{
				id: "4",
				title: "Red Umbrella",
				description: "A red umbrella with a wooden handle",
				type: "lost",
				location: "Building A",
				date: "2 days ago",
				status: "active",
				image_url:
					"https://images.unsplash.com/photo-1654965778976-409444e9826b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGl0ZW1zJTIwcGxhY2Vob2xkZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
			},
		]);

		setRecentActivity([
			{
				id: "1",
				action: "New match found for your lost item",
				item: "Black Laptop Bag",
				time: "10 minutes ago",
				type: "match",
			},
			{
				id: "2",
				action: "Your item was claimed",
				item: "Blue Water Bottle",
				time: "2 hours ago",
				type: "claimed",
			},
			{
				id: "3",
				action: "New message received",
				item: "Student ID Card",
				time: "5 hours ago",
				type: "message",
			},
			{
				id: "4",
				action: "Item status updated",
				item: "Red Umbrella",
				time: "1 day ago",
				type: "update",
			},
		]);

		setStats([
			{
				label: "Items Posted",
				value: "12",
				change: "+2 this week",
				icon: PackagePlus,
				color: "emerald",
				bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
				iconColor: "text-emerald-600 dark:text-emerald-400",
				trend: "up",
			},
			{
				label: "Items Found",
				value: "8",
				change: "+3 this week",
				icon: PackageSearch,
				color: "blue",
				bgColor: "bg-blue-50 dark:bg-blue-900/20",
				iconColor: "text-blue-600 dark:text-blue-400",
				trend: "up",
			},
			{
				label: "Active Claims",
				value: "4",
				change: "2 pending",
				icon: Clock,
				color: "amber",
				bgColor: "bg-amber-50 dark:bg-amber-900/20",
				iconColor: "text-amber-600 dark:text-amber-400",
				trend: "neutral",
			},
			{
				label: "Messages",
				value: "15",
				change: "5 unread",
				icon: MessageSquare,
				color: "purple",
				bgColor: "bg-purple-50 dark:bg-purple-900/20",
				iconColor: "text-purple-600 dark:text-purple-400",
				trend: "neutral",
			},
		]);
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
					<span className="text-emerald-700 font-medium dark:text-emerald-400">
						{userFullName}!
					</span>
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Here's what's happening with your lost and found items
					today.
				</p>
			</section>

			{/* Stats Grid */}
			<Stats stats={stats} />

			{/* Quick Actions */}
			<QuickActions />

			{/* Recent Items and Activity - Two Columns */}
			<div className="flex flex-col gap-6">
				{/* Recent Items */}
				<RecentItemsComponent recentItems={recentItems} />

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
					<PackageSearch
						size={24}
						className="text-emerald-600 dark:text-emerald-400"
						aria-hidden="true"
					/>
					Tips for Finding Your Items
				</h2>
				<ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
					<li className="flex items-start gap-2">
						<span className="text-emerald-600 dark:text-emerald-400 mt-0.5">
							•
						</span>
						<span>
							Check the <strong>Search Items</strong> tab
							regularly for new matches
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-emerald-600 dark:text-emerald-400 mt-0.5">
							•
						</span>
						<span>
							Visit <strong>campus lost & found locations</strong>{" "}
							listed in the Locations tab
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-emerald-600 dark:text-emerald-400 mt-0.5">
							•
						</span>
						<span>
							Respond quickly to messages about potential matches
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="text-emerald-600 dark:text-emerald-400 mt-0.5">
							•
						</span>
						<span>
							Provide detailed descriptions and photos when
							posting items
						</span>
					</li>
				</ul>
			</section>
		</div>
	);
}
