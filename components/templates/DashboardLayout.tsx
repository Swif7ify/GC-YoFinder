import React from "react";
import { Header, Sidebar } from "../organisms";

interface DashboardLayoutProps {
	children: React.ReactNode;
	headerProps: {
		setShowMobileMenu: (show: boolean) => void;
		showMobileMenu: boolean;
		showNotifications: boolean;
		setShowNotifications: (show: boolean) => void;
		showProfileMenu: boolean;
		setShowProfileMenu: (show: boolean) => void;
		unreadCount: number;
		mockNotifications: any[];
		handleLogout: () => void;
		userData: any;
	};
	sidebarProps: {
		activeTab: string;
		handleTabClick: (tab: string) => void;
		handleLogout: () => void;
		navItems: { name: string; icon: React.ReactNode }[];
		showMobileMenu: boolean;
		setShowMobileMenu: (show: boolean) => void;
		unreadMessageCount?: number;
	};
}

export default function DashboardLayout({
	children,
	headerProps,
	sidebarProps,
}: DashboardLayoutProps) {
	return (
		<div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-black">
			<Sidebar {...sidebarProps} />
			<div className="flex flex-col flex-1 overflow-hidden">
				<Header {...headerProps} />
				<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
					{children}
				</main>
			</div>
		</div>
	);
}

