import React, { useEffect, useState } from "react";
import {
	PackageSearch,
	PackagePlus,
	MessageSquare,
	TrendingUp,
	Clock,
	MapPin,
	Bell,
	CheckCircle2,
	AlertCircle,
	Search,
} from "lucide-react";
import Image from "next/image";

import { RecentItems, RecentActivity } from "@/types/types";
import Link from "next/link";

export default function HomeComponent() {
	const stats = [
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
	];

	const [recentItems, setRecentItems] = useState<RecentItems[]>([]);

	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

	const quickActions = [
		{
			label: "Report Lost Item",
			description: "Post a new lost item",
			icon: AlertCircle,
			color: "red",
			bgColor:
				"bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30",
			iconColor: "text-red-600 dark:text-red-400",
			href: "/dashboard?tab=new-item",
		},
		{
			label: "Report Found Item",
			description: "Submit a found item",
			icon: CheckCircle2,
			color: "green",
			bgColor:
				"bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30",
			iconColor: "text-green-600 dark:text-green-400",
			href: "/dashboard?tab=new-item",
		},
		{
			label: "Search Items",
			description: "Browse lost & found",
			icon: Search,
			color: "blue",
			bgColor:
				"bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30",
			iconColor: "text-blue-600 dark:text-blue-400",
			href: "/dashboard?tab=search-items",
		},
		{
			label: "View Locations",
			description: "Check drop-off points",
			icon: MapPin,
			color: "purple",
			bgColor:
				"bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30",
			iconColor: "text-purple-600 dark:text-purple-400",
			href: "/dashboard?tab=locations",
		},
	];

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
	}, []);

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<section aria-labelledby="welcome-heading" className="mb-8">
				<h1
					id="welcome-heading"
					className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
				>
					Welcome back, John! 👋
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Here's what's happening with your lost and found items
					today.
				</p>
			</section>

			{/* Stats Grid */}
			<section aria-labelledby="stats-heading">
				<h2 id="stats-heading" className="sr-only">
					Dashboard Statistics
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{stats.map((stat, index) => {
						const Icon = stat.icon;
						return (
							<article
								key={index}
								className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6 transition-all hover:shadow-md"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
											{stat.label}
										</p>
										<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
											{stat.value}
										</p>
										<p
											className={`text-xs mt-2 flex items-center gap-1 ${
												stat.trend === "up"
													? "text-emerald-600 dark:text-emerald-400"
													: "text-gray-500 dark:text-gray-400"
											}`}
										>
											{stat.trend === "up" && (
												<TrendingUp
													size={14}
													aria-hidden="true"
												/>
											)}
											{stat.change}
										</p>
									</div>
									<div
										className={`${stat.bgColor} p-3 rounded-lg`}
									>
										<Icon
											size={24}
											className={stat.iconColor}
											aria-hidden="true"
										/>
									</div>
								</div>
							</article>
						);
					})}
				</div>
			</section>

			{/* Quick Actions */}
			<section aria-labelledby="quick-actions-heading">
				<h2
					id="quick-actions-heading"
					className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
				>
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{quickActions.map((action, index) => {
						const Icon = action.icon;
						return (
							<a
								key={index}
								href={action.href}
								className={`${action.bgColor} rounded-lg p-6 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${action.color}-500 dark:focus-visible:ring-${action.color}-400 focus-visible:ring-offset-2 group`}
								aria-label={`${action.label}: ${action.description}`}
							>
								<div className="flex flex-col items-center text-center gap-3">
									<div
										className={`${action.bgColor} p-4 rounded-full group-hover:scale-110 transition-transform`}
									>
										<Icon
											size={28}
											className={action.iconColor}
											aria-hidden="true"
										/>
									</div>
									<div>
										<h3
											className={`font-semibold ${action.iconColor} text-sm`}
										>
											{action.label}
										</h3>
										<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
											{action.description}
										</p>
									</div>
								</div>
							</a>
						);
					})}
				</div>
			</section>

			{/* Recent Items and Activity - Two Columns */}
			<div className="flex flex-col gap-6">
				{/* Recent Items */}
				<section
					aria-labelledby="recent-items-heading"
					className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
				>
					<div className="flex items-center justify-between mb-4">
						<h2
							id="recent-items-heading"
							className="text-lg font-semibold text-gray-900 dark:text-gray-100"
						>
							Recent Items
						</h2>
						<Link
							href="/dashboard?tab=my-items"
							className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-2 py-1"
						>
							View All
						</Link>
					</div>
					<ul className="space-y-3 h-full" role="list">
						{recentItems.map((item) => (
							<li
								key={item.id}
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
							>
								<div className="flex items-center justify-center">
									<Image
										src={
											item.image_url ||
											"https://images.unsplash.com/photo-1654965778976-409444e9826b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGl0ZW1zJTIwcGxhY2Vob2xkZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
										}
										width={40}
										height={40}
										alt={item.title}
										className="w-24 h-24 rounded-lg  flex items-center"
										quality={100}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
										{item.title}
									</p>
									<p className="text-md text-gray-600 dark:text-gray-400 mt-1 truncate mb-1">
										{item.description}
									</p>

									<div className="flex items-center gap-4 mt-1">
										<div className="flex gap-2 items-center">
											<MapPin
												size={14}
												className="text-gray-400 dark:text-gray-500 flex-shrink-0"
												aria-hidden="true"
											/>
											<p className="text-sm text-gray-600 dark:text-gray-400 truncate">
												{item.location}
											</p>
										</div>
										<div className="flex gap-2 items-center">
											<Clock
												size={14}
												className="text-gray-400 dark:text-gray-500 flex-shrink-0"
												aria-hidden="true"
											/>
											<p className="text-sm text-gray-600 dark:text-gray-400 truncate ">
												{item.date}
											</p>
										</div>
									</div>
								</div>
								<span
									className={`text-xs px-2 py-1 rounded-full font-medium ${
										item.type === "lost"
											? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
											: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
									}`}
								>
									{item.type.toUpperCase()}
								</span>
							</li>
						))}
					</ul>
				</section>

				{/* Recent Activity */}
				<section
					aria-labelledby="recent-activity-heading"
					className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
				>
					<div className="flex items-center justify-between mb-4">
						<h2
							id="recent-activity-heading"
							className="text-lg font-semibold text-gray-900 dark:text-gray-100"
						>
							Recent Activity
						</h2>
						<Bell
							size={20}
							className="text-gray-400 dark:text-gray-500"
							aria-hidden="true"
						/>
					</div>

					{/* use divide-y for compact separation and limit height with overflow */}
					<ul
						className="divide-y divide-gray-100 dark:divide-neutral-800 max-h-64 overflow-y-auto"
						role="list"
					>
						{recentActivity.map((activity) => (
							<li
								key={activity.id}
								className="flex items-start gap-3 py-3"
							>
								{/* status dot: small and vertically aligned */}
								<div
									className={`flex-shrink-0 w-2 h-2 rounded-full mt-1 ${
										activity.type === "match"
											? "bg-emerald-500 dark:bg-emerald-400"
											: activity.type === "claimed"
											? "bg-blue-500 dark:bg-blue-400"
											: activity.type === "message"
											? "bg-purple-500 dark:bg-purple-400"
											: "bg-gray-400 dark:bg-gray-500"
									}`}
									aria-hidden="true"
								/>

								<div className="flex-1 min-w-0">
									<p className="text-sm text-gray-900 dark:text-gray-100 leading-tight">
										{activity.action}
									</p>
									<p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
										{activity.item}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
										{activity.time}
									</p>
								</div>
							</li>
						))}
					</ul>
				</section>
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
