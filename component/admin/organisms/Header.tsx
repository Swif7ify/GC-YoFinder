"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	BellIcon,
	MenuIcon,
	AlertTriangleIcon,
	ShieldIcon,
	UserIcon,
	LogOutIcon,
	SettingsIcon,
} from "lucide-react";
import DarkModeButton from "@/ui/DarkModeButton";

interface Notification {
	id: string;
	title: string;
	message: string;
	time: string;
	isRead: boolean;
	type: string;
	conversationId?: string;
}

interface AdminHeaderProps {
	onMenuClick: () => void;
	adminData?: any;
	notifications?: Notification[];
	onMarkAllRead?: () => void;
}

export default function AdminHeader({
	onMenuClick,
	adminData,
	notifications = [],
	onMarkAllRead,
}: AdminHeaderProps) {
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const notificationsRef = useRef<HTMLDivElement>(null);
	const profileRef = useRef<HTMLDivElement>(null);

	const toggleNotifications = () => {
		setNotificationsOpen(!notificationsOpen);
		if (profileOpen) setProfileOpen(false);
	};

	const toggleProfile = () => {
		setProfileOpen(!profileOpen);
		if (notificationsOpen) setNotificationsOpen(false);
	};

	// Close dropdowns when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				notificationsRef.current &&
				!notificationsRef.current.contains(event.target as Node)
			) {
				setNotificationsOpen(false);
			}
			if (
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setProfileOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-4 shadow-sm z-10 select-none p-4">
			<div className="flex items-center">
				<button
					onClick={onMenuClick}
					className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-400 hidden max-md:flex"
					aria-label="Toggle menu"
				>
					<MenuIcon size={20} />
				</button>
				<Link
					href="/dashboard-admin?tab=dashboard"
					className="flex items-center"
				>
					<Image
						src="/logo.png"
						alt="GC YoFinder Logo"
						width={40}
						height={40}
						className="mr-2 rounded-full"
					/>
					<div className="flex flex-col max-sm:hidden">
						<span className="font-semibold text-gray-900 dark:text-gray-100">
							GC YoFinder
						</span>
						<span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
							Admin Portal
						</span>
					</div>
				</Link>
			</div>

			<div className="flex items-center gap-4">
				<DarkModeButton />

				{/* Notifications */}
				<div className="relative" ref={notificationsRef}>
					<button
						onClick={toggleNotifications}
						className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-400"
						aria-label="Notifications"
					>
						<BellIcon size={20} />
						{notifications.filter((n) => !n.isRead).length > 0 && (
							<span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
								{notifications.filter((n) => !n.isRead).length >
								9
									? "9+"
									: notifications.filter((n) => !n.isRead)
											.length}
							</span>
						)}
					</button>

					{notificationsOpen && (
						<div className="absolute right-0 top-12 w-80 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-800 z-50 max-sm:fixed max-sm:top-16 max-sm:left-0 max-sm:right-0 max-sm:w-full max-sm:m-0">
							<div className="p-3 border-b border-gray-200 dark:border-neutral-800">
								<div className="flex justify-between items-center">
									<h3 className="font-medium text-gray-900 dark:text-gray-100">
										Notifications
									</h3>
									{notifications.filter((n) => !n.isRead)
										.length > 0 && (
										<span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-0.5 rounded-full">
											{
												notifications.filter(
													(n) => !n.isRead
												).length
											}{" "}
											new
										</span>
									)}
								</div>
							</div>
							<div className="max-h-80 overflow-y-auto max-sm:max-h-[60vh]">
								{notifications.length === 0 ? (
									<div className="p-4 text-center text-gray-500 dark:text-gray-400">
										<BellIcon
											size={24}
											className="mx-auto mb-2 opacity-50"
										/>
										<p className="text-sm">
											No notifications
										</p>
									</div>
								) : (
									notifications.slice(0, 10).map((notif) => {
										const borderColor =
											notif.type === "message"
												? "border-blue-500"
												: notif.type === "match"
												? "border-green-500"
												: notif.type === "claim"
												? "border-orange-500"
												: "border-gray-500";
										const bgColor =
											notif.type === "message"
												? "bg-blue-100 dark:bg-blue-900/30"
												: notif.type === "match"
												? "bg-green-100 dark:bg-green-900/30"
												: notif.type === "claim"
												? "bg-orange-100 dark:bg-orange-900/30"
												: "bg-gray-100 dark:bg-gray-900/30";
										const iconColor =
											notif.type === "message"
												? "text-blue-600 dark:text-blue-400"
												: notif.type === "match"
												? "text-green-600 dark:text-green-400"
												: notif.type === "claim"
												? "text-orange-600 dark:text-orange-400"
												: "text-gray-600 dark:text-gray-400";

										return (
											<div
												key={notif.id}
												className={`p-3 border-l-4 ${borderColor} hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer ${
													!notif.isRead
														? "bg-gray-50 dark:bg-neutral-800/50"
														: ""
												}`}
											>
												<div className="flex items-start">
													<div
														className={`${bgColor} p-2 rounded-full mr-3`}
													>
														<BellIcon
															size={16}
															className={
																iconColor
															}
														/>
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
															{notif.title}
														</p>
														<p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
															{notif.message}
														</p>
														<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
															{notif.time}
														</p>
													</div>
													{!notif.isRead && (
														<div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
													)}
												</div>
											</div>
										);
									})
								)}
							</div>
							{notifications.filter((n) => !n.isRead).length >
								0 && (
								<div className="p-2 border-t border-gray-200 dark:border-neutral-800 text-center">
									<button
										onClick={onMarkAllRead}
										className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
									>
										Mark all as read
									</button>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Profile */}
				<div className="relative" ref={profileRef}>
					<button
						onClick={toggleProfile}
						className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
						aria-label="User menu"
					>
						<div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-medium">
							{adminData
								? `${adminData.firstname?.[0] || ""}${
										adminData.lastname?.[0] || ""
								  }`.toUpperCase() || "AD"
								: "AD"}
						</div>
					</button>

					{profileOpen && (
						<div className="absolute right-0 top-12 w-60 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-800 z-50 max-sm:fixed max-sm:top-16 max-sm:left-0 max-sm:right-0 max-sm:w-full max-sm:m-0">
							<div className="p-4 border-b border-gray-200 dark:border-neutral-800">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-medium">
										{adminData
											? `${
													adminData.firstname?.[0] ||
													""
											  }${
													adminData.lastname?.[0] ||
													""
											  }`.toUpperCase() || "AD"
											: "AD"}
									</div>
									<div>
										<p className="font-medium text-gray-900 dark:text-gray-100">
											{adminData
												? `${
														adminData.firstname ||
														""
												  } ${
														adminData.lastname || ""
												  }`.trim() || "Admin User"
												: "Admin User"}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{adminData?.email ||
												"admin@.edu.ph"}
										</p>
										<span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full mt-1 inline-block">
											{adminData?.role === "admin"
												? "Administrator"
												: "Super Admin"}
										</span>
									</div>
								</div>
							</div>
							<div className="py-1">
								<Link
									href="/admin?tab=settings"
									className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
								>
									<UserIcon
										size={16}
										className="mr-3 text-gray-500 dark:text-gray-400"
									/>
									Profile Settings
								</Link>
								<Link
									href="/admin?tab=security"
									className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
								>
									<ShieldIcon
										size={16}
										className="mr-3 text-gray-500 dark:text-gray-400"
									/>
									Security & Permissions
								</Link>
								<button className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
									<LogOutIcon
										size={16}
										className="mr-3 text-red-500 dark:text-red-400"
									/>
									Sign Out
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
