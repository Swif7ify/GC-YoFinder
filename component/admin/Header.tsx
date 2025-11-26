import React, { useState } from "react";
import Link from "next/link";
import { BellIcon, MenuIcon, AlertTriangleIcon, ShieldIcon, UserIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import Image from "next/image";
interface AdminHeaderProps {
	title: string;
	onMenuClick: () => void;
}
export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const [maintenanceMode, setMaintenanceMode] = useState(false);
	const toggleNotifications = () => {
		setNotificationsOpen(!notificationsOpen);
		if (profileOpen) setProfileOpen(false);
	};
	const toggleProfile = () => {
		setProfileOpen(!profileOpen);
		if (notificationsOpen) setNotificationsOpen(false);
	};
	const toggleMaintenanceMode = () => {
		setMaintenanceMode(!maintenanceMode);
	};
	return (
		<header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10">
			<div className="flex items-center">
				<button onClick={onMenuClick} className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
					<MenuIcon size={20} />
				</button>
				<Link href="/admin/dashboard" className="flex items-center">
					<Image
						src="/logo.png"
						alt="GC YoFinder Logo"
						width={40}
						height={40}
						className="mr-2 rounded-full"
					/>
					<div className="flex flex-col">
						<span className="font-semibold text-gray-900">GC YoFinder</span>
						<span className="text-xs text-red-600 font-medium">Admin Portal</span>
					</div>
				</Link>
			</div>
			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-2">
					<span className="text-sm font-medium text-gray-700">System:</span>
					<div className="flex items-center">
						<span
							className={`h-2 w-2 rounded-full mr-1 ${
								maintenanceMode ? "bg-orange-500" : "bg-green-500"
							}`}
						></span>
						<span className="text-sm">{maintenanceMode ? "Maintenance Mode" : "Operational"}</span>
					</div>
				</div>
				<button
					onClick={toggleMaintenanceMode}
					className={`px-3 py-1 rounded-full text-xs font-medium ${
						maintenanceMode
							? "bg-orange-100 text-orange-700 hover:bg-orange-200"
							: "bg-gray-100 text-gray-700 hover:bg-gray-200"
					} transition-colors`}
				>
					{maintenanceMode ? "Exit Maintenance" : "Maintenance Mode"}
				</button>
				<button
					onClick={toggleNotifications}
					className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
				>
					<BellIcon size={20} />
					<span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
						3
					</span>
				</button>
				{notificationsOpen && (
					<div className="absolute right-16 top-14 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-20">
						<div className="p-3 border-b border-gray-200">
							<div className="flex justify-between items-center">
								<h3 className="font-medium">Notifications</h3>
								<span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">3 new</span>
							</div>
						</div>
						<div className="max-h-80 overflow-y-auto">
							<div className="p-3 border-l-4 border-red-500 hover:bg-gray-50 cursor-pointer">
								<div className="flex items-start">
									<div className="bg-red-100 p-2 rounded-full mr-3">
										<AlertTriangleIcon size={16} className="text-red-600" />
									</div>
									<div>
										<p className="text-sm font-medium">Critical: Failed login attempts</p>
										<p className="text-xs text-gray-500">
											Multiple failed login attempts detected for admin account
										</p>
										<p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
									</div>
								</div>
							</div>
							<div className="p-3 border-l-4 border-orange-500 hover:bg-gray-50 cursor-pointer">
								<div className="flex items-start">
									<div className="bg-orange-100 p-2 rounded-full mr-3">
										<AlertTriangleIcon size={16} className="text-orange-600" />
									</div>
									<div>
										<p className="text-sm font-medium">Flagged item requires review</p>
										<p className="text-xs text-gray-500">
											High-value item reported found needs verification
										</p>
										<p className="text-xs text-gray-400 mt-1">25 minutes ago</p>
									</div>
								</div>
							</div>
							<div className="p-3 border-l-4 border-blue-500 hover:bg-gray-50 cursor-pointer">
								<div className="flex items-start">
									<div className="bg-blue-100 p-2 rounded-full mr-3">
										<SettingsIcon size={16} className="text-blue-600" />
									</div>
									<div>
										<p className="text-sm font-medium">System backup completed</p>
										<p className="text-xs text-gray-500">
											Daily system backup completed successfully
										</p>
										<p className="text-xs text-gray-400 mt-1">1 hour ago</p>
									</div>
								</div>
							</div>
							<div className="p-3 hover:bg-gray-50 cursor-pointer">
								<div className="flex items-start">
									<div className="bg-gray-100 p-2 rounded-full mr-3">
										<UserIcon size={16} className="text-gray-600" />
									</div>
									<div>
										<p className="text-sm font-medium">New admin account created</p>
										<p className="text-xs text-gray-500">Jessica Rodriguez added as Moderator</p>
										<p className="text-xs text-gray-400 mt-1">1 day ago</p>
									</div>
								</div>
							</div>
						</div>
						<div className="p-2 border-t border-gray-200 text-center">
							<button className="text-sm text-red-600 hover:text-red-800 font-medium">
								Mark all as read
							</button>
						</div>
					</div>
				)}
				<button
					onClick={toggleProfile}
					className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
				>
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-medium">
						SJ
					</div>
				</button>
				{profileOpen && (
					<div className="absolute right-4 top-14 w-60 bg-white rounded-md shadow-lg border border-gray-200 z-20">
						<div className="p-4 border-b border-gray-200">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-medium">
									SJ
								</div>
								<div>
									<p className="font-medium">Sarah Johnson</p>
									<p className="text-xs text-gray-500">s.johnson@gordon.edu</p>
									<span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full mt-1 inline-block">
										Super Admin
									</span>
								</div>
							</div>
						</div>
						<div className="py-1">
							<Link
								href="/admin/profile-settings"
								className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								<UserIcon size={16} className="mr-3 text-gray-500" />
								Profile Settings
							</Link>
							<Link
								href="/admin/security-permissions"
								className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								<ShieldIcon size={16} className="mr-3 text-gray-500" />
								Security & Permissions
							</Link>
							<Link
								href="/admin/signin"
								className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
							>
								<LogOutIcon size={16} className="mr-3 text-red-500" />
								Sign Out
							</Link>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
