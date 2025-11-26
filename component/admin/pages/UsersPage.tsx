"use client";

import React, { useState } from "react";
import {
	SearchIcon,
	RefreshCwIcon,
	UserIcon,
	MailIcon,
	PhoneIcon,
	CalendarIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
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
							</tr>
						</thead>
						<tbody>
							{users.length === 0 ? (
								<tr>
									<td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
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
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{pagination && pagination.totalPages > 1 && (
					<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-neutral-700">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} users)
						</p>
						<div className="flex gap-2">
							<button
								onClick={() => handlePageChange(pagination.currentPage - 1)}
								disabled={!pagination.hasPrev}
								className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronLeftIcon size={16} />
							</button>
							<button
								onClick={() => handlePageChange(pagination.currentPage + 1)}
								disabled={!pagination.hasNext}
								className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronRightIcon size={16} />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
