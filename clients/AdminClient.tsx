"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Dynamic from "next/dynamic";

const Header = Dynamic(() => import("@/component/admin/Header").then((mod) => mod.default), { ssr: false });
const Sidebar = Dynamic(() => import("@/component/admin/Sidebar").then((mod) => mod.default), { ssr: false });

const TAB_MAP: Record<string, string> = {
	dashboard: "Dashboard",
	"user-management": "User Management",
	"item-management": "Item Management",
	"reports-analytics": "Reports & Analytics",
	"activity-logs": "Activity Logs",
	"system-settings": "System Settings",
};

export default function AdminClient() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [activeTab, setActiveTab] = useState("dashboard");
	const mainRef = useRef<HTMLElement | null>(null);

	const handleMenuClick = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<div className="h-screen overflow-hidden bg-gray-50">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white/95 dark:bg-neutral-900/80 p-2 rounded"
			>
				Skip to main content
			</a>
			<div className="flex flex-row h-full">
				<Sidebar isOpen={sidebarOpen} />
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
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
								<h1 className="text-2xl font-semibold text-gray-900 mb-4">
									{TAB_MAP[activeTab] ?? "Dashboard"}
								</h1>
								<p className="text-gray-600">
									Welcome to the admin panel. Select an option from the sidebar to get started.
								</p>
							</div>
						</motion.div>
					</main>
				</div>
			</div>
		</div>
	);
}
