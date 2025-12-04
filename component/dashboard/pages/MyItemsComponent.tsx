"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dayjs from "dayjs";
import {
	Package,
	Eye,
	MessageSquare,
	MoreVertical,
	Edit,
	Trash2,
	AlertCircle,
	CheckCircle2,
	TrendingUp,
	PackagePlus,
	Search,
} from "lucide-react";
import Image from "next/image";
import { MyItem, ItemStatus } from "@/types/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { useConfirm } from "@/ui/ConfirmProvider";
import ItemForm from "./MyItems/ItemForm";
import { api } from "@/lib/api.config";
import { toastError, toastSuccess } from "@/utils/toast";
import { useApiLoading } from "@/hooks/useApiLoading";

// Status color utility
const getStatusColors = (status: ItemStatus) => {
	const colors: Record<
		ItemStatus,
		{ bg: string; text: string; dot: string }
	> = {
		pending: {
			bg: "bg-yellow-100 dark:bg-yellow-900/40",
			text: "text-yellow-700 dark:text-yellow-300",
			dot: "bg-yellow-500",
		},
		active: {
			bg: "bg-green-100 dark:bg-green-900/40",
			text: "text-green-700 dark:text-green-300",
			dot: "bg-green-500",
		},
		claimed: {
			bg: "bg-blue-100 dark:bg-blue-900/40",
			text: "text-blue-700 dark:text-blue-300",
			dot: "bg-blue-500",
		},
		rejected: {
			bg: "bg-red-100 dark:bg-red-900/40",
			text: "text-red-700 dark:text-red-300",
			dot: "bg-red-500",
		},
		removed: {
			bg: "bg-gray-100 dark:bg-gray-700",
			text: "text-gray-700 dark:text-gray-300",
			dot: "bg-gray-500",
		},
	};
	return colors[status] || colors.removed;
};

const StatusBadge = ({ status }: { status: ItemStatus }) => {
	const colors = getStatusColors(status);
	return (
		<span
			className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${colors.bg} ${colors.text}`}
		>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</span>
	);
};

interface MyItemsComponentProps {
	userItems?: MyItem[];
	onUpdate?: () => void;
}

export default function MyItemsComponent({
	userItems,
	onUpdate,
}: MyItemsComponentProps) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const { withLoading } = useApiLoading();
	const confirm = useConfirm();
	const [isUpdating, setIsUpdating] = useState(false);
	const [items, setItems] = useState<MyItem[]>([]);
	const [filterTab, setFilterTab] = useState<"all" | "lost" | "found">("all");
	const [activeMenu, setActiveMenu] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [editingItem, setEditingItem] = useState<MyItem | null>(null);

	useEffect(() => {
		const editId = searchParams.get("edit");
		if (!editId) return;
		if (!items || items.length === 0) return;
		const match = items.find((it) => it.id === editId);
		if (match) {
			setEditingItem(match);
			setActiveMenu(null);
		}
	}, [searchParams, items]);

	useEffect(() => {
		setItems(userItems || []);
	}, [userItems]);

	const visibleItems = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();

		return (items || [])
			.filter((item) =>
				filterTab === "all" ? true : item.type === filterTab
			)
			.filter((item) => {
				if (!q) return true;
				return (
					(item.title ?? "").toLowerCase().includes(q) ||
					(item.description ?? "").toLowerCase().includes(q) ||
					(item.location ?? "").toLowerCase().includes(q)
				);
			})
			.sort((a, b) => {
				const ta = a.dateReported ? dayjs(a.dateReported).valueOf() : 0;
				const tb = b.dateReported ? dayjs(b.dateReported).valueOf() : 0;
				return tb - ta;
			});
	}, [items, filterTab, searchQuery]);

	const stats = {
		total: items.length,
		lost: items.filter((i) => i.type === "lost").length,
		found: items.filter((i) => i.type === "found").length,
		active: items.filter((i) => i.status === "active").length,
	};

	const handleDelete = async (id: string) => {
		try {
			const ok = await confirm({
				title: "Confirm Deletion",
				description: "Are you sure you want to delete this item?",
				variant: "danger",
				cancelText: "Cancel",
				confirmText: "Delete",
			});

			if (!ok) return;
			const response = await withLoading(() =>
				api(`/api/items/${id}`, {
					method: "DELETE",
				})
			);
			if (response.status !== 200) {
				toastError("Failed to delete item.", "Please try again later.");
				return;
			}
			toastSuccess(
				"Item deleted successfully.",
				"The item has been removed from your list."
			);
			onUpdate?.();
		} catch (error) {
			console.error("Error deleting item:", error);
		}
	};

	const handleEdit = (item: MyItem) => {
		setEditingItem(item);
		setActiveMenu(null);
	};

	const handleUpdate = async (formData: FormData) => {
		if (isUpdating) return;
		try {
			setIsUpdating(true);
			const response = await withLoading(() =>
				api(`/api/items/${editingItem?.id}`, {
					method: "PUT",
					body: formData,
				})
			);
			if (response.status !== 200) {
				toastError("Failed to update item.", "Please try again later.");
				return;
			}
			toastSuccess(
				"Item updated successfully.",
				"Your changes have been saved."
			);
			onUpdate?.();
			setEditingItem(null);
		} catch (error) {
			console.error("Error updating item:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleCloseForm = () => {
		setEditingItem(null);
		if (!searchParams.get("edit")) return;
		try {
			router.replace(`${pathname}?tab=my-items`);
		} catch {
			router.replace("/dashboard?tab=my-items");
		}
	};

	return (
		<div className="space-y-6">
			{/* Edit Form Modal */}
			{editingItem && (
				<div className="z-50">
					<ItemForm
						item={editingItem}
						onClose={handleCloseForm}
						handleUpdate={handleUpdate}
					/>
				</div>
			)}

			{/* Header */}
			<section
				aria-labelledby="my-items-heading"
				className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start"
			>
				<div>
					<h1
						id="my-items-heading"
						className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
					>
						My Items
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage your posted lost and found items
					</p>
				</div>

				<div>
					{/* Report Lost Item Button */}
					<div className="flex justify-center sm:justify-start">
						<Link
							href="/dashboard?tab=new-item"
							className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 flex items-center gap-2"
							aria-label="Report a lost item"
						>
							<PackagePlus size={20} aria-hidden="true" />
							Report Lost Item
						</Link>
					</div>
				</div>
			</section>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-4">
					<div className="flex items-center justify-between mb-2">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Total Items
						</p>
						<Package
							size={18}
							className="text-gray-400 dark:text-gray-500"
							aria-hidden="true"
						/>
					</div>
					<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{stats.total}
					</p>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-4">
					<div className="flex items-center justify-between mb-2">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Lost Items
						</p>
						<AlertCircle
							size={18}
							className="text-red-500 dark:text-red-400"
							aria-hidden="true"
						/>
					</div>
					<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{stats.lost}
					</p>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-4">
					<div className="flex items-center justify-between mb-2">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Found Items
						</p>
						<CheckCircle2
							size={18}
							className="text-green-500 dark:text-green-400"
							aria-hidden="true"
						/>
					</div>
					<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{stats.found}
					</p>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-4">
					<div className="flex items-center justify-between mb-2">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Active
						</p>
						<TrendingUp
							size={18}
							className="text-emerald-500 dark:text-emerald-400"
							aria-hidden="true"
						/>
					</div>
					<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{stats.active}
					</p>
				</div>
			</div>

			{/* Filter Tabs */}
			<div
				className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch"
				role="tablist"
				aria-label="Filter items"
			>
				{/* search */}
				<div className="relative w-full flex-1">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search items..."
						className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700  rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
					/>
					<span className="absolute inset-y-0 left-0 flex items-center pl-3">
						<Search
							size={20}
							className="text-gray-400 dark:text-gray-500"
						/>
					</span>
				</div>

				<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-1 inline-flex max-sm:w-full max-sm:flex-wrap max-sm:gap-2">
					<button
						type="button"
						role="tab"
						aria-selected={filterTab === "all"}
						aria-controls="items-panel"
						onClick={() => setFilterTab("all")}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 max-sm:flex-1 max-sm:text-center ${
							filterTab === "all"
								? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
					>
						All Items
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={filterTab === "lost"}
						aria-controls="items-panel"
						onClick={() => setFilterTab("lost")}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 max-sm:flex-1 max-sm:text-center ${
							filterTab === "lost"
								? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
					>
						Lost
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={filterTab === "found"}
						aria-controls="items-panel"
						onClick={() => setFilterTab("found")}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 max-sm:flex-1 max-sm:text-center ${
							filterTab === "found"
								? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
					>
						Found
					</button>
				</div>
			</div>

			{/* Items List */}
			<section
				id="items-panel"
				role="tabpanel"
				aria-labelledby="my-items-heading"
			>
				{visibleItems.length > 0 ? (
					<div className="space-y-4">
						{visibleItems.map((item) => (
							<article
								key={item.id}
								className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow"
							>
								<div className="flex flex-col sm:flex-row gap-4 p-4 max-sm:p-3">
									{/* Image */}
									<div className="relative w-full sm:w-32 h-32 max-sm:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
										<Image
											src={
												item.image_url ||
												"https://images.unsplash.com/photo-1654965778976-409444e9826b?w=400"
											}
											alt={item.title}
											fill
											className="object-cover"
											sizes="(max-width: 640px) 100vw, 128px"
										/>
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-4 mb-2">
											<div className="flex-1">
												<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
													{item.title}
												</h3>
												<div className="flex flex-wrap items-center gap-2 mb-2">
													<span
														className={`px-2 py-0.5 rounded-full text-xs font-medium ${
															item.type === "lost"
																? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
																: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
														}`}
													>
														{item.type === "lost"
															? "Lost"
															: "Found"}
													</span>
													<StatusBadge
														status={item.status}
													/>
												</div>
											</div>

											{/* Menu */}

											<div className="relative">
												<button
													type="button"
													onClick={() =>
														setActiveMenu(
															activeMenu ===
																item.id
																? null
																: item.id
														)
													}
													className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
													aria-label="Item actions"
													aria-haspopup="true"
													aria-expanded={
														activeMenu === item.id
													}
												>
													<MoreVertical
														size={20}
														className="text-gray-600 dark:text-gray-400"
														aria-hidden="true"
													/>
												</button>

												{activeMenu === item.id && (
													<motion.div
														initial={{
															opacity: 0,
															scale: 0.95,
														}}
														animate={{
															opacity: 1,
															scale: 1,
														}}
														transition={{
															duration: 0.15,
														}}
														exit={{
															opacity: 0,
															scale: 0.95,
														}}
														className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-10 py-1"
														role="menu"
													>
														{item.status !==
															"claimed" && (
															<button
																type="button"
																onClick={() =>
																	handleEdit(
																		item
																	)
																}
																className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
																role="menuitem"
															>
																<Edit
																	size={16}
																	aria-hidden="true"
																/>
																Edit Item
															</button>
														)}

														<button
															type="button"
															onClick={() =>
																handleDelete(
																	item.id
																)
															}
															className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
															role="menuitem"
														>
															<Trash2
																size={16}
																aria-hidden="true"
															/>
															Delete Item
														</button>
													</motion.div>
												)}
											</div>
										</div>{" "}
										<p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
											{item.description}
										</p>
										<div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
											<span>
												Location: {item.location}
											</span>
											<span>
												Posted:{" "}
												{item.dateReported
													? dayjs(
															item.dateReported
													  ).format("MMM D, YYYY")
													: "N/A"}
											</span>
										</div>
										{/* Stats */}
										<div className="flex items-center gap-4 max-sm:flex-wrap max-sm:gap-2">
											<div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
												<Eye
													size={16}
													aria-hidden="true"
												/>
												<span>{item.views} views</span>
											</div>
											<div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
												<MessageSquare
													size={16}
													aria-hidden="true"
												/>
												<span>
													{item.matchCount} matches
												</span>
											</div>
										</div>
									</div>
								</div>
							</article>
						))}
					</div>
				) : (
					<div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
						<div
							className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
							aria-hidden="true"
						>
							<Package
								size={32}
								className="text-gray-400 dark:text-gray-500"
							/>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
							No items yet
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Start by reporting a lost or found item
						</p>
					</div>
				)}
			</section>
		</div>
	);
}
