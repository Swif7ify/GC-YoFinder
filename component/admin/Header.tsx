"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BellIcon, MenuIcon, AlertTriangleIcon, ShieldIcon, UserIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import DarkModeButton from "@/ui/DarkModeButton";

interface AdminHeaderProps {
	title: string;
	onMenuClick: () => void;
}

export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
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
			if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
				setNotificationsOpen(false);
			}
			if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
				setProfileOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-4 shadow-sm z-10">
			<div className="flex items-center">
				<button
					onClick={onMenuClick}
					className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-400"
					aria-label="Toggle menu"
				>
					<MenuIcon size={20} />
				</button>
				<Link href="/admin" className="flex items-center">
					<Image
						src="/logo.png"
						alt="GC YoFinder Logo"
						width={40}
						height={40}
						className="mr-2 rounded-full"
					/>
					<div className="flex flex-col">
						<span className="font-semibold text-gray-900 dark:text-gray-100">GC YoFinder</span>
						<span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Admin Portal</span>
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
						<span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
							3
						</span>
					</button>

					{notificationsOpen && (
						<div className="absolute right-0 top-12 w-80 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-800 z-50">
							<div className="p-3 border-b border-gray-200 dark:border-neutral-800">
								<div className="flex justify-between items-center">
									<h3 className="font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
									<span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-0.5 rounded-full">
										3 new
									</span>
								</div>
							</div>
							<div className="max-h-80 overflow-y-auto">
								<div className="p-3 border-l-4 border-red-500 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
									<div className="flex items-start">
										<div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
											<AlertTriangleIcon size={16} className="text-red-600 dark:text-red-400" />
										</div>
										<div>
											<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
												Critical: Failed login attempts
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Multiple failed login attempts detected
											</p>
											<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
												10 minutes ago
											</p>
										</div>
									</div>
								</div>
								<div className="p-3 border-l-4 border-orange-500 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
									<div className="flex items-start">
										<div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full mr-3">
											<AlertTriangleIcon
												size={16}
												className="text-orange-600 dark:text-orange-400"
											/>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
												Flagged item requires review
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												High-value item needs verification
											</p>
											<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
												25 minutes ago
											</p>
										</div>
									</div>
								</div>
								<div className="p-3 border-l-4 border-blue-500 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
									<div className="flex items-start">
										<div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
											<SettingsIcon size={16} className="text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
												System backup completed
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Daily backup completed successfully
											</p>
											<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour ago</p>
										</div>
									</div>
								</div>
							</div>
							<div className="p-2 border-t border-gray-200 dark:border-neutral-800 text-center">
								<button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
									Mark all as read
								</button>
							</div>
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
							AD
						</div>
					</button>

					{profileOpen && (
						<div className="absolute right-0 top-12 w-60 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-800 z-50">
							<div className="p-4 border-b border-gray-200 dark:border-neutral-800">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-medium">
										AD
									</div>
									<div>
										<p className="font-medium text-gray-900 dark:text-gray-100">Admin User</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											admin@gordoncollege.edu.ph
										</p>
										<span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full mt-1 inline-block">
											Super Admin
										</span>
									</div>
								</div>
							</div>
							<div className="py-1">
								<Link
									href="/admin?tab=settings"
									className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
								>
									<UserIcon size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
									Profile Settings
								</Link>
								<Link
									href="/admin?tab=security"
									className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
								>
									<ShieldIcon size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
									Security & Permissions
								</Link>
								<button className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
									<LogOutIcon size={16} className="mr-3 text-red-500 dark:text-red-400" />
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
