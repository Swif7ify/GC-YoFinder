import { AlertCircle, CheckCircle2, MapPin, Search } from "lucide-react";

export default function QuickActions() {

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
	);
}
