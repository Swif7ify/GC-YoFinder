"use client";

import React, { useState, useMemo } from "react";
import {
	CheckIcon,
	XIcon,
	EyeIcon,
	RefreshCwIcon,
	ClockIcon,
	MapPinIcon,
	CalendarIcon,
	UserIcon,
	ImageIcon,
	SearchIcon,
	RotateCcwIcon,
} from "lucide-react";
import Image from "next/image";

interface Item {
	_id: string;
	name: string;
	description: string;
	type: "lost" | "found";
	status: "pending" | "active" | "rejected" | "claimed" | "removed";
	category: string;
	location: string;
	date_lost_or_found: string;
	photos: { url: string }[];
	user_id: {
		_id: string;
		firstname: string;
		lastname: string;
		email: string;
		username: string;
	} | null;
	created_at: string;
}

type FilterTab = "all" | "pending" | "rejected";

// Status badge colors
const getStatusColors = (status: Item["status"]) => {
	const colors = {
		pending: {
			bg: "bg-yellow-100 dark:bg-yellow-900/30",
			text: "text-yellow-800 dark:text-yellow-300",
		},
		active: {
			bg: "bg-green-100 dark:bg-green-900/30",
			text: "text-green-800 dark:text-green-300",
		},
		rejected: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-300", dot: "bg-red-500" },
		claimed: {
			bg: "bg-blue-100 dark:bg-blue-900/30",
			text: "text-blue-800 dark:text-blue-300",
		},
		removed: { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-800 dark:text-gray-300", dot: "bg-gray-500" },
	};
	return colors[status] || colors.pending;
};

const StatusBadge = ({ status }: { status: Item["status"] }) => {
	const colors = getStatusColors(status);
	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
		>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</span>
	);
};

interface ItemPendingPageProps {
	items?: Item[];
	onUpdateStatus?: (itemId: string, status: "active" | "rejected" | "pending") => Promise<boolean>;
	onRefresh?: () => void;
}

export default function ItemPendingPage({ items = [], onUpdateStatus, onRefresh }: ItemPendingPageProps) {
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [processing, setProcessing] = useState<string | null>(null);
	const [filterTab, setFilterTab] = useState<FilterTab>("all");

	// Count items by status
	const counts = useMemo(
		() => ({
			all: items.filter((i) => i.status === "pending" || i.status === "rejected").length,
			pending: items.filter((i) => i.status === "pending").length,
			rejected: items.filter((i) => i.status === "rejected").length,
		}),
		[items]
	);

	const filteredItems = useMemo(() => {
		return items
			.filter((item) => {
				// Filter by tab
				if (filterTab === "pending") return item.status === "pending";
				if (filterTab === "rejected") return item.status === "rejected";
				return item.status === "pending" || item.status === "rejected"; // "all" shows pending + rejected
			})
			.filter(
				(item) =>
					item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.location.toLowerCase().includes(searchQuery.toLowerCase())
			);
	}, [items, filterTab, searchQuery]);

	const handleApprove = async (itemId: string) => {
		if (!onUpdateStatus) return;
		setProcessing(itemId);
		const success = await onUpdateStatus(itemId, "active");
		setProcessing(null);
		if (success && selectedItem?._id === itemId) {
			setSelectedItem(null);
		}
	};

	const handleReject = async (itemId: string) => {
		if (!onUpdateStatus) return;
		setProcessing(itemId);
		const success = await onUpdateStatus(itemId, "rejected");
		setProcessing(null);
		if (success && selectedItem?._id === itemId) {
			setSelectedItem(null);
		}
	};

	const handleRestoreToPending = async (itemId: string) => {
		if (!onUpdateStatus) return;
		setProcessing(itemId);
		const success = await onUpdateStatus(itemId, "pending");
		setProcessing(null);
		if (success && selectedItem?._id === itemId) {
			setSelectedItem(null);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Item Review</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">Review and manage submitted items</p>
				</div>
				<button
					onClick={onRefresh}
					className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
				>
					<RefreshCwIcon size={16} />
					Refresh
				</button>
			</div>

			{/* Filter Tabs */}
			<div className="flex items-center gap-4 flex-wrap">
				<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-1 inline-flex">
					<button
						type="button"
						onClick={() => setFilterTab("all")}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							filterTab === "all"
								? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
					>
						All ({counts.all})
					</button>
					<button
						type="button"
						onClick={() => setFilterTab("pending")}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							filterTab === "pending"
								? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
					>
						Pending ({counts.pending})
					</button>
					<button
						type="button"
						onClick={() => setFilterTab("rejected")}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							filterTab === "rejected"
								? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
								: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
						}`}
					>
						Rejected ({counts.rejected})
					</button>
				</div>

				{/* Search */}
				<div className="relative flex-1 min-w-[200px]">
					<SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search items..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Items List */}
				<div className="lg:col-span-2 space-y-4">
					{filteredItems.length === 0 ? (
						<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
							<ClockIcon size={48} className="mx-auto text-gray-400 mb-4" />
							<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No pending items</h3>
							<p className="text-gray-500 dark:text-gray-400 mt-1">All items have been reviewed</p>
						</div>
					) : (
						filteredItems.map((item) => (
							<div
								key={item._id}
								className={`bg-white dark:bg-neutral-900 rounded-xl border ${
									selectedItem?._id === item._id
										? "border-emerald-500 ring-2 ring-emerald-500/20"
										: "border-gray-200 dark:border-neutral-800"
								} p-4 cursor-pointer hover:shadow-md transition-all`}
								onClick={() => setSelectedItem(item)}
							>
								<div className="flex items-start gap-4">
									{/* Image */}
									<div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
										{item.photos && item.photos.length > 0 ? (
											<Image
												src={item.photos[0].url}
												alt={item.name}
												width={80}
												height={80}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<ImageIcon size={24} className="text-gray-400" />
											</div>
										)}
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
													{item.name}
												</h3>
												<div className="flex items-center gap-2 mt-1">
													<span
														className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
															item.type === "lost"
																? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
																: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
														}`}
													>
														{item.type.toUpperCase()}
													</span>
													<StatusBadge status={item.status} />
												</div>
											</div>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												{formatDate(item.created_at)}
											</span>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
											{item.description}
										</p>
										<div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
											<span className="flex items-center gap-1">
												<MapPinIcon size={12} />
												{item.location}
											</span>
											<span className="flex items-center gap-1">
												<UserIcon size={12} />
												{item.user_id
													? `${item.user_id.firstname} ${item.user_id.lastname}`
													: "Unknown"}
											</span>
										</div>
									</div>

									{/* Actions */}
									<div className="flex flex-col gap-2">
										{item.status === "pending" ? (
											<>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleApprove(item._id);
													}}
													disabled={processing === item._id}
													className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg transition-colors disabled:opacity-50"
													title="Approve"
												>
													<CheckIcon size={16} />
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleReject(item._id);
													}}
													disabled={processing === item._id}
													className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
													title="Reject"
												>
													<XIcon size={16} />
												</button>
											</>
										) : item.status === "rejected" ? (
											<>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleApprove(item._id);
													}}
													disabled={processing === item._id}
													className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg transition-colors disabled:opacity-50"
													title="Approve"
												>
													<CheckIcon size={16} />
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleRestoreToPending(item._id);
													}}
													disabled={processing === item._id}
													className="p-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 rounded-lg transition-colors disabled:opacity-50"
													title="Restore to Pending"
												>
													<RotateCcwIcon size={16} />
												</button>
											</>
										) : null}
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{/* Detail Panel */}
				<div className="lg:col-span-1">
					{selectedItem ? (
						<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5 sticky top-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">Item Details</h3>
								<button
									onClick={() => setSelectedItem(null)}
									className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded"
								>
									<XIcon size={16} className="text-gray-500" />
								</button>
							</div>

							{/* Images */}
							{selectedItem.photos && selectedItem.photos.length > 0 && (
								<div className="mb-4">
									<div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800">
										<Image
											src={selectedItem.photos[0].url}
											alt={selectedItem.name}
											width={400}
											height={225}
											className="w-full h-full object-cover"
										/>
									</div>
									{selectedItem.photos.length > 1 && (
										<div className="flex gap-2 mt-2">
											{selectedItem.photos.slice(1, 4).map((photo, idx) => (
												<div
													key={idx}
													className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800"
												>
													<Image
														src={photo.url}
														alt={`${selectedItem.name} ${idx + 2}`}
														width={64}
														height={64}
														className="w-full h-full object-cover"
													/>
												</div>
											))}
										</div>
									)}
								</div>
							)}

							<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{selectedItem.name}</h4>

							<div className="flex flex-wrap gap-2 mb-3">
								<span
									className={`px-2 py-0.5 rounded-full text-xs font-medium ${
										selectedItem.type === "lost"
											? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
											: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
									}`}
								>
									{selectedItem.type.toUpperCase()}
								</span>
								<StatusBadge status={selectedItem.status} />
								<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300 capitalize">
									{selectedItem.category}
								</span>
							</div>

							<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{selectedItem.description}</p>

							<div className="space-y-2 text-sm">
								<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
									<MapPinIcon size={14} />
									<span>{selectedItem.location}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
									<CalendarIcon size={14} />
									<span>
										{selectedItem.type === "lost" ? "Lost on" : "Found on"}{" "}
										{formatDate(selectedItem.date_lost_or_found)}
									</span>
								</div>
								<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
									<UserIcon size={14} />
									<span>
										{selectedItem.user_id
											? `${selectedItem.user_id.firstname} ${selectedItem.user_id.lastname}`
											: "Unknown User"}
									</span>
								</div>
								{selectedItem.user_id?.email && (
									<div className="text-xs text-gray-500 dark:text-gray-500 ml-5">
										{selectedItem.user_id.email}
									</div>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 mt-6">
								{selectedItem.status === "pending" ? (
									<>
										<button
											onClick={() => handleApprove(selectedItem._id)}
											disabled={processing === selectedItem._id}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
										>
											<CheckIcon size={16} />
											Approve
										</button>
										<button
											onClick={() => handleReject(selectedItem._id)}
											disabled={processing === selectedItem._id}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
										>
											<XIcon size={16} />
											Reject
										</button>
									</>
								) : selectedItem.status === "rejected" ? (
									<>
										<button
											onClick={() => handleApprove(selectedItem._id)}
											disabled={processing === selectedItem._id}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
										>
											<CheckIcon size={16} />
											Approve
										</button>
										<button
											onClick={() => handleRestoreToPending(selectedItem._id)}
											disabled={processing === selectedItem._id}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
										>
											<RotateCcwIcon size={16} />
											Restore
										</button>
									</>
								) : null}
							</div>
						</div>
					) : (
						<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
							<EyeIcon size={48} className="mx-auto text-gray-400 mb-4" />
							<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select an item</h3>
							<p className="text-gray-500 dark:text-gray-400 mt-1">
								Click on an item to view details and take action
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
