"use client";

import React, { useState, useRef, useEffect } from "react";
import {
	SearchIcon,
	RefreshCwIcon,
	UserIcon,
	MailIcon,
	PhoneIcon,
	CalendarIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreVerticalIcon,
	EyeIcon,
	XIcon,
} from "lucide-react";
import Image from "next/image";

interface User {
	_id: string;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	phone?: string;
	photo?: { url: string } | null;
	role: string;
	is_online?: boolean;
	created_at: string;
}

interface Pagination {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	hasNext: boolean;
	hasPrev: boolean;
}

interface UsersPageProps {
	users?: User[];
	pagination?: Pagination | null;
	onSearch?: (page: number, search?: string, useCache?: boolean) => void;
	onRefresh?: () => void;
}

export default function UsersPage({ users = [], pagination, onSearch, onRefresh }: UsersPageProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	// Close menu when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpenMenuId(null);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSearch = () => {
		if (onSearch) {
			onSearch(1, searchQuery || undefined, false);
		}
	};

	const handlePageChange = (page: number) => {
		if (onSearch) {
			onSearch(page, searchQuery || undefined, false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const toggleMenu = (userId: string) => {
		setOpenMenuId(openMenuId === userId ? null : userId);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">User Management</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Manage student accounts ({pagination?.totalItems || users.length} total users)
					</p>
				</div>
				<button
					onClick={onRefresh}
					className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
				>
					<RefreshCwIcon size={16} />
					Refresh
				</button>
			</div>

			{/* Search */}
			<div className="flex gap-2">
				<div className="relative flex-1">
					<SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search by name, email, or username..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
						className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
					/>
				</div>
				<button
					onClick={handleSearch}
					className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
				>
					Search
				</button>
			</div>

			{/* Users Table */}
			<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									User
								</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Email
								</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Phone
								</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Status
								</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Joined
								</th>
								<th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{users.length === 0 ? (
								<tr>
									<td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
										<UserIcon size={48} className="mx-auto mb-4 opacity-50" />
										<p>No users found</p>
									</td>
								</tr>
							) : (
								users.map((user) => (
									<tr
										key={user._id}
										className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
									>
										<td className="py-3 px-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden flex items-center justify-center">
													{user.photo?.url ? (
														<Image
															src={user.photo.url}
															alt={user.username}
															width={40}
															height={40}
															className="w-full h-full object-cover"
														/>
													) : (
														<span className="text-emerald-700 dark:text-emerald-400 font-medium">
															{user.firstname?.[0]}
															{user.lastname?.[0]}
														</span>
													)}
												</div>
												<div>
													<p className="font-medium text-gray-900 dark:text-gray-100">
														{user.firstname} {user.lastname}
													</p>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														@{user.username}
													</p>
												</div>
											</div>
										</td>
										<td className="py-3 px-4">
											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
												<MailIcon size={14} />
												<span className="text-sm">{user.email}</span>
											</div>
										</td>
										<td className="py-3 px-4">
											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
												<PhoneIcon size={14} />
												<span className="text-sm">{user.phone || "N/A"}</span>
											</div>
										</td>
										<td className="py-3 px-4">
											<span
												className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
													user.is_online
														? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
														: "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300"
												}`}
											>
												<span
													className={`w-2 h-2 rounded-full ${
														user.is_online ? "bg-green-500" : "bg-gray-400"
													}`}
												></span>
												{user.is_online ? "Online" : "Offline"}
											</span>
										</td>
										<td className="py-3 px-4">
											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
												<CalendarIcon size={14} />
												<span className="text-sm">{formatDate(user.created_at)}</span>
											</div>
										</td>
										<td className="py-3 px-4">
											<div
												className="relative flex justify-center"
												ref={openMenuId === user._id ? menuRef : null}
											>
												<button
													onClick={() => toggleMenu(user._id)}
													className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
												>
													<MoreVerticalIcon size={16} className="text-gray-500" />
												</button>
												{openMenuId === user._id && (
													<div className="absolute right-0 top-10 w-40 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 z-50">
														<button
															onClick={() => {
																setSelectedUser(user);
																setOpenMenuId(null);
															}}
															className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
														>
															<EyeIcon size={14} />
															View Details
														</button>
													</div>
												)}
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{pagination && pagination.totalPages > 0 && (
					<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-neutral-700">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
							{Math.min(pagination.currentPage * 10, pagination.totalItems)} of {pagination.totalItems}{" "}
							users
						</p>
						<div className="flex items-center gap-1">
							{/* Previous Button */}
							<button
								onClick={() => handlePageChange(pagination.currentPage - 1)}
								disabled={!pagination.hasPrev}
								className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
							>
								<ChevronLeftIcon size={16} />
							</button>

							{/* Page Numbers */}
							{(() => {
								const pages = [];
								const current = pagination.currentPage;
								const total = pagination.totalPages;

								// Always show first page
								if (total > 0) {
									pages.push(1);
								}

								// Show ellipsis if needed
								if (current > 3) {
									pages.push("...");
								}

								// Show pages around current
								for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
									if (!pages.includes(i)) {
										pages.push(i);
									}
								}

								// Show ellipsis if needed
								if (current < total - 2) {
									pages.push("...");
								}

								// Always show last page
								if (total > 1 && !pages.includes(total)) {
									pages.push(total);
								}

								return pages.map((page, idx) =>
									typeof page === "number" ? (
										<button
											key={idx}
											onClick={() => handlePageChange(page)}
											className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
												page === current
													? "bg-emerald-600 text-white"
													: "border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
											}`}
										>
											{page}
										</button>
									) : (
										<span key={idx} className="px-1 text-gray-400">
											...
										</span>
									)
								);
							})()}

							{/* Next Button */}
							<button
								onClick={() => handlePageChange(pagination.currentPage + 1)}
								disabled={!pagination.hasNext}
								className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
							>
								<ChevronRightIcon size={16} />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* User Details Modal */}
			{selectedUser && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					onClick={() => setSelectedUser(null)}
				>
					<div
						className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full mx-4"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">User Details</h3>
							<button
								onClick={() => setSelectedUser(null)}
								className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded"
							>
								<XIcon size={20} className="text-gray-500" />
							</button>
						</div>
						<div className="p-6">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden flex items-center justify-center">
									{selectedUser.photo?.url ? (
										<Image
											src={selectedUser.photo.url}
											alt={selectedUser.username}
											width={64}
											height={64}
											className="w-full h-full object-cover"
										/>
									) : (
										<span className="text-2xl text-emerald-700 dark:text-emerald-400 font-medium">
											{selectedUser.firstname?.[0]}
											{selectedUser.lastname?.[0]}
										</span>
									)}
								</div>
								<div>
									<h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
										{selectedUser.firstname} {selectedUser.lastname}
									</h4>
									<p className="text-gray-500 dark:text-gray-400">@{selectedUser.username}</p>
									<span
										className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
											selectedUser.is_online
												? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
												: "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300"
										}`}
									>
										<span
											className={`w-2 h-2 rounded-full ${
												selectedUser.is_online ? "bg-green-500" : "bg-gray-400"
											}`}
										></span>
										{selectedUser.is_online ? "Online" : "Offline"}
									</span>
								</div>
							</div>
							<div className="space-y-4">
								<div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
									<MailIcon size={18} className="text-gray-500" />
									<div>
										<p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
										<p className="text-gray-900 dark:text-gray-100">{selectedUser.email}</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
									<PhoneIcon size={18} className="text-gray-500" />
									<div>
										<p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
										<p className="text-gray-900 dark:text-gray-100">
											{selectedUser.phone || "Not provided"}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
									<CalendarIcon size={18} className="text-gray-500" />
									<div>
										<p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
										<p className="text-gray-900 dark:text-gray-100">
											{formatDate(selectedUser.created_at)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
