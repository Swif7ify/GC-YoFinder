import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
	BellIcon,
	MenuIcon,
	UserIcon,
	XIcon,
	LogOut as LogOutIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { UserData } from "@/types/types";
import { Avatar, Button } from "../atoms";
import NotificationPanel from "./NotificationPanel";
import DarkModeButton from "@/ui/DarkModeButton";

interface HeaderProps {
	setShowMobileMenu: (show: boolean) => void;
	showMobileMenu: boolean;
	showNotifications: boolean;
	setShowNotifications: (show: boolean) => void;
	showProfileMenu: boolean;
	setShowProfileMenu: (show: boolean) => void;
	unreadCount: number;
	mockNotifications: {
		id: string;
		title: string;
		message: string;
		time: string;
		isRead: boolean;
		conversationId?: string;
	}[];
	handleLogout: () => void;
	userData: UserData;
}

export default function Header({
	setShowMobileMenu,
	showMobileMenu,
	showNotifications,
	setShowNotifications,
	showProfileMenu,
	setShowProfileMenu,
	unreadCount,
	mockNotifications,
	handleLogout,
	userData,
}: HeaderProps) {
	const router = useRouter();
	const notificationsRef = useRef<HTMLDivElement | null>(null);
	const avatarRef = useRef<HTMLDivElement | null>(null);
	const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
	const avatarButtonRef = useRef<HTMLButtonElement | null>(null);
	const [photoUrl, setPhotoUrl] = useState<string>();

	const handleButtonKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			if (showNotifications) {
				setShowNotifications(false);
				notificationButtonRef.current?.focus();
			}
			if (showProfileMenu) {
				setShowProfileMenu(false);
				avatarButtonRef.current?.focus();
			}
		}
	};

	useEffect(() => {
		function handleClickOutsideNotification(e: MouseEvent | TouchEvent) {
			if (!showNotifications) return;
			const target = e.target as Node | null;
			if (
				notificationsRef.current &&
				target &&
				!notificationsRef.current.contains(target)
			) {
				setShowNotifications(false);
			}
		}

		function handleClickOutsideAvatar(e: MouseEvent | TouchEvent) {
			if (!showProfileMenu) return;
			const target = e.target as Node | null;
			if (
				avatarRef.current &&
				target &&
				!avatarRef.current.contains(target)
			) {
				setShowProfileMenu(false);
			}
		}

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				if (showNotifications) {
					setShowNotifications(false);
					notificationButtonRef.current?.focus();
				}
				if (showProfileMenu) {
					setShowProfileMenu(false);
					avatarButtonRef.current?.focus();
				}
			}
		}

		document.addEventListener("mousedown", handleClickOutsideNotification);
		document.addEventListener("touchstart", handleClickOutsideNotification);
		document.addEventListener("mousedown", handleClickOutsideAvatar);
		document.addEventListener("touchstart", handleClickOutsideAvatar);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener(
				"mousedown",
				handleClickOutsideNotification
			);
			document.removeEventListener(
				"touchstart",
				handleClickOutsideNotification
			);
			document.removeEventListener("mousedown", handleClickOutsideAvatar);
			document.removeEventListener(
				"touchstart",
				handleClickOutsideAvatar
			);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		showNotifications,
		setShowNotifications,
		showProfileMenu,
		setShowProfileMenu,
	]);

	const handleProfileSettings = () => {
		setShowProfileMenu(false);
		router.push("/dashboard?tab=settings");
	};

	const handleNotificationClick = async (
		notification: (typeof mockNotifications)[0]
	) => {
		if (notification.conversationId) {
			router.push(
				`/dashboard?tab=messages&conversationId=${notification.conversationId}`
			);
			setShowNotifications(false);
			if (!notification.isRead) {
				try {
					await fetch(`/api/notifications/${notification.id}`, {
						method: "PUT",
					});
					window.dispatchEvent(new CustomEvent("notificationUpdate"));
				} catch (error) {
					console.error("Error marking notification as read:", error);
				}
			}
		}
	};

	const handleMarkAllRead = async () => {
		try {
			const response = await fetch("/api/notifications", {
				method: "PUT",
			});
			if (response.ok) {
				window.dispatchEvent(new CustomEvent("unreadCountUpdate"));
			}
		} catch (error) {
			console.error("Error marking notifications as read:", error);
		}
	};

	useEffect(() => {
		setPhotoUrl(userData.photo?.url);
	}, [userData]);

	return (
		<motion.header
			initial={{ y: -8, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.18 }}
			className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 z-20 w-full h-16 flex flex-row items-center justify-between"
			role="banner"
		>
			<div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between w-full">
				<div className="flex items-center">
					<button
						className="md:hidden mr-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400 rounded p-1"
						onClick={() => setShowMobileMenu(!showMobileMenu)}
						aria-label={showMobileMenu ? "Close menu" : "Open menu"}
						aria-expanded={showMobileMenu}
					>
						{showMobileMenu ? (
							<XIcon size={24} aria-hidden="true" />
						) : (
							<MenuIcon size={24} aria-hidden="true" />
						)}
					</button>
					<div className="flex items-center">
						<Image
							src="/logo.png"
							alt="GC Yofinder logo"
							width={32}
							height={32}
							className="rounded-full mr-2"
						/>
						<h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
							GC Yofinder
						</h1>
					</div>
				</div>

				<div className="flex items-center space-x-4">
					<DarkModeButton />
					<div className="relative" ref={notificationsRef}>
						<button
							ref={notificationButtonRef}
							className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400 rounded p-2 relative"
							onClick={() => {
								setShowNotifications(!showNotifications);
								if (showProfileMenu) setShowProfileMenu(false);
							}}
							aria-haspopup="true"
							aria-expanded={showNotifications}
							aria-label={`Notifications ${
								unreadCount > 0 ? `(${unreadCount} unread)` : ""
							}`}
						>
							<BellIcon size={20} aria-hidden="true" />
							{unreadCount > 0 && (
								<span
									className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
									aria-label={`${unreadCount} unread notifications`}
								>
									{unreadCount > 99 ? "99+" : unreadCount}
								</span>
							)}
						</button>
						<AnimatePresence>
							{showNotifications && (
								<NotificationPanel
									notifications={mockNotifications}
									unreadCount={unreadCount}
									onNotificationClick={
										handleNotificationClick
									}
									onMarkAllRead={handleMarkAllRead}
								/>
							)}
						</AnimatePresence>
					</div>
					<div className="relative" ref={avatarRef}>
						<button
							ref={avatarButtonRef}
							className="flex items-center space-x-2 rounded-md px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
							onClick={() => {
								setShowProfileMenu(!showProfileMenu);
								if (showNotifications)
									setShowNotifications(false);
							}}
							onKeyDown={handleButtonKeyDown}
							aria-haspopup="true"
							aria-expanded={showProfileMenu}
							aria-label="User menu"
						>
							<Avatar
								src={photoUrl}
								alt={`${userData.firstname} ${userData.lastname}`}
							/>
							<span className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-200">
								{userData.firstname} {userData.lastname}
							</span>
						</button>
						<AnimatePresence>
							{showProfileMenu && (
								<motion.div
									initial={{ opacity: 0, y: -6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.12 }}
									className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-md shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-50 py-2"
									role="menu"
									aria-label="User menu"
								>
									<div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
										<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
											{userData.username}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
											{userData.email}
										</p>
									</div>
									<nav>
										<ul role="list">
											<li>
												<button
													type="button"
													className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
													role="menuitem"
													onClick={
														handleProfileSettings
													}
												>
													<div className="flex items-center">
														<UserIcon
															size={16}
															className="mr-3"
															aria-hidden="true"
														/>
														Profile Settings
													</div>
												</button>
											</li>
											<li className="border-t border-gray-100 dark:border-neutral-800 mt-1 pt-1">
												<button
													type="button"
													onClick={handleLogout}
													className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
													role="menuitem"
												>
													<div className="flex items-center">
														<LogOutIcon
															size={16}
															className="mr-3"
															aria-hidden="true"
														/>
														Sign Out
													</div>
												</button>
											</li>
										</ul>
									</nav>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</motion.header>
	);
}
