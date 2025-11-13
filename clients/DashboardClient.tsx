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

import { RecentItems, UserData } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api.config";
import Dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { toastError } from "@/utils/toast";
import { useApiLoading } from "@/hooks/useApiLoading";
import { useConfirm } from "@/ui/ConfirmProvider";
import { AllItem } from "@/types/types";
import Pusher from "pusher-js";

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
	const [userID, setUserID] = useState<string | null>(null);
	const [userItems, setUserItems] = useState([]);
	const [allItems, setAllItems] = useState<AllItem[]>([]);
	const [paginationMeta, setPaginationMeta] = useState<{
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	} | null>(null);
	const [recentItems, setRecentItems] = useState<RecentItems[]>([]);
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
			setUserID(data.data._id);
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
				images: item.photos.map((photo: any) => photo.url),
				category: item.category,
			}));

			setUserItems(mappedItems);
			fetchPaginatedItems(1, 10);
		} catch (error) {
			console.error("Error fetching user items:", error);
		}
	};

	const fetchRecentItems = async (page = 1, limit = 4) => {
		try {
			const response = await api(
				`/api/dashboard/items?page=${page}&limit=${limit}`
			);
			if (response.status !== 200) {
				toastError("Server Error", "Unable to fetch recent items.");
				return;
			}
			const data = await response.json();
			const mappedItems = data.items.map((item: any) => ({
				id: item._id,
				title: item.name,
				description: item.description,
				type: item.type,
				location: item.location,
				date: item.date_lost_or_found,
				status: item.status,
				image_url: item.photos.length > 0 ? item.photos[0].url : null,
			}));
			setRecentItems(mappedItems);
		} catch (error) {
			console.error("Error fetching recent items:", error);
		}
	};

	const fetchPaginatedItems = async (
		page: number,
		limit: number,
		append = false,
		filters?: {
			searchQuery?: string;
			type?: "all" | "lost" | "found";
			status?: "all" | "active" | "claimed";
			category?: string;
			location?: string;
		}
	) => {
		try {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
			});

			if (filters?.searchQuery)
				params.set("searchQuery", filters.searchQuery);
			if (filters?.type && filters.type !== "all")
				params.set("type", filters.type);
			if (filters?.status && filters.status !== "all")
				params.set("status", filters.status);
			if (filters?.category && filters.category !== "all")
				params.set("category", filters.category);
			if (filters?.location && filters.location !== "all")
				params.set("location", filters.location);

			const response = await withLoading(() =>
				api(`/api/dashboard/items?${params.toString()}`)
			);
			if (response.status !== 200) {
				toastError("Server Error", "Unable to fetch items.");
				return;
			}
			const data = await response.json();

			const mappedItems = (data.items || []).map((item: any) => ({
				...item,
				id: item._id,
				category: item.category,
				claimed_at: item.claimed_at,
				claimed_by: item.claimed_by,
				created_at: item.created_at,
				date_lost_or_found: item.date_lost_or_found,
				description: item.description,
				location: item.location,
				matched: item.matched,
				name: item.name,
				photos: item.photos,
				status: item.status,
				type: item.type,
				updated_at: item.updated_at,
				user_id: {
					id: item.user_id._id,
					firstname: item.user_id.firstname,
					lastname: item.user_id.lastname,
					username: item.user_id.username,
					photo: item.user_id.photo,
				},
				views: item.views,
			}));

			setAllItems((prev) =>
				append ? [...prev, ...mappedItems] : mappedItems
			);

			if (data.meta) {
				setPaginationMeta(data.meta);
			}

			return data.meta;
		} catch (error) {
			console.error("Error fetching items:", error);
		}
	};

	const componentMap: Record<string, React.ReactNode> = {
		dashboard: (
			<HomeComponent
				userFullName={userData.firstname + " " + userData.lastname}
				recentItems={recentItems}
			/>
		),
		"new-item": <NewItemComponent onUpdate={fetchUserItems} />,
		"search-items": (
			<SearchItemsComponent
				allItems={allItems}
				userID={userID}
				paginationMeta={paginationMeta}
				onPageChange={fetchPaginatedItems}
			/>
		),
		"my-items": (
			<MyItemsComponent userItems={userItems} onUpdate={fetchUserItems} />
		),
		messages: <MessagesComponent userID={userID} />,
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

	const [unreadMessageCount, setUnreadMessageCount] = useState(0);
	const [notifications, setNotifications] = useState<
		{
			id: string;
			title: string;
			message: string;
			time: string;
			isRead: boolean;
			conversationId?: string;
		}[]
	>([]);
	const pusherRef = useRef<Pusher | null>(null);

	const unreadCount = notifications.filter(
		(notification) => !notification.isRead
	).length + unreadMessageCount;

	// Fetch unread message count
	const fetchUnreadCount = async () => {
		if (!userID) return;
		try {
			const response = await api("/api/messages/unread-count");
			if (response.status === 200) {
				const data = await response.json();
				const count = data.unreadCount || 0;
				setUnreadMessageCount(count);
				console.log("Unread message count updated:", count);
			}
		} catch (error) {
			console.error("Error fetching unread count:", error);
		}
	};

	// Fetch notifications
	const fetchNotifications = async () => {
		if (!userID) return;
		try {
			const response = await api("/api/notifications");
			if (response.status === 200) {
				const data = await response.json();
				setNotifications(data.notifications || []);
			}
		} catch (error) {
			console.error("Error fetching notifications:", error);
		}
	};

	// Initialize Pusher and listen for real-time updates
	useEffect(() => {
		if (!userID) return;

		// Initial fetch
		fetchUnreadCount();
		fetchNotifications();

		// Initialize Pusher for real-time updates
		const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
		const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2";

		if (pusherKey) {
			const pusher = new Pusher(pusherKey, {
				cluster: pusherCluster,
				authEndpoint: "/api/pusher/auth",
			});

			pusherRef.current = pusher;

			// Subscribe to user-specific channel
			const userChannel = pusher.subscribe(`private-user-${userID}`);

			// Listen for unread count updates
			userChannel.bind("unread-count-updated", () => {
				console.log("Pusher: unread-count-updated event received");
				fetchUnreadCount();
			});

			// Listen for new notifications
			userChannel.bind("new-notification", (data: { notification: any }) => {
				const newNotification = {
					id: data.notification.id,
					title: data.notification.title,
					message: data.notification.message,
					time: data.notification.time || new Date().toLocaleTimeString("en-US", {
						hour: "2-digit",
						minute: "2-digit",
						hour12: false,
					}),
					isRead: data.notification.isRead || false,
					conversationId: data.notification.conversationId || null,
				};
				setNotifications((prev) => {
					// Check if notification already exists
					if (prev.some((n) => n.id === newNotification.id)) {
						return prev;
					}
					// Add new notification at the beginning
					return [newNotification, ...prev];
				});
				// Also update unread count
				fetchUnreadCount();
			});

			// Listen for conversation updates (which may affect unread count)
			userChannel.bind("conversation-updated", () => {
				console.log("Pusher: conversation-updated event received");
				fetchUnreadCount();
				fetchNotifications();
			});

			// Also listen for custom events from MessagesComponent (as backup)
			const handleUnreadCountUpdate = () => {
				fetchUnreadCount();
				fetchNotifications();
			};

			const handleNotificationUpdate = (event: any) => {
				// If we have notification data from Pusher, add it immediately
				if (event.detail) {
					const newNotification = {
						id: event.detail.id,
						title: event.detail.title,
						message: event.detail.message,
						time: event.detail.time || new Date().toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: false,
						}),
						isRead: event.detail.isRead || false,
						conversationId: event.detail.conversationId || null,
					};
					setNotifications((prev) => {
						// Check if notification already exists
						if (prev.some((n) => n.id === newNotification.id)) {
							return prev;
						}
						// Add new notification at the beginning
						return [newNotification, ...prev];
					});
				}
				// Also fetch from server to ensure we have the latest
				fetchNotifications();
			};

			window.addEventListener("unreadCountUpdate", handleUnreadCountUpdate);
			window.addEventListener("notificationUpdate", handleNotificationUpdate);

			// Cleanup
			return () => {
				userChannel.unbind("unread-count-updated");
				userChannel.unbind("new-notification");
				userChannel.unbind("conversation-updated");
				window.removeEventListener("unreadCountUpdate", handleUnreadCountUpdate);
				window.removeEventListener("notificationUpdate", handleNotificationUpdate);
				pusher.disconnect();
			};
		} else {
			// If Pusher is not available, still listen for custom events
			const handleUnreadCountUpdate = () => {
				fetchUnreadCount();
				fetchNotifications();
			};

			const handleNotificationUpdate = (event: any) => {
				if (event.detail) {
					const newNotification = {
						id: event.detail.id,
						title: event.detail.title,
						message: event.detail.message,
						time: event.detail.time || new Date().toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: false,
						}),
						isRead: event.detail.isRead || false,
						conversationId: event.detail.conversationId || null,
					};
					setNotifications((prev) => {
						if (prev.some((n) => n.id === newNotification.id)) {
							return prev;
						}
						return [newNotification, ...prev];
					});
				}
				fetchNotifications();
			};

			window.addEventListener("unreadCountUpdate", handleUnreadCountUpdate);
			window.addEventListener("notificationUpdate", handleNotificationUpdate);

			return () => {
				window.removeEventListener("unreadCountUpdate", handleUnreadCountUpdate);
				window.removeEventListener("notificationUpdate", handleNotificationUpdate);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userID]);

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
				Promise.all([
					fetchUserData(),
					fetchUserItems(),
					fetchPaginatedItems(1, 10),
					fetchRecentItems(),
					fetchUnreadCount(),
					fetchNotifications(),
				])
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
					unreadMessageCount={unreadMessageCount}
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
						mockNotifications={notifications}
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
