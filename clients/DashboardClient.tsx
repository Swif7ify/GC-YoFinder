"use client";

import React, { useState, useEffect, useRef } from "react";
import {
	LayoutDashboardIcon,
	SearchIcon,
	MessageSquareIcon,
	MapPinIcon,
	PackagePlusIcon,
	PackageCheckIcon,
	SettingsIcon,
} from "lucide-react";

import { UserData } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api.config";
import Dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { toastError } from "@/utils/toast";
import { useApiLoading } from "@/hooks/useApiLoading";
import { useConfirm } from "@/ui/ConfirmProvider";

const Sidebar = Dynamic(
	() => import("@/component/dashboard/Sidebar").then((mod) => mod.default),
	{ ssr: false }
);
const Header = Dynamic(
	() => import("@/component/dashboard/Header").then((mod) => mod.default),
	{ ssr: false }
);

const HomeComponent = Dynamic(
	() =>
		import("@/component/dashboard/items/HomeComponent").then(
			(mod) => mod.default
		),
	{ ssr: false }
);

const NewItemComponent = Dynamic(
	() =>
		import("@/component/dashboard/items/NewItemComponent").then(
			(mod) => mod.default
		),
	{ ssr: false }
);

const SearchItemsComponent = Dynamic(
	() =>
		import("@/component/dashboard/items/SearchItemsComponent").then(
			(mod) => mod.default
		),
	{ ssr: false }
);

const MyItemsComponent = Dynamic(
	() =>
		import("@/component/dashboard/items/MyItemsComponent").then(
			(mod) => mod.default
		),
	{ ssr: false }
);

const LocationsComponent = Dynamic(
	() =>
		import("@/component/dashboard/items/LocationsComponent").then(
			(mod) => mod.default
		),
	{ ssr: false }
);

const MessagesComponent = Dynamic(
	() =>
		import("@/component/dashboard/items/MessagesComponent").then(
			(mod) => mod.default
		),
	{ ssr: false }
);

const SettingsComponent = Dynamic(
	() =>
		import("@/component/dashboard/items/SettingsComponent").then(
			(mod) => mod.default
		),
	{ ssr: false }
);

const TAB_MAP: Record<string, string> = {
	dashboard: "Dashboard",
	"new-item": "New Item",
	"search-items": "Search Items",
	"my-items": "My Items",
	messages: "Messages",
	locations: "Locations",
	settings: "Settings",
};

export default function DashboardPage() {
	const confirm = useConfirm();
	const { withLoading } = useApiLoading();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [userItems, setUserItems] = useState([]);
	const initialTab = searchParams.get("tab") || "dashboard";
	const [activeTab, setActiveTab] = useState(initialTab);
	const mainRef = useRef<HTMLElement | null>(null);

	// userData
	const [userData, setUserData] = useState<UserData>(
		[] as unknown as UserData
	);

	useEffect(() => {
		const tab = (searchParams?.get("tab") ?? "dashboard").toLowerCase();
		document.title = `GC YoFinder | ${TAB_MAP[tab] ?? "Dashboard"}`;
	}, [searchParams]);
	const navItems = [
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
		{
			name: "Settings",
			path: "/settings",
			icon: <SettingsIcon size={20} />,
		},
	];

	const fetchUserData = async () => {
		try {
			const response = await api("/api/dashboard/user", {
				method: "GET",
			});

			if (response.status !== 200) {
				toastError("Server Error", "Unable to fetch user data.");
				return;
			}

			const data = await response.json();
			setUserData(data.data);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	const fetchUserItems = async () => {
		try {
			const response = await api("/api/items");
			if (response.status !== 200) {
				toastError("Server Error", "Unable to fetch user items.");
				return;
			}
			const data = await response.json();
			const mappedItems = data.items.map((item: any) => ({
				...item,
				id: item._id,
				title: item.name,
				description: item.description,
				type: item.type,
				location: item.location,
				dateReported: item.date_lost_or_found,
				status: item.status,
				views: item.views,
				matchCount: item.matched,
				image_url: item.photos.length > 0 ? item.photos[0].url : null,
				category: item.category,
			}));

			setUserItems(mappedItems);
		} catch (error) {
			console.error("Error fetching user items:", error);
		}
	};

	const componentMap: Record<string, React.ReactNode> = {
		dashboard: (
			<HomeComponent
				userFullName={userData.firstname + " " + userData.lastname}
			/>
		),
		"new-item": <NewItemComponent />,
		"search-items": <SearchItemsComponent />,
		"my-items": <MyItemsComponent userItems={userItems} onUpdate={fetchUserItems} />,
		messages: <MessagesComponent />,
		locations: <LocationsComponent />,
		settings: (
			<SettingsComponent userData={userData} onChange={fetchUserData} />
		),
	};

	const ActiveComponent =
		componentMap[activeTab as keyof typeof componentMap];

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

	const unreadCount = mockNotifications.filter(
		(notification) => !notification.isRead
	).length;

	const handleLogout = async () => {
		const ok = await confirm({
			title: "Confirm Logout",
			description: "Are you sure you want to log out?",
			variant: "danger",
			cancelText: "Cancel",
			confirmText: "Logout",
		});

		if (!ok) return;
		try {
			const response = await api("/api/logout", {
				method: "POST",
			});

			if (response.ok) {
				router.replace("/login");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const fetch = async () => {
			await withLoading(() =>
				Promise.all([fetchUserData(), fetchUserItems()])
			);
		};
		fetch();
	}, []);

	return (
		<div className="h-screen overflow-hidden">
			{/* sidebar */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white/95 dark:bg-neutral-900/80 p-2 rounded"
			>
				Skip to main content
			</a>
			<div className="flex flex-row h-full">
				<Sidebar
					activeTab={activeTab}
					handleTabClick={handleTabClick}
					handleLogout={handleLogout}
					navItems={navItems}
					showMobileMenu={showMobileMenu}
					setShowMobileMenu={setShowMobileMenu}
				/>

				<div className="flex-1 flex flex-col min-w-0">
					{/* header */}
					<Header
						showMobileMenu={showMobileMenu}
						setShowMobileMenu={setShowMobileMenu}
						showNotifications={showNotifications}
						setShowNotifications={setShowNotifications}
						showProfileMenu={showProfileMenu}
						setShowProfileMenu={setShowProfileMenu}
						unreadCount={unreadCount}
						mockNotifications={mockNotifications}
						handleLogout={handleLogout}
						userData={userData}
					/>

					{/* Main content area */}
					<main
						id="main-content"
						ref={mainRef}
						tabIndex={-1}
						aria-live="polite"
						aria-label={`${
							TAB_MAP[activeTab] ?? "Dashboard"
						} content`}
						className="overflow-auto p-6 w-full"
					>
						<motion.div
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
