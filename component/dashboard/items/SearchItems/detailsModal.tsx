"use client";
import Link from "next/link";

import React, { useState } from "react";
import {
	X,
	MapPin,
	Calendar,
	User,
	MessageSquare,
	Share2,
	Flag,
	Clock,
	Eye,
	Tag,
	AlertCircle,
	CheckCircle2,
	Heart,
	Bookmark,
	Edit,
} from "lucide-react";
import { AllItem } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import CloudinaryImagePreview from "@/ui/CloudinaryImagePreview";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

interface DetailsModalProps {
	item: AllItem;
	onClose: () => void;
	isOwnItem: boolean;
}

export default function DetailsModal({
	item,
	onClose,
	isOwnItem,
}: DetailsModalProps) {
	const router = useRouter();
	const [isSaved, setIsSaved] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	const handleSave = () => {
		// TODO: Implement save/bookmark functionality
		setIsSaved(!isSaved);
	};

	const handleLike = () => {
		// TODO: Implement like/favorite functionality
		setIsLiked(!isLiked);
	};

	const handleContact = () => {
		// TODO: Implement contact/message functionality
	};

	const handleShare = () => {
		// TODO: Implement share functionality (copy link, social media, etc.)
	};

	const handleReport = () => {
		// TODO: Implement report functionality
	};

	const handleClaim = () => {
		// TODO: Implement claim item functionality
	};

	return (
		<AnimatePresence>
			<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.2 }}
					className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-4xl my-8 border border-gray-200 dark:border-neutral-800"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-800">
						<div className="flex items-center gap-3">
							<div
								className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${
									item.type === "lost"
										? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
										: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
								}`}
							>
								{item.type === "lost" ? (
									<AlertCircle size={16} aria-hidden="true" />
								) : (
									<CheckCircle2
										size={16}
										aria-hidden="true"
									/>
								)}
								{item.type === "lost"
									? "Lost Item"
									: "Found Item"}
							</div>
							{item.status === "claimed" && (
								<div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
									Claimed
								</div>
							)}
						</div>
						<div className="flex items-center gap-2">
							{!isOwnItem && (
								<>
									<button
										type="button"
										onClick={handleSave}
										className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
											isSaved
												? "text-emerald-600 dark:text-emerald-400"
												: "text-gray-600 dark:text-gray-400"
										}`}
										aria-label="Save item"
									>
										<Bookmark
											size={20}
											className={
												isSaved ? "fill-current" : ""
											}
										/>
									</button>
									<button
										type="button"
										onClick={handleLike}
										className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
											isLiked
												? "text-red-600 dark:text-red-400"
												: "text-gray-600 dark:text-gray-400"
										}`}
										aria-label="Like item"
									>
										<Heart
											size={20}
											className={
												isLiked ? "fill-current" : ""
											}
										/>
									</button>
								</>
							)}
							{isOwnItem && (
								<Link
									href={`/dashboard?tab=my-items&edit=${item.id}`}
									className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
									aria-label="Edit item"
								>
									<Edit size={20} />
								</Link>
							)}
							<button
								type="button"
								onClick={handleShare}
								className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
								aria-label="Share item"
							>
								<Share2 size={20} />
							</button>
							<button
								type="button"
								onClick={onClose}
								className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
								aria-label="Close modal"
							>
								<X size={24} />
							</button>
						</div>
					</div>

					{/* Content */}
					<div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Left Column - Images and Description */}
							<div className="space-y-6">
								{/* Images */}
								<div>
									<CloudinaryImagePreview
										images={item.photos || []}
										gridCols="3"
										aspectRatio="square"
										showCount={true}
										allowDownload={false}
									/>
								</div>

								{/* Item Details */}
								<div>
									<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
										{item.name}
									</h2>

									{/* Category */}
									<div className="flex items-center gap-2 mb-4">
										<Tag
											size={16}
											className="text-gray-500 dark:text-gray-400"
										/>
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{item.category}
										</span>
									</div>

									{/* Description */}
									<div className="mb-4">
										<h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
											Description
										</h3>
										<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
											{item.description}
										</p>
									</div>

									{/* Location */}
									<div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg mb-4">
										<MapPin
											size={20}
											className="text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5"
										/>
										<div>
											<h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
												Location
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{item.location}
											</p>
										</div>
									</div>

									{/* Date */}
									<div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
										<Calendar
											size={20}
											className="text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5"
										/>
										<div>
											<h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
												{item.type === "lost"
													? "Date Lost"
													: "Date Found"}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{dayjs(
													item.date_lost_or_found
												).format("MMMM D, YYYY")}
												<span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
													(
													{dayjs(
														item.date_lost_or_found
													).fromNow()}
													)
												</span>
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Right Column - Owner Info and Actions */}
							<div className="space-y-6">
								{/* Owner Information */}
								<div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
										{item.type === "lost"
											? "Posted By"
											: "Found By"}
									</h3>

									{/* User Avatar and Name */}
									<div className="flex items-center gap-4 mb-4">
										<div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
											{item.user_id.photo ? (
												<img
													src={item.user_id.photo}
													alt={`${item.user_id.firstname} ${item.user_id.lastname}`}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
													<User size={32} />
												</div>
											)}
										</div>
										<div>
											<p className="font-semibold text-gray-900 dark:text-gray-100">
												{item.user_id.firstname}{" "}
												{item.user_id.lastname}
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												@{item.user_id.username}
											</p>
										</div>
									</div>

									{/* Contact Actions */}
									{!isOwnItem && (
										<div className="space-y-3">
											<button
												type="button"
												onClick={handleContact}
												className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
											>
												<MessageSquare size={18} />
												Send Message
											</button>

											{/* TODO: Add email and phone contact buttons if available */}
											{/* <button
											type="button"
											className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
										>
											<Mail size={18} />
											Send Email
										</button> */}
										</div>
									)}
								</div>{" "}
								{/* Item Statistics */}
								<div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
										Item Stats
									</h3>
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
												<Eye size={16} />
												<span className="text-sm">
													Views
												</span>
											</div>
											<span className="font-medium text-gray-900 dark:text-gray-100">
												{item.views || 0}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
												<MessageSquare size={16} />
												<span className="text-sm">
													Matches
												</span>
											</div>
											<span className="font-medium text-gray-900 dark:text-gray-100">
												{item.matched || 0}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
												<Clock size={16} />
												<span className="text-sm">
													Posted
												</span>
											</div>
											<span className="text-sm text-gray-600 dark:text-gray-400">
												{dayjs(
													item.created_at
												).fromNow()}
											</span>
										</div>
										{item.updated_at &&
											item.updated_at !==
												item.created_at && (
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
														<Clock size={16} />
														<span className="text-sm">
															Updated
														</span>
													</div>
													<span className="text-sm text-gray-600 dark:text-gray-400">
														{dayjs(
															item.updated_at
														).fromNow()}
													</span>
												</div>
											)}
									</div>
								</div>
								{/* Action Buttons */}
								{item.status === "active" && !isOwnItem && (
									<div className="space-y-3">
										<button
											type="button"
											onClick={handleClaim}
											className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
										>
											<CheckCircle2 size={18} />
											{item.type === "lost"
												? "I Found This Item"
												: "This is My Item"}
										</button>

										<button
											type="button"
											onClick={handleReport}
											className="w-full px-4 py-3 border border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
										>
											<Flag size={18} />
											Report Item
										</button>
									</div>
								)}{" "}
								{/* Claimed Info */}
								{item.status === "claimed" &&
									item.claimed_at && (
										<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
											<div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
												<CheckCircle2 size={18} />
												<span className="font-semibold text-sm">
													Item Claimed
												</span>
											</div>
											<p className="text-xs text-blue-600 dark:text-blue-400">
												This item was claimed on{" "}
												{dayjs(item.claimed_at).format(
													"MMMM D, YYYY"
												)}
											</p>
										</div>
									)}
								{/* Similar Items */}
								{/* TODO: Implement similar items recommendation */}
								{/* <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
										Similar Items
									</h3>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										No similar items found
									</p>
								</div> */}
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50">
						<div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
							<span>Item ID: {item.id}</span>
							<span>•</span>
							<span>
								Posted{" "}
								{dayjs(item.created_at).format("MMM D, YYYY")}
							</span>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						>
							Close
						</button>
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	);
}
