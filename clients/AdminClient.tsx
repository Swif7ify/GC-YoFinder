"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Dynamic from "next/dynamic";

const Header = Dynamic(() => import("@/component/admin/Header").then((mod) => mod.default), { ssr: false });
const Sidebar = Dynamic(() => import("@/component/admin/Sidebar").then((mod) => mod.default), { ssr: false });

// Page components
const DashboardPage = Dynamic(() => import("@/component/admin/pages/DashboardPage").then((mod) => mod.default), {
	ssr: false,
});
const UsersPage = Dynamic(() => import("@/component/admin/pages/UsersPage").then((mod) => mod.default), { ssr: false });
const ItemPendingPage = Dynamic(() => import("@/component/admin/pages/ItemPendingPage").then((mod) => mod.default), {
	ssr: false,
});
const ItemActivePage = Dynamic(() => import("@/component/admin/pages/ItemActivePage").then((mod) => mod.default), {
	ssr: false,
});
const ItemClaimedPage = Dynamic(() => import("@/component/admin/pages/ItemClaimedPage").then((mod) => mod.default), {
	ssr: false,
});
const ItemArchivedPage = Dynamic(() => import("@/component/admin/pages/ItemArchivedPage").then((mod) => mod.default), {
	ssr: false,
});
const ReportsPage = Dynamic(() => import("@/component/admin/pages/ReportsPage").then((mod) => mod.default), {
	ssr: false,
});
const ActivityPage = Dynamic(() => import("@/component/admin/pages/ActivityPage").then((mod) => mod.default), {
	ssr: false,
});
const SettingsPage = Dynamic(() => import("@/component/admin/pages/SettingsPage").then((mod) => mod.default), {
	ssr: false,
});
const LocationsPage = Dynamic(() => import("@/component/admin/pages/LocationsPage").then((mod) => mod.default), {
	ssr: false,
});
const MessagesPage = Dynamic(() => import("@/component/admin/pages/MessagesPage").then((mod) => mod.default), {
	ssr: false,
});
const SecurityPage = Dynamic(() => import("@/component/admin/pages/SecurityPage").then((mod) => mod.default), {
	ssr: false,
});
const ExportPage = Dynamic(() => import("@/component/admin/pages/ExportPage").then((mod) => mod.default), {
	ssr: false,
});
const MaintenancePage = Dynamic(() => import("@/component/admin/pages/MaintenancePage").then((mod) => mod.default), {
	ssr: false,
});

const TAB_MAP: Record<string, string> = {
	dashboard: "Dashboard",
	users: "User Management",
	"item-pending": "Pending Approvals",
	"item-active": "Active Listings",
	"item-claimed": "Claimed Items",
	"item-archived": "Archived Items",
	reports: "Reports & Analytics",
	activity: "Activity Logs",
	settings: "System Settings",
	locations: "Location Management",
	messages: "Communication Center",
	security: "Security & Permissions",
	export: "Data Export",
	maintenance: "System Maintenance",
};

export default function AdminClient() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [activeTab, setActiveTab] = useState("dashboard");
	const mainRef = useRef<HTMLElement | null>(null);

	const handleMenuClick = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
	};

	const handleLogout = () => {
		// TODO: Implement logout
		console.log("Logout clicked");
	};

	const componentMap: Record<string, React.ReactNode> = {
		dashboard: <DashboardPage />,
		users: <UsersPage />,
		"item-pending": <ItemPendingPage />,
		"item-active": <ItemActivePage />,
		"item-claimed": <ItemClaimedPage />,
		"item-archived": <ItemArchivedPage />,
		reports: <ReportsPage />,
		activity: <ActivityPage />,
		settings: <SettingsPage />,
		locations: <LocationsPage />,
		messages: <MessagesPage />,
		security: <SecurityPage />,
		export: <ExportPage />,
		maintenance: <MaintenancePage />,
	};

	const ActiveComponent = componentMap[activeTab];

	return (
		<div className="h-screen overflow-hidden bg-gray-50 dark:bg-black">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white/95 dark:bg-neutral-900/80 p-2 rounded"
			>
				Skip to main content
			</a>
			<div className="flex flex-row h-full">
				<Sidebar
					isOpen={sidebarOpen}
					activeTab={activeTab}
					onTabClick={handleTabClick}
					onLogout={handleLogout}
				/>
				<div
					className={`flex-1 flex flex-col min-w-0 ${sidebarOpen ? "ml-64" : ""} transition-all duration-300`}
				>
					<Header title={TAB_MAP[activeTab] ?? "Dashboard"} onMenuClick={handleMenuClick} />

					<main
						id="main-content"
						ref={mainRef}
						tabIndex={-1}
						aria-live="polite"
						aria-label={`${TAB_MAP[activeTab] ?? "Dashboard"} content`}
						className="overflow-auto p-6 w-full flex-1"
					>
						<motion.div
							key={activeTab}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							{ActiveComponent || "Component not found."}
						</motion.div>
					</main>
				</div>
			</div>
		</div>
	);
}
