"use client";

import React, { useState, useEffect } from "react";
import {
	LayoutDashboardIcon,
	SearchIcon,
	MessageSquareIcon,
	MapPinIcon,
	PackagePlusIcon,
	PackageCheckIcon,
	UserIcon,
	XIcon,
	MenuIcon,
	BellIcon,
	CheckIcon,
} from "lucide-react";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const sidebar = [
		{
			name: "Dashboard",
			path: "/",
			icon: <LayoutDashboardIcon size={20} />,
		},
		{
			name: "New Item",
			path: "/new-item",
			icon: <PackagePlusIcon size={20} />,
		},
		{
			name: "Search Items",
			path: "/search",
			icon: <SearchIcon size={20} />,
		},
		{
			name: "My Items",
			path: "/my-items",
			icon: <PackageCheckIcon size={20} />,
		},
		{
			name: "Messages",
			path: "/messages",
			icon: <MessageSquareIcon size={20} />,
		},
		{
			name: "Locations",
			path: "/locations",
			icon: <MapPinIcon size={20} />,
		},
	];

	const initialTab = searchParams.get("tab") || "dashboard";
	const [activeTab, setActiveTab] = useState(initialTab);

	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
		router.push(`/dashboard?tab=${tab}`, { scroll: false });
	};

	useEffect(() => {
		setActiveTab(initialTab);
	}, [initialTab]);

	const mockNotifications = [
		{
			id: 1,
			title: "New Match Found",
			message: "Someone found an item matching your lost MacBook Pro",
			time: "2 minutes ago",
			isRead: false,
		},
		{
			id: 2,
			title: "Message Received",
			message: "Emily Johnson sent you a message about your lost item",
			time: "1 hour ago",
			isRead: false,
		},
		{
			id: 3,
			title: "Status Update",
			message: "Your lost water bottle has been marked as found",
			time: "2 days ago",
			isRead: true,
		},
	];

	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const unreadCount = mockNotifications.filter((notification) => !notification.isRead).length;

	return (
		<div className="h-screen w-full flex flex-col">
			<header className="bg-white border-b border-gray-200 shadow-sm z-10 w-full fixed top-0 left-0 right-0">
				<div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
					<div className="flex items-center">
						<button
							className="md:hidden mr-3 text-gray-600"
							onClick={() => setShowMobileMenu(!showMobileMenu)}
						>
							{showMobileMenu ? <XIcon size={24} /> : <MenuIcon size={24} />}
						</button>
						<div className="flex items-center">
							<Image
								src="/logo.png"
								alt="GC Yofinder"
								width={32}
								height={32}
								className="rounded-full mr-2"
							/>
							<h1 className="text-lg font-semibold text-gray-800">GC Yofinder</h1>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<div className="relative">
							<button
								className="text-gray-600 hover:text-gray-800"
								onClick={() => {
									setShowNotifications(!showNotifications);
									if (showProfileMenu) setShowProfileMenu(false);
								}}
							>
								<BellIcon size={20} />
								{unreadCount > 0 && (
									<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
								)}
							</button>
							{showNotifications && (
								<div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-50 py-2">
									<div className="px-4 py-2 border-b border-gray-100">
										<div className="flex justify-between items-center">
											<h3 className="text-sm font-medium text-gray-700">Notifications</h3>
											{unreadCount > 0 && (
												<span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
													{unreadCount} new
												</span>
											)}
										</div>
									</div>
									<div className="max-h-80 overflow-y-auto">
										{mockNotifications.length > 0 ? (
											mockNotifications.map((notification) => (
												<div
													key={notification.id}
													className={`px-4 py-3 hover:bg-gray-50 ${
														!notification.isRead ? "bg-emerald-50" : ""
													} border-b border-gray-100`}
												>
													<div className="flex">
														<div
															className={`flex-shrink-0 h-8 w-8 rounded-full ${
																!notification.isRead ? "bg-emerald-100" : "bg-gray-100"
															} flex items-center justify-center mr-3`}
														>
															{!notification.isRead ? (
																<BellIcon size={16} className="text-emerald-500" />
															) : (
																<CheckIcon size={16} className="text-gray-400" />
															)}
														</div>
														<div>
															<p className="text-sm font-medium text-gray-800">
																{notification.title}
															</p>
															<p className="text-xs text-gray-500 mt-0.5">
																{notification.message}
															</p>
															<p className="text-xs text-gray-400 mt-1">
																{notification.time}
															</p>
														</div>
													</div>
												</div>
											))
										) : (
											<div className="px-4 py-6 text-center">
												<p className="text-gray-500 text-sm">No notifications</p>
											</div>
										)}
									</div>
									<div className="px-4 py-2 border-t border-gray-100 mt-1">
										<button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium w-full text-center">
											Mark all as read
										</button>
									</div>
								</div>
							)}
						</div>
						<div className="relative">
							<button
								className="flex items-center space-x-2"
								onClick={() => {
									setShowProfileMenu(!showProfileMenu);
									if (showNotifications) setShowNotifications(false);
								}}
							>
								<div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
									<UserIcon size={18} />
								</div>
								<span className="hidden sm:inline-block text-sm font-medium text-gray-700">
									John Smith
								</span>
							</button>
							{showProfileMenu && (
								<div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg ring-1 ring-black/5 !z-50">
									<div
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={() => setShowProfileMenu(false)}
									>
										Profile Settings
									</div>
									<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
										Sign Out
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			<div className="flex flex-1 pt-16">
				<aside className="fixed left-0 top-16 w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto hidden md:block z-10">
					<nav className="py-4">
						<div className="px-4 mb-6">
							<h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Main Menu</h2>
						</div>
						<div className="px-4 mb-6"></div>
						<ul className="space-y-1">
							{sidebar.map((item) => (
								<a
									onClick={() => handleTabClick(item.name.toLowerCase().replace(/ /g, "-"))}
									className={`text-emerald-700 flex items-center px-4 py-3 transition-all duration-300 font-normal  ${
										activeTab === item.name.toLowerCase().replace(/ /g, "-")
											? "bg-emerald-50 font-medium border-l-4 border-emerald-500"
											: "hover:bg-emerald-50"
									} cursor-pointer `}
									key={item.name}
								>
									<span className="mr-3 text-gray-500">{item.icon}</span>
									<span>{item.name}</span>
								</a>
							))}
						</ul>
					</nav>
				</aside>

				{showMobileMenu && (
					<div
						className="md:hidden fixed inset-0  bg-black/50 top-14"
						onClick={() => setShowMobileMenu(false)}
					>
						<aside className="w-64 bg-white h-full overflow-y-auto">
							<nav className="py-4">
								<div className="px-4 mb-6">
									<h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
										Main Menu
									</h2>
								</div>
								<ul className="space-y-1">
									{sidebar.map((item) => (
										<a
											onClick={() => {
												handleTabClick(item.name.toLowerCase().replace(/ /g, "-"));
												setShowMobileMenu(false);
											}}
											className={`text-emerald-700 flex items-center px-4 py-3 transition-all duration-300 font-normal  ${
												activeTab === item.name.toLowerCase().replace(/ /g, "-")
													? "bg-emerald-50 font-medium border-l-4 border-emerald-500"
													: "hover:bg-emerald-50"
											} cursor-pointer `}
											key={item.name}
										>
											<span className="mr-3 text-gray-500">{item.icon}</span>
											<span>{item.name}</span>
										</a>
									))}
								</ul>
							</nav>
						</aside>
					</div>
				)}

				{/* Main content area */}
				<main className="flex-1 bg-gray-50 overflow-y-auto p-6 md:ml-64">
					<div className="max-w-7xl mx-auto">
						<h2 className="text-2xl font-semibold text-gray-900 mb-6">
							{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace("-", " ")}
						</h2>

						<div className="bg-white rounded-lg shadow p-6">
							<p className="text-gray-600">hato</p>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
