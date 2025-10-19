import { Bell } from "lucide-react";
import { RecentActivity } from "@/types/types";

interface RecentActivityProps {
	recentActivity: RecentActivity[];
}

export default function RecentItemsComponent({
	recentActivity,
}: RecentActivityProps) {
	return (
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
	);
}
