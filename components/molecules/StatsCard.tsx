import React from "react";
import { LucideIcon, TrendingUp } from "lucide-react";

interface StatsCardProps {
	label: string;
	value: string | number;
	change?: string;
	trend?: "up" | "down" | "neutral";
	icon: LucideIcon;
	iconColor: string;
	bgColor: string;
}

export default function StatsCard({
	label,
	value,
	change,
	trend = "neutral",
	icon: Icon,
	iconColor,
	bgColor,
}: StatsCardProps) {
	return (
		<article className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6 transition-all hover:shadow-md">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
						{label}
					</p>
					<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
						{value}
					</p>
					{change && (
						<p
							className={`text-xs mt-2 flex items-center gap-1 ${
								trend === "up"
									? "text-emerald-600 dark:text-emerald-400"
									: "text-gray-500 dark:text-gray-400"
							}`}
						>
							{trend === "up" && (
								<TrendingUp size={14} aria-hidden="true" />
							)}
							{change}
						</p>
					)}
				</div>
				<div className={`${bgColor} p-3 rounded-lg`}>
					<Icon size={24} className={iconColor} aria-hidden="true" />
				</div>
			</div>
		</article>
	);
}

