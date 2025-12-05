"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	LayoutDashboardIcon,
	SearchIcon,
	MessageSquareIcon,
	PackagePlusIcon,
	PackageCheckIcon,
	SettingsIcon,
} from "lucide-react";

import { RecentItems, UserData } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { api, apiCached, invalidateCache } from "@/lib/api.config";
import Dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { toastError, toastSuccess } from "@/utils/toast";
import { useApiLoading } from "@/hooks/useApiLoading";
import { useConfirm } from "@/ui/ConfirmProvider";
import { AllItem } from "@/types/types";
import { usePusher } from "@/contexts/PusherProvider";

// Lazy-loaded Sidebar component (client-only)
// - Dynamically imported with `next/dynamic` to keep initial HTML lightweight.
// - `loading` shows a skeleton while the client bundle downloads.
const Sidebar = Dynamic(
	() =>
		import("@/component/dashboard/organisms/Sidebar").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => (
			<div className="w-64 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 animate-pulse" />
		),
	}
);
// Lazy-loaded Header component (client-only)
// - Avoids shipping header JS on first paint; provides instant skeleton UI.
const Header = Dynamic(
	() =>
		import("@/component/dashboard/organisms/Header").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => (
			<div className="h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 animate-pulse" />
		),
	}
);

// Shared loading component for page content
const PageLoadingSkeleton = () => (
	<div className="space-y-6 animate-pulse">
		<div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded w-1/4" />
		<div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/2" />
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div className="h-32 bg-gray-200 dark:bg-neutral-800 rounded" />
			<div className="h-32 bg-gray-200 dark:bg-neutral-800 rounded" />
			<div className="h-32 bg-gray-200 dark:bg-neutral-800 rounded" />
		</div>
	</div>
);

// Lazy-loaded page components
// HomeComponent and other pages are loaded on-demand to reduce initial bundle size.
// They use a shared `PageLoadingSkeleton` so the layout doesn't shift while fetching.
const HomeComponent = Dynamic(
	() =>
		import("@/component/dashboard/pages/HomeComponent").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => <PageLoadingSkeleton />,
	}
);

const NewItemComponent = Dynamic(
	() =>
		import("@/component/dashboard/pages/NewItemComponent").then(
			(mod) => mod.default
		),
	{ ssr: false, loading: () => <PageLoadingSkeleton /> }
);

const SearchItemsComponent = Dynamic(
	() =>
		import("@/component/dashboard/pages/SearchItemsComponent").then(
			(mod) => mod.default
		),
	{ ssr: false, loading: () => <PageLoadingSkeleton /> }
);

const MyItemsComponent = Dynamic(
	() =>
		import("@/component/dashboard/pages/MyItemsComponent").then(
			(mod) => mod.default
		),
	{ ssr: false, loading: () => <PageLoadingSkeleton /> }
);

const MessagesComponent = Dynamic(
	() =>
		import("@/component/dashboard/pages/MessagesComponent").then(
			(mod) => mod.default
		),
	{ ssr: false, loading: () => <PageLoadingSkeleton /> }
);

const SettingsComponent = Dynamic(
	() =>
		import("@/component/dashboard/pages/SettingsComponent").then(
			(mod) => mod.default
		),
	{ ssr: false, loading: () => <PageLoadingSkeleton /> }
);

const TAB_MAP: Record<string, string> = {
	dashboard: "Dashboard",
	"new-item": "New Item",
	"search-items": "Search Items",
	"my-items": "My Items",
	messages: "Messages",
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
			name: "Settings",
			path: "/settings",
			icon: <SettingsIcon size={20} />,
		},
	];

	// Fetch user profile data
	// Strategy:
	// - Uses `apiCached` for a simple cache layer with a configurable `useCache` flag.
	// - Callers can set `useCache=false` to force a network refresh (e.g., after updates).
	// - Responses are written into local React state (`userData`) for reuse across the client.
	const fetchUserData = async (useCache = true) => {
		try {
			const response = await apiCached(
				"/api/dashboard/user",
				{
					method: "GET",
				},
				useCache
			);

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

	// Fetch items owned by the current user
	// Strategy:
	// - Calls `api` (non-cached) and then maps/normalizes server payload into UI-friendly shape.
	// - Invalidates dashboard items cache via `invalidateCache` so list views pick up new changes.
	// - Triggers `fetchPaginatedItems` to populate the public/paginated listing.
	const fetchUserItems = async () => {
		try {
			// Invalidate dashboard items cache when user items change
			invalidateCache(/\/api\/dashboard\/items/);

			const response = await api("/api/items");
			if (response.status !== 200) {
				toastError("Server Error", "Unable to fetch user items.");
				return;
			}
			const data = await response.json();
			const mappedItems = data.items.map((item: any) => {
				// Handle photos - could be array of objects with url or array of strings
				const photos = item.photos || [];
				const photoUrls = photos
					.map((photo: any) =>
						typeof photo === "string" ? photo : photo?.url
					)
					.filter(Boolean);

				return {
					...item,
					id: item._id || item.id,
					title: item.name,
					description: item.description,
					type: item.type,
					location: item.location,
					dateReported: item.date_lost_or_found,
					status: item.status,
					views: item.views || 0,
					matchCount: item.matched || 0,
					image_url: photoUrls.length > 0 ? photoUrls[0] : null,
					images: photoUrls,
					category: item.category,
				};
			});

			setUserItems(mappedItems);
			fetchPaginatedItems(1, 10);
		} catch (error) {
			console.error("Error fetching user items:", error);
		}
	};

	// Fetch a small page of recent items for the dashboard home
	// Strategy:
	// - Uses `apiCached` so repeated visits to the dashboard are fast.
	// - `useCache` parameter allows bypassing cache when called after a mutation.
	const fetchRecentItems = async (page = 1, limit = 4, useCache = true) => {
		try {
			const response = await apiCached(
				`/api/dashboard/items?page=${page}&limit=${limit}`,
				{},
				useCache
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

	// Fetch paginated items for search/list views
	// Strategy:
	// - Builds URLSearchParams from `page`, `limit`, and the provided `filters`.
	// - Uses `withLoading` wrapper to show a loader for user-triggered loads, but
	//   avoids showing a spinner when `showLoader` is false (useful for Pusher-triggered updates).
	// - Supports `append` to enable infinite-scroll style loading (appending to state).
	// - Maps/normalizes server response to a consistent client-side shape and updates `paginationMeta`.
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
		},
		showLoader = true
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

			// Only use withLoading for initial load, not for Pusher-triggered refreshes
			const response = showLoader
				? await withLoading(() =>
						api(`/api/dashboard/items?${params.toString()}`)
				  )
				: await api(`/api/dashboard/items?${params.toString()}`);
			if (response.status !== 200) {
				if (showLoader)
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
			type?: string;
		}[]
	>([]);

	// Use global Pusher context
	const { subscribe, isConnected } = usePusher();

	// Notification bell should only show unread notifications, not unread messages
	// Unread messages are shown separately in the sidebar badge
	const unreadCount = notifications.filter(
		(notification) => !notification.isRead
	).length;

	// Fetch unread message count
	const fetchUnreadCount = useCallback(async () => {
		if (!userID) return;
		try {
			const response = await api("/api/messages/unread-count");
			if (response.status === 200) {
				const data = await response.json();
				const count = data.unreadCount || 0;
				setUnreadMessageCount(count);
			}
		} catch (error) {
			console.error("Error fetching unread count:", error);
		}
	}, [userID]);

	// Fetch notifications
	const fetchNotifications = useCallback(async () => {
		if (!userID) return;
		try {
			const response = await api("/api/notifications");
			if (response.status === 200) {
				const data = await response.json();
				const prefs = {
					match:
						(localStorage.getItem("pref_matchAlerts") ?? "1") ===
						"1",
					message:
						(localStorage.getItem("pref_messageAlerts") ?? "1") ===
						"1",
				};
				const filtered = (data.notifications || []).filter((n: any) => {
					if (n.type === "match" && !prefs.match) return false;
					if (n.type === "message" && !prefs.message) return false;
					return true;
				});
				setNotifications(filtered);
			}
		} catch (error) {
			console.error("Error fetching notifications:", error);
		}
	}, [userID]);

	const refreshAllItems = useCallback(() => {
		invalidateCache(/\/api\/dashboard\/items/);
		fetchPaginatedItems(1, 10, false, undefined, false); // showLoader = false
		fetchRecentItems(1, 4, false);
	}, []);

	// Initialize Pusher and listen for real-time updates
	useEffect(() => {
		if (!userID || !isConnected) return;

		// Initial fetch
		fetchUnreadCount();
		fetchNotifications();

		// Subscribe to user-specific channel
		const userChannel = subscribe(`private-user-${userID}`);
		if (!userChannel) return;

		// Listen for unread count updates
		const handleUnreadCountUpdated = () => {
			fetchUnreadCount();
		};
		userChannel.bind("unread-count-updated", handleUnreadCountUpdated);

		// Listen for new notifications
		const handleNewNotification = (data: { notification: any }) => {
			const newNotification = {
				id: data.notification.id,
				title: data.notification.title,
				message: data.notification.message,
				time:
					data.notification.time ||
					new Date().toLocaleTimeString("en-US", {
						hour: "2-digit",
						minute: "2-digit",
						hour12: false,
					}),
				isRead: data.notification.isRead || false,
				conversationId: data.notification.conversationId || null,
				type: data.notification.type || undefined,
			};
			const allowMatch =
				(localStorage.getItem("pref_matchAlerts") ?? "1") === "1";
			const allowMessage =
				(localStorage.getItem("pref_messageAlerts") ?? "1") === "1";
			if (newNotification.type === "match" && !allowMatch) return;
			if (newNotification.type === "message" && !allowMessage) return;
			setNotifications((prev) => {
				if (prev.some((n) => n.id === newNotification.id)) {
					return prev;
				}
				return [newNotification, ...prev];
			});
			fetchUnreadCount();
		};
		userChannel.bind("new-notification", handleNewNotification);

		// Listen for conversation updates
		const handleConversationUpdated = () => {
			fetchUnreadCount();
			fetchNotifications();
		};
		userChannel.bind("conversation-updated", handleConversationUpdated);

		// Listen for item updates (status changes from admin)
		const handleItemUpdated = (data: any) => {
			invalidateCache(/\/api\/items/);
			invalidateCache(/\/api\/dashboard/);
			fetchUserItems();
			refreshAllItems();
			if (data?.status === "active") {
				toastSuccess(
					"Item Approved",
					"Your item has been approved and is now visible to others."
				);
			} else if (data?.status === "rejected") {
				toastError(
					"Item Rejected",
					"Your item has been rejected. Please review and resubmit."
				);
			}
		};
		userChannel.bind("item-updated", handleItemUpdated);

		// Listen for item created confirmation
		const handleItemCreated = () => {
			invalidateCache(/\/api\/items/);
			fetchUserItems();
		};
		userChannel.bind("item-created", handleItemCreated);

		// Listen for item deleted confirmation
		const handleItemDeleted = () => {
			invalidateCache(/\/api\/items/);
			invalidateCache(/\/api\/dashboard/);
			fetchUserItems();
			refreshAllItems();
		};
		userChannel.bind("item-deleted", handleItemDeleted);

		// Subscribe to global items channel for real-time updates from all users
		const globalChannel = subscribe("global-items");
		if (globalChannel) {
			// Listen for any item changes (visible to all)
			const handleGlobalItemUpdate = () => {
				refreshAllItems();
			};
			globalChannel.bind("item-approved", handleGlobalItemUpdate);
			globalChannel.bind("item-claimed", handleGlobalItemUpdate);
			globalChannel.bind("item-deleted", handleGlobalItemUpdate);
		}

		// Also listen for custom events from MessagesComponent (as backup)
		const handleWindowUnreadCountUpdate = () => {
			fetchUnreadCount();
			fetchNotifications();
		};

		const handleWindowNotificationUpdate = (event: any) => {
			if (event.detail) {
				const newNotification = {
					id: event.detail.id,
					title: event.detail.title,
					message: event.detail.message,
					time:
						event.detail.time ||
						new Date().toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: false,
						}),
					isRead: event.detail.isRead || false,
					conversationId: event.detail.conversationId || null,
					type: event.detail.type || undefined,
				};
				const allowMatch =
					(localStorage.getItem("pref_matchAlerts") ?? "1") === "1";
				const allowMessage =
					(localStorage.getItem("pref_messageAlerts") ?? "1") === "1";
				if (newNotification.type === "match" && !allowMatch) return;
				if (newNotification.type === "message" && !allowMessage) return;
				setNotifications((prev) => {
					if (prev.some((n) => n.id === newNotification.id)) {
						return prev;
					}
					return [newNotification, ...prev];
				});
			}
			fetchNotifications();
		};

		window.addEventListener(
			"unreadCountUpdate",
			handleWindowUnreadCountUpdate
		);
		window.addEventListener(
			"notificationUpdate",
			handleWindowNotificationUpdate
		);
		const handlePrefsChanged = () => {
			fetchNotifications();
		};
		window.addEventListener(
			"notificationPreferencesChanged",
			handlePrefsChanged
		);

		// Cleanup
		return () => {
			userChannel.unbind(
				"unread-count-updated",
				handleUnreadCountUpdated
			);
			userChannel.unbind("new-notification", handleNewNotification);
			userChannel.unbind(
				"conversation-updated",
				handleConversationUpdated
			);
			userChannel.unbind("item-updated", handleItemUpdated);
			userChannel.unbind("item-created", handleItemCreated);
			userChannel.unbind("item-deleted", handleItemDeleted);
			if (globalChannel) {
				globalChannel.unbind_all();
			}
			window.removeEventListener(
				"unreadCountUpdate",
				handleWindowUnreadCountUpdate
			);
			window.removeEventListener(
				"notificationUpdate",
				handleWindowNotificationUpdate
			);
			window.removeEventListener(
				"notificationPreferencesChanged",
				handlePrefsChanged
			);
		};
	}, [
		userID,
		isConnected,
		subscribe,
		fetchUnreadCount,
		fetchNotifications,
		refreshAllItems,
	]);

	// Fallback: Listen for custom events even without Pusher
	useEffect(() => {
		if (isConnected) return; // Skip if Pusher is connected

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
					time:
						event.detail.time ||
						new Date().toLocaleTimeString("en-US", {
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
			window.removeEventListener(
				"unreadCountUpdate",
				handleUnreadCountUpdate
			);
			window.removeEventListener(
				"notificationUpdate",
				handleNotificationUpdate
			);
		};
	}, [isConnected, fetchUnreadCount, fetchNotifications]);

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
						className="flex-1 min-h-0 overflow-auto p-6 max-sm:p-2 w-full"
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
