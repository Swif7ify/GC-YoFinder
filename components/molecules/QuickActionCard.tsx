import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
	label: string;
	description: string;
	icon: LucideIcon;
	color: string;
	bgColor: string;
	iconColor: string;
	href: string;
}

export default function QuickActionCard({
	label,
	description,
	icon: Icon,
	color,
	bgColor,
	iconColor,
	href,
}: QuickActionCardProps) {
	return (
		<Link
			href={href}
			className={`${bgColor} rounded-lg p-6 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400 focus-visible:ring-offset-2 group`}
			aria-label={`${label}: ${description}`}
		>
			<div className="flex flex-col items-center text-center gap-3">
				<div
					className={`${bgColor} p-4 rounded-full group-hover:scale-110 transition-transform`}
				>
					<Icon size={28} className={iconColor} aria-hidden="true" />
				</div>
				<div>
					<h3 className={`font-semibold ${iconColor} text-sm`}>
						{label}
					</h3>
					<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
						{description}
					</p>
				</div>
			</div>
		</Link>
	);
}

