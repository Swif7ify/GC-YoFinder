import React from "react";
import { LucideIcon } from "lucide-react";

interface NavigationItemProps {
	name: string;
	icon: React.ReactNode;
	isActive?: boolean;
	badge?: number;
	onClick: () => void;
}

export default function NavigationItem({
	name,
	icon,
	isActive = false,
	badge,
	onClick,
}: NavigationItemProps) {
	return (
		<li>
			<button
				type="button"
				onClick={onClick}
				className={`w-full text-left flex items-center px-4 py-3 transition-colors duration-200 ${
					isActive
						? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium border-l-4 border-emerald-500 dark:border-emerald-400"
						: "text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
				} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400 focus-visible:ring-inset`}
				aria-current={isActive ? "page" : undefined}
			>
				<span className="mr-3 text-gray-500 dark:text-gray-400" aria-hidden="true">
					{icon}
				</span>
				<span className="flex-1">{name}</span>
				{badge !== undefined && badge > 0 && (
					<span
						className="ml-2 bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0"
						aria-label={`${badge} unread`}
					>
						{badge > 99 ? "99+" : badge}
					</span>
				)}
			</button>
		</li>
	);
}

