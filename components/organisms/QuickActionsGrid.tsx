import React from "react";
import { QuickActionCard } from "../molecules";
import { AlertCircle, CheckCircle2, MapPin, Search } from "lucide-react";

export default function QuickActionsGrid() {
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

	return (
		<section aria-labelledby="quick-actions-heading">
			<h2
				id="quick-actions-heading"
				className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
			>
				Quick Actions
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{quickActions.map((action, index) => (
					<QuickActionCard
						key={index}
						label={action.label}
						description={action.description}
						icon={action.icon}
						color={action.color}
						bgColor={action.bgColor}
						iconColor={action.iconColor}
						href={action.href}
					/>
				))}
			</div>
		</section>
	);
}

