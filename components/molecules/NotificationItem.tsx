import React from "react";
import { BellIcon, CheckIcon } from "lucide-react";

interface NotificationItemProps {
	id: string;
	title: string;
	message: string;
	time: string;
	isRead: boolean;
	onClick?: () => void;
}

export default function NotificationItem({
	id,
	title,
	message,
	time,
	isRead,
	onClick,
}: NotificationItemProps) {
	return (
		<li
			key={id}
			className={`cursor-pointer px-4 py-3 transition-colors duration-200 ${
				!isRead
					? "bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
					: "hover:bg-gray-100 dark:hover:bg-gray-700/50"
			} border-b border-gray-100 dark:border-neutral-800`}
			onClick={onClick}
		>
			<div className="flex">
				<div
					className={`flex-shrink-0 h-8 w-8 rounded-full ${
						!isRead
							? "bg-emerald-100 dark:bg-emerald-900/40"
							: "bg-gray-100 dark:bg-gray-700"
					} flex items-center justify-center mr-3`}
					aria-hidden="true"
				>
					{!isRead ? (
						<BellIcon size={16} className="text-emerald-500 dark:text-emerald-400" />
					) : (
						<CheckIcon size={16} className="text-gray-400 dark:text-gray-500" />
					)}
				</div>
				<div className="flex-1">
					<p className="text-sm font-medium text-gray-800 dark:text-gray-200">
						{title}
					</p>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
						{message}
					</p>
					<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
						<time dateTime={time}>{time}</time>
					</p>
				</div>
			</div>
		</li>
	);
}

