import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationItem } from "../molecules";
import { Button } from "../atoms";

interface Notification {
	id: string;
	title: string;
	message: string;
	time: string;
	isRead: boolean;
	conversationId?: string;
}

interface NotificationPanelProps {
	notifications: Notification[];
	unreadCount: number;
	onNotificationClick?: (notification: Notification) => void;
	onMarkAllRead?: () => void;
}

export default function NotificationPanel({
	notifications,
	unreadCount,
	onNotificationClick,
	onMarkAllRead,
}: NotificationPanelProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -6 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -6 }}
			transition={{ duration: 0.12 }}
			className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-md shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-50 py-2"
			role="region"
			aria-label="Notifications panel"
		>
			<div className="px-4 py-2 border-b border-gray-100 dark:border-neutral-800">
				<div className="flex justify-between items-center">
					<h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
						Notifications
					</h2>
					{unreadCount > 0 && (
						<span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
							{unreadCount} new
						</span>
					)}
				</div>
			</div>
			<div className="max-h-80 overflow-y-auto">
				{notifications.length > 0 ? (
					<ul role="list">
						{notifications.map((notification) => (
							<NotificationItem
								key={notification.id}
								id={notification.id}
								title={notification.title}
								message={notification.message}
								time={notification.time}
								isRead={notification.isRead}
								onClick={() => onNotificationClick?.(notification)}
							/>
						))}
					</ul>
				) : (
					<div className="px-4 py-6 text-center">
						<p className="text-gray-500 dark:text-gray-400 text-sm">
							No notifications
						</p>
					</div>
				)}
			</div>
			{notifications.length > 0 && onMarkAllRead && (
				<div className="px-4 py-2 border-t border-gray-100 dark:border-neutral-800 mt-1">
					<Button
						variant="ghost"
						size="sm"
						fullWidth
						onClick={onMarkAllRead}
						className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
					>
						Mark all as read
					</Button>
				</div>
			)}
		</motion.div>
	);
}

