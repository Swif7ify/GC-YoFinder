"use client";

import React, { useState } from "react";
import {
	BarChartIcon,
	UsersIcon,
	ClipboardListIcon,
	LineChartIcon,
	ClockIcon,
	DownloadIcon,
	CheckCircleIcon,
	ListIcon,
	ArchiveIcon,
	ChevronRightIcon,
	LogOutIcon,
} from "lucide-react";

interface AdminSidebarProps {
	isOpen: boolean;
	activeTab: string;
	onTabClick: (tab: string) => void;
	onLogout: () => void;
	pendingCount?: number;
}

export default function AdminSidebar({ isOpen, activeTab, onTabClick, onLogout, pendingCount = 0 }: AdminSidebarProps) {
	const [itemManagementOpen, setItemManagementOpen] = useState(true);

	const isActive = (tab: string) => activeTab === tab;
	const isItemManagementActive = () => activeTab.startsWith("item-");

	if (!isOpen) return null;

	return (
		<aside className="w-64 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 fixed overflow-y-auto z-10">
			<div className="py-4">
				{/* Pending Approvals Card */}
				<div className="px-4 mb-6">
					<div
						className={`px-3 py-3 rounded-lg border ${
							pendingCount > 0
								? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800"
								: "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800"
						}`}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-gray-500 dark:text-gray-400">
									Pending Approvals
								</p>
								<p
									className={`text-xl font-bold ${
										pendingCount > 0
											? "text-orange-600 dark:text-orange-400"
											: "text-emerald-600 dark:text-emerald-400"
									}`}
								>
									{pendingCount}
								</p>
							</div>
							<button
								onClick={() => onTabClick("item-pending")}
								className={`p-1 bg-white dark:bg-neutral-800 rounded-full border ${
									pendingCount > 0
										? "border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/30"
										: "border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
								}`}
							>
								<ChevronRightIcon
									size={14}
									className={
										pendingCount > 0
											? "text-orange-500 dark:text-orange-400"
											: "text-emerald-500 dark:text-emerald-400"
									}
								/>
							</button>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="space-y-1 px-3">
					<button
						onClick={() => onTabClick("dashboard")}
						className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
							isActive("dashboard")
								? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
								: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
						}`}
					>
						<BarChartIcon
							size={18}
							className={`mr-3 ${
								isActive("dashboard")
									? "text-emerald-500 dark:text-emerald-400"
									: "text-gray-500 dark:text-gray-400"
							}`}
						/>
						Dashboard
					</button>

					<button
						onClick={() => onTabClick("users")}
						className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
							isActive("users")
								? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
								: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
						}`}
					>
						<UsersIcon
							size={18}
							className={`mr-3 ${
								isActive("users")
									? "text-emerald-500 dark:text-emerald-400"
									: "text-gray-500 dark:text-gray-400"
							}`}
						/>
						User Management
					</button>

					{/* Item Management Dropdown */}
					<div>
						<button
							onClick={() => setItemManagementOpen(!itemManagementOpen)}
							className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
								isItemManagementActive()
									? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
									: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
							}`}
						>
							<div className="flex items-center">
								<ClipboardListIcon
									size={18}
									className={`mr-3 ${
										isItemManagementActive()
											? "text-emerald-500 dark:text-emerald-400"
											: "text-gray-500 dark:text-gray-400"
									}`}
								/>
								Item Management
							</div>
							<ChevronRightIcon
								size={16}
								className={`transform transition-transform ${itemManagementOpen ? "rotate-90" : ""}`}
							/>
						</button>

						{itemManagementOpen && (
							<div className="pl-10 space-y-1 mt-1">
								<button
									onClick={() => onTabClick("item-all")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
										isActive("item-all")
											? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
											: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
									}`}
								>
									<ListIcon size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
									All Items
								</button>
								<button
									onClick={() => onTabClick("item-pending")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
										isActive("item-pending")
											? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
											: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
									}`}
								>
									<CheckCircleIcon size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
									Pending Review
								</button>
								<button
									onClick={() => onTabClick("item-active")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
										isActive("item-active")
											? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
											: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
									}`}
								>
									<CheckCircleIcon size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
									Active
								</button>
								<button
									onClick={() => onTabClick("item-claimed")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
										isActive("item-claimed")
											? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
											: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
									}`}
								>
									<CheckCircleIcon size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
									Claimed
								</button>
								<button
									onClick={() => onTabClick("item-archived")}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
										isActive("item-archived")
											? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
											: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
									}`}
								>
									<ArchiveIcon size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
									Archived
								</button>
							</div>
						)}
					</div>

					<button
						onClick={() => onTabClick("reports")}
						className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
							isActive("reports")
								? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
								: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
						}`}
					>
						<LineChartIcon
							size={18}
							className={`mr-3 ${
								isActive("reports")
									? "text-emerald-500 dark:text-emerald-400"
									: "text-gray-500 dark:text-gray-400"
							}`}
						/>
						Reports & Analytics
					</button>

					<button
						onClick={() => onTabClick("activity")}
						className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
							isActive("activity")
								? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
								: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
						}`}
					>
						<ClockIcon
							size={18}
							className={`mr-3 ${
								isActive("activity")
									? "text-emerald-500 dark:text-emerald-400"
									: "text-gray-500 dark:text-gray-400"
							}`}
						/>
						Activity Logs
					</button>

					<button
						onClick={() => onTabClick("export")}
						className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
							isActive("export")
								? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
								: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
						}`}
					>
						<DownloadIcon
							size={18}
							className={`mr-3 ${
								isActive("export")
									? "text-emerald-500 dark:text-emerald-400"
									: "text-gray-500 dark:text-gray-400"
							}`}
						/>
						Data Export
					</button>
				</nav>
			</div>

			{/* Sign Out */}
			<div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
				<button
					onClick={onLogout}
					className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
				>
					<LogOutIcon size={18} className="mr-3 text-red-500 dark:text-red-400" />
					Sign Out
				</button>
			</div>
		</aside>
	);
}
