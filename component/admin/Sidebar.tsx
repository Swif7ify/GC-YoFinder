import React, { useState } from "react";
import Link from "next/link";
import {
	BarChartIcon,
	UsersIcon,
	ClipboardListIcon,
	LineChartIcon,
	ClockIcon,
	SettingsIcon,
	BuildingIcon,
	MessageCircleIcon,
	LockIcon,
	UploadIcon,
	CheckCircleIcon,
	ListIcon,
	ArchiveIcon,
	ChevronRightIcon,
	LogOutIcon,
} from "lucide-react";
interface AdminSidebarProps {
	isOpen: boolean;
}
export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
	const [itemManagementOpen, setItemManagementOpen] = useState(true);
	const isActive = (path: string) => {
		return location.pathname === path;
	};
	const isItemManagementActive = () => {
		return location.pathname.includes("/admin/item-management");
	};
	if (!isOpen) return null;
	return (
		<aside className="w-64 h-full bg-white border-r border-gray-200 fixed overflow-y-auto">
			<div className="py-4">
				<div className="px-4 mb-6">
					<div className="px-2 py-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-gray-500">Pending Approvals</p>
								<p className="text-xl font-bold text-red-600">15</p>
							</div>
							<Link
								href="/admin/item-management/pending-approvals"
								className="p-1 bg-white rounded-full border border-red-200 hover:bg-red-50"
							>
								<ChevronRightIcon size={14} className="text-red-500" />
							</Link>
						</div>
					</div>
				</div>
				<div className="space-y-1 px-3">
					<Link
						href="/admin/dashboard"
						className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
							isActive("/admin/dashboard") ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-100"
						}`}
					>
						<BarChartIcon
							size={18}
							className={`mr-3 ${isActive("/admin/dashboard") ? "text-red-500" : "text-gray-500"}`}
						/>
						Dashboard
					</Link>
					<Link
						href="/admin/user-management"
						className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
							isActive("/admin/user-management")
								? "bg-red-50 text-red-700"
								: "text-gray-700 hover:bg-gray-100"
						}`}
					>
						<UsersIcon
							size={18}
							className={`mr-3 ${isActive("/admin/user-management") ? "text-red-500" : "text-gray-500"}`}
						/>
						User Management
					</Link>
					<div>
						<button
							onClick={() => setItemManagementOpen(!itemManagementOpen)}
							className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
								isItemManagementActive() ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-100"
							}`}
						>
							<div className="flex items-center">
								<ClipboardListIcon
									size={18}
									className={`mr-3 ${isItemManagementActive() ? "text-red-500" : "text-gray-500"}`}
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
								<Link
									href="/admin/item-management/pending-approvals"
									className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										isActive("/admin/item-management/pending-approvals")
											? "bg-red-50 text-red-700"
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									<CheckCircleIcon size={16} className="mr-2 text-gray-400" />
									Pending Approvals
								</Link>
								<Link
									href="/admin/item-management/active-listings"
									className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										isActive("/admin/item-management/active-listings")
											? "bg-red-50 text-red-700"
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									<ListIcon size={16} className="mr-2 text-gray-400" />
									Active Listings
								</Link>
								<Link
									href="/admin/item-management/claimed-items"
									className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										isActive("/admin/item-management/claimed-items")
											? "bg-red-50 text-red-700"
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									<CheckCircleIcon size={16} className="mr-2 text-gray-400" />
									Claimed Items
								</Link>
								<Link
									href="/admin/item-management/archived-items"
									className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										isActive("/admin/item-management/archived-items")
											? "bg-red-50 text-red-700"
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									<ArchiveIcon size={16} className="mr-2 text-gray-400" />
									Archived Items
								</Link>
							</div>
						)}
					</div>
					<Link
						href="/admin/reports-analytics"
						className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
							isActive("/admin/reports-analytics")
								? "bg-red-50 text-red-700"
								: "text-gray-700 hover:bg-gray-100"
						}`}
					>
						<LineChartIcon
							size={18}
							className={`mr-3 ${
								isActive("/admin/reports-analytics") ? "text-red-500" : "text-gray-500"
							}`}
						/>
						Reports & Analytics
					</Link>
					<Link
						href="/admin/activity-logs"
						className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
							isActive("/admin/activity-logs")
								? "bg-red-50 text-red-700"
								: "text-gray-700 hover:bg-gray-100"
						}`}
					>
						<ClockIcon
							size={18}
							className={`mr-3 ${isActive("/admin/activity-logs") ? "text-red-500" : "text-gray-500"}`}
						/>
						Activity Logs
					</Link>
					<Link
						href="/admin/system-settings"
						className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
							isActive("/admin/system-settings")
								? "bg-red-50 text-red-700"
								: "text-gray-700 hover:bg-gray-100"
						}`}
					>
						<SettingsIcon
							size={18}
							className={`mr-3 ${isActive("/admin/system-settings") ? "text-red-500" : "text-gray-500"}`}
						/>
						System Settings
					</Link>
					<Link
						href="/admin/location-management"
						className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
							isActive("/admin/location-management")
								? "bg-red-50 text-red-700"
								: "text-gray-700 hover:bg-gray-100"
						}`}
					>
						<BuildingIcon
							size={18}
							className={`mr-3 ${
								isActive("/admin/location-management") ? "text-red-500" : "text-gray-500"
							}`}
						/>
						Location Management
					</Link>
					<Link
						href="/admin/communication-center"
						className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
							isActive("/admin/communication-center")
								? "bg-red-50 text-red-700"
								: "text-gray-700 hover:bg-gray-100"
						}`}
					>
						<MessageCircleIcon
							size={18}
							className={`mr-3 ${
								isActive("/admin/communication-center") ? "text-red-500" : "text-gray-500"
							}`}
						/>
						Communication Center
					</Link>
					<Link
						href="/admin/security-permissions"
						className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
							isActive("/admin/security-permissions")
								? "bg-red-50 text-red-700"
								: "text-gray-700 hover:bg-gray-100"
						}`}
					>
						<LockIcon
							size={18}
							className={`mr-3 ${
								isActive("/admin/security-permissions") ? "text-red-500" : "text-gray-500"
							}`}
						/>
						Security & Permissions
					</Link>
					<Link
						href="/admin/data-export"
						className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
							isActive("/admin/data-export")
								? "bg-red-50 text-red-700"
								: "text-gray-700 hover:bg-gray-100"
						}`}
					>
						<UploadIcon
							size={18}
							className={`mr-3 ${isActive("/admin/data-export") ? "text-red-500" : "text-gray-500"}`}
						/>
						Data Export
					</Link>
					<Link
						href="/admin/system-maintenance"
						className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
							isActive("/admin/system-maintenance")
								? "bg-red-50 text-red-700"
								: "text-gray-700 hover:bg-gray-100"
						}`}
					>
						<div
							className={`mr-3 ${
								isActive("/admin/system-maintenance") ? "text-red-500" : "text-gray-500"
							}`}
						/>
						System Maintenance
					</Link>
				</div>
			</div>
			<div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
				<Link
					href="/admin/signin"
					className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
				>
					<LogOutIcon size={18} className="mr-3 text-red-500" />
					Sign Out
				</Link>
			</div>
		</aside>
	);
}
