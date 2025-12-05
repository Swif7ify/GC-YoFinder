"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/ui/ConfirmProvider";
import { api, apiCached, invalidateCache } from "@/lib/api.config";
import { toastError, toastSuccess } from "@/utils/toast";
import { UserData } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { usePusher } from "@/contexts/PusherProvider";

// Lazy-loaded Header component:
// - Loaded on the client using `next/dynamic` to keep initial bundle small.
// - `ssr: false` ensures this renders only in the browser.
// - `loading` provides a skeleton while the component is fetched.
const Header = Dynamic(
	() =>
		import("@/component/admin/organisms/Header").then((mod) => mod.default),
	{
		ssr: false,
		loading: () => (
			<div className="h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 animate-pulse" />
		),
	}
);
// Lazy-loaded Sidebar component (client-only)
// Provides a lightweight skeleton while the full sidebar JS is downloaded.
const Sidebar = Dynamic(
	() =>
		import("@/component/admin/organisms/Sidebar").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => (
			<div className="w-64 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 animate-pulse" />
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

// Page components (lazy-loaded per route)
// Each page is loaded on-demand to reduce initial payload. The
// `PageLoadingSkeleton` provides a consistent placeholder while
// the real component is fetched.
// Use `ssr: false` because these are client-only interactive pages.
// Page components
const DashboardPage = Dynamic(
	() =>
		import("@/component/admin/pages/DashboardPage").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => <PageLoadingSkeleton />,
	}
);
const UsersPage = Dynamic(
	() =>
		import("@/component/admin/pages/UsersPage").then((mod) => mod.default),
	{ ssr: false, loading: () => <PageLoadingSkeleton /> }
);
const ItemPendingPage = Dynamic(
	() =>
		import("@/component/admin/pages/ItemPendingPage").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => <PageLoadingSkeleton />,
	}
);
const ItemActivePage = Dynamic(
	() =>
		import("@/component/admin/pages/ItemActivePage").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => <PageLoadingSkeleton />,
	}
);
const ItemClaimedPage = Dynamic(
	() =>
		import("@/component/admin/pages/ItemClaimedPage").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => <PageLoadingSkeleton />,
	}
);
const ItemArchivedPage = Dynamic(
	() =>
		import("@/component/admin/pages/ItemArchivedPage").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => <PageLoadingSkeleton />,
	}
);
const ReportsPage = Dynamic(
	() =>
		import("@/component/admin/pages/ReportsPage").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => <PageLoadingSkeleton />,
	}
);
const ActivityPage = Dynamic(
	() =>
		import("@/component/admin/pages/ActivityPage").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => <PageLoadingSkeleton />,
	}
);
const ExportPage = Dynamic(
	() =>
		import("@/component/admin/pages/ExportPage").then((mod) => mod.default),
	{
		ssr: false,
		loading: () => <PageLoadingSkeleton />,
	}
);
const ItemAllPage = Dynamic(
	() =>
		import("@/component/admin/pages/ItemAllPage").then(
			(mod) => mod.default
		),
	{
		ssr: false,
		loading: () => <PageLoadingSkeleton />,
	}
);

const TAB_MAP: Record<string, string> = {
	dashboard: "Dashboard",
	users: "User Management",
	"item-all": "All Items",
	"item-pending": "Pending Review",
	"item-active": "Active Listings",
	"item-claimed": "Claimed Items",
	"item-archived": "Archived Items",
	reports: "Reports & Analytics",
	activity: "Activity Logs",
	export: "Data Export",
};

export default function AdminClient() {
	const router = useRouter();
	const confirm = useConfirm();
	const searchParams = useSearchParams();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const initialTab = searchParams.get("tab") || "dashboard";
	const [activeTab, setActiveTab] = useState(initialTab);
	const mainRef = useRef<HTMLElement | null>(null);

	// Admin data state
	const [adminData, setAdminData] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);

	// Notifications state
	const [notifications, setNotifications] = useState<
		{
			id: string;
			title: string;
			message: string;
			time: string;
			isRead: boolean;
			type: string;
			conversationId?: string;
		}[]
	>([]);

	// Dashboard stats state
	const [dashboardStats, setDashboardStats] = useState<any>(null);

	// Items state
	const [pendingItems, setPendingItems] = useState<any[]>([]);
	const [rejectedItems, setRejectedItems] = useState<any[]>([]);
	const [activeItems, setActiveItems] = useState<any[]>([]);
	const [claimedItems, setClaimedItems] = useState<any[]>([]);
	const [archivedItems, setArchivedItems] = useState<any[]>([]);

	// Combined items for review page (pending + rejected)
	const reviewItems = [...pendingItems, ...rejectedItems];

	// Users state
	const [users, setUsers] = useState<any[]>([]);
	const [usersPagination, setUsersPagination] = useState<any>(null);

	const handleMenuClick = () => {
		setSidebarOpen(!sidebarOpen);
	};

	useEffect(() => {
		const applyInitialSidebarState = () => {
			if (typeof window !== "undefined") {
				const isMobile = window.innerWidth < 768;
				if (isMobile) setSidebarOpen(false);
			}
		};
		applyInitialSidebarState();
		const onResize = () => {
			if (typeof window !== "undefined") {
				const isMobile = window.innerWidth < 768;
				if (isMobile) {
					setSidebarOpen(false);
				}
			}
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
		router.push(`/dashboard-admin?tab=${tab}`, { scroll: false });
	};

	useEffect(() => {
		setActiveTab(initialTab);
	}, [initialTab]);

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

	// Fetch admin user data
	// Strategy:
	// - Use `apiCached` to provide a simple in-memory cache for fast UI loads.
	// - `useCache` param controls whether to return a cached response or hit network.
	// - Consumers should call `fetchAdminData(false)` after mutations to force refresh.
	const fetchAdminData = async (useCache = true) => {
		try {
			const response = await apiCached(
				"/api/admin/user",
				{
					method: "GET",
				},
				useCache
			);

			if (response.status !== 200) {
				toastError("Server Error", "Unable to fetch admin data.");
				return;
			}

			const data = await response.json();
			setAdminData(data.data);
		} catch (error) {
			console.error("Error fetching admin data:", error);
			toastError("Error", "Failed to fetch admin data.");
		}
	};

	// Fetch notifications
	// Strategy:
	// - Leverages `apiCached` so repeated dashboard visits are snappy.
	// - `useCache=false` can be passed to retrieve fresh notifications after changes.
	const fetchNotifications = async (useCache = true) => {
		try {
			const response = await apiCached(
				"/api/notifications",
				{
					method: "GET",
				},
				useCache
			);

			if (response.status !== 200) {
				console.error("Unable to fetch notifications");
				return;
			}

			const data = await response.json();
			setNotifications(data.notifications || []);
		} catch (error) {
			console.error("Error fetching notifications:", error);
		}
	};

	// Mark all notifications as read
	const markAllNotificationsAsRead = async () => {
		try {
			invalidateCache(/\/api\/notifications/);

			const response = await api("/api/notifications", {
				method: "PUT",
			});

			if (response.status === 200) {
				// Update local state
				setNotifications((prev) =>
					prev.map((notif) => ({ ...notif, isRead: true }))
				);
			}
		} catch (error) {
			console.error("Error marking notifications as read:", error);
		}
	};

	// Fetch dashboard stats
	// Strategy:
	// - Uses `apiCached` for quick loads and reduced network traffic.
	// - Call with `useCache=false` when stats may be stale (e.g., after bulk updates).
	const fetchDashboardStats = async (useCache = true) => {
		try {
			const response = await apiCached(
				"/api/admin/dashboard/stats",
				{ method: "GET" },
				useCache
			);

			if (response.status !== 200) {
				console.error("Unable to fetch dashboard stats");
				return;
			}

			const data = await response.json();
			setDashboardStats(data.data);
		} catch (error) {
			console.error("Error fetching dashboard stats:", error);
		}
	};

	// Fetch items by status
	// Strategy:
	// - Uses `apiCached` with `status` and `limit` encoded into the cache key.
	// - `useCache=false` should be used after mutating item state so the admin
	//   UI reflects changes immediately.
	const fetchItems = async (status: string, useCache = true) => {
		try {
			const response = await apiCached(
				`/api/admin/items?status=${status}&limit=50`,
				{ method: "GET" },
				useCache
			);

			if (response.status !== 200) {
				console.error(`Unable to fetch ${status} items`);
				return;
			}

			const data = await response.json();

			if (status === "pending") setPendingItems(data.items || []);
			else if (status === "rejected") setRejectedItems(data.items || []);
			else if (status === "active") setActiveItems(data.items || []);
			else if (status === "claimed") setClaimedItems(data.items || []);
			else if (status === "removed") setArchivedItems(data.items || []);
		} catch (error) {
			console.error(`Error fetching ${status} items:`, error);
		}
	};

	// Fetch users (paginated)
	// Strategy:
	// - Uses `apiCached` for paginated user lists. Cache keys include the query
	//   string (page/search) so different pages are cached separately.
	// - Use `useCache=false` to force-refresh when user data changes.
	const fetchUsers = async (page = 1, search?: string, useCache = true) => {
		try {
			let url = `/api/admin/users?page=${page}&limit=10`;
			if (search) url += `&search=${encodeURIComponent(search)}`;

			const response = await apiCached(url, { method: "GET" }, useCache);

			if (response.status !== 200) {
				console.error("Unable to fetch users");
				return;
			}

			const data = await response.json();
			setUsers(data.users || []);
			setUsersPagination(data.pagination || null);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	// Update item status (approve/reject/pending/removed)
	const updateItemStatus = async (
		itemId: string,
		status: "active" | "rejected" | "pending" | "removed"
	) => {
		try {
			invalidateCache(/\/api\/admin/);

			const response = await api(`/api/admin/items/${itemId}/status`, {
				method: "PUT",
				body: JSON.stringify({ status }),
			});

			if (response.status === 200) {
				// Refresh all data
				await Promise.all([
					fetchDashboardStats(false),
					fetchItems("pending", false),
					fetchItems("rejected", false),
					fetchItems("active", false),
					fetchItems("claimed", false),
					fetchItems("removed", false),
				]);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error updating item status:", error);
			return false;
		}
	};

	// Archive item (set status to removed)
	const archiveItem = async (itemId: string) => {
		try {
			invalidateCache(/\/api\/admin/);

			const response = await api(`/api/admin/items/${itemId}/status`, {
				method: "PUT",
				body: JSON.stringify({ status: "removed" }),
			});

			if (response.status === 200) {
				// Refresh data
				await Promise.all([
					fetchDashboardStats(false),
					fetchItems("claimed", false),
					fetchItems("removed", false),
				]);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error archiving item:", error);
			return false;
		}
	};
	// Combine all items for the All Items page
	const allItems = [
		...pendingItems,
		...rejectedItems,
		...activeItems,
		...claimedItems,
		...archivedItems,
	];

	const componentMap: Record<string, React.ReactNode> = {
		dashboard: (
			<DashboardPage
				stats={dashboardStats}
				onRefresh={() => fetchDashboardStats(false)}
			/>
		),
		users: (
			<UsersPage
				users={users}
				pagination={usersPagination}
				onSearch={fetchUsers}
				onRefresh={() => fetchUsers(1, undefined, false)}
			/>
		),
		"item-all": (
			<ItemAllPage
				items={allItems}
				onUpdateStatus={updateItemStatus}
				onRefresh={() => {
					fetchItems("pending", false);
					fetchItems("rejected", false);
					fetchItems("active", false);
					fetchItems("claimed", false);
					fetchItems("removed", false);
				}}
			/>
		),
		"item-pending": (
			<ItemPendingPage
				items={reviewItems}
				onUpdateStatus={updateItemStatus}
				onRefresh={() => {
					fetchItems("pending", false);
					fetchItems("rejected", false);
				}}
			/>
		),
		"item-active": (
			<ItemActivePage
				items={activeItems}
				onRefresh={() => fetchItems("active", false)}
			/>
		),
		"item-claimed": (
			<ItemClaimedPage
				items={claimedItems}
				onRefresh={() => fetchItems("claimed", false)}
				onArchive={archiveItem}
			/>
		),
		"item-archived": (
			<ItemArchivedPage
				items={archivedItems}
				onRefresh={() => fetchItems("removed", false)}
			/>
		),
		reports: <ReportsPage stats={dashboardStats} />,
		activity: <ActivityPage stats={dashboardStats} />,
		export: <ExportPage />,
	};

	const ActiveComponent = componentMap[activeTab];

	// Initialize data on component mount
	useEffect(() => {
		const initializeData = async () => {
			setLoading(true);
			try {
				await Promise.all([
					fetchAdminData(),
					fetchNotifications(),
					fetchDashboardStats(),
					fetchItems("pending"),
					fetchItems("rejected"),
					fetchItems("active"),
					fetchItems("claimed"),
					fetchItems("removed"),
					fetchUsers(),
				]);
			} finally {
				setLoading(false);
			}
		};
		initializeData();
	}, []);

	// Use global Pusher context
	const { subscribe, isConnected } = usePusher();

	// Refresh functions wrapped in useCallback for Pusher events
	const refreshAllData = useCallback(() => {
		invalidateCache(/\/api\/admin/);
		fetchDashboardStats(false);
		fetchItems("pending", false);
		fetchItems("rejected", false);
		fetchItems("active", false);
		fetchItems("claimed", false);
		fetchItems("removed", false);
	}, []);

	// Setup Pusher for real-time updates
	useEffect(() => {
		if (!isConnected) return;

		// Subscribe to admin updates channel
		const adminChannel = subscribe("admin-updates");
		if (!adminChannel) return;

		// Listen for item status changes
		const handleItemStatusChanged = () => {
			refreshAllData();
		};
		adminChannel.bind("item-status-changed", handleItemStatusChanged);

		// Listen for new items
		const handleNewItem = () => {
			invalidateCache(/\/api\/admin/);
			fetchDashboardStats(false);
			fetchItems("pending", false);
			toastSuccess(
				"New Item",
				"A new item has been submitted for review"
			);
		};
		adminChannel.bind("new-item", handleNewItem);

		// Listen for item deletions
		const handleItemDeleted = () => {
			refreshAllData();
		};
		adminChannel.bind("item-deleted", handleItemDeleted);

		return () => {
			adminChannel.unbind("item-status-changed", handleItemStatusChanged);
			adminChannel.unbind("new-item", handleNewItem);
			adminChannel.unbind("item-deleted", handleItemDeleted);
		};
	}, [isConnected, subscribe, refreshAllData]);

	return (
		<div className="h-screen overflow-hidden bg-gray-50 dark:bg-black">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white/95 dark:bg-neutral-900/80 p-2 rounded"
			>
				Skip to main content
			</a>
			<div className="flex flex-row h-full">
				<div className="flex flex-nowrap">
					<Sidebar
						isOpen={sidebarOpen}
						activeTab={activeTab}
						pendingCount={pendingItems.length}
						onTabClick={handleTabClick}
						onLogout={handleLogout}
						onClose={() => setSidebarOpen(false)}
					/>
				</div>
				<div
					className={`flex-1 flex flex-col w-full transition-all duration-300`}
				>
					<Header
						onMenuClick={handleMenuClick}
						adminData={adminData}
						notifications={notifications}
						onLogout={handleLogout}
						onMarkAllRead={markAllNotificationsAsRead}
					/>

					<main
						id="main-content"
						ref={mainRef}
						tabIndex={-1}
						aria-live="polite"
						aria-label={`${
							TAB_MAP[activeTab] ?? "Dashboard"
						} content`}
						className="min-w-0 overflow-auto p-6 max-sm:p-2 "
					>
						{loading ? (
							<div className="flex items-center justify-center h-64">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
							</div>
						) : (
							<motion.div
								key={activeTab}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								{ActiveComponent || "Component not found."}
							</motion.div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
