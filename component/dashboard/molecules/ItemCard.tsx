"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Calendar, Eye, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import dayjs from "dayjs";

interface ItemCardProps {
	id: string;
	name: string;
	description: string;
	type: "lost" | "found";
	status: "active" | "claimed" | "removed";
	location: string;
	date: string;
	imageUrl?: string | null;
	views?: number;
	matches?: number;
	onClick?: () => void;
	onContact?: () => void;
	showContact?: boolean;
	variant?: "grid" | "list";
}

export default function ItemCard({
	id,
	name,
	description,
	type,
	status,
	location,
	date,
	imageUrl,
	views,
	matches,
	onClick,
	onContact,
	showContact = true,
	variant = "grid",
}: ItemCardProps) {
	const TypeIcon = type === "lost" ? AlertCircle : CheckCircle2;

	if (variant === "list") {
		return (
			<article className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow">
				<div className="flex flex-col sm:flex-row gap-4 p-4">
					<div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
						<Image
							src={imageUrl || "https://images.unsplash.com/photo-1654965778976-409444e9826b?w=400"}
							alt={name}
							fill
							className="object-cover"
							sizes="128px"
						/>
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-4 mb-2">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
								{name}
							</h3>
							<div className="flex gap-2 flex-shrink-0">
								<span
									className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
										type === "lost"
											? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
											: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
									}`}
								>
									<TypeIcon size={12} aria-hidden="true" />
									{type === "lost" ? "Lost" : "Found"}
								</span>
								{status === "claimed" && (
									<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
										Claimed
									</span>
								)}
							</div>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{description}</p>
						<div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
							<span className="flex items-center gap-1">
								<MapPin size={14} />
								{location}
							</span>
							<span className="flex items-center gap-1">
								<Calendar size={14} />
								{dayjs(date).format("MMM D, YYYY")}
							</span>
						</div>
						{(views !== undefined || matches !== undefined) && (
							<div className="flex items-center gap-4 mt-3">
								{views !== undefined && (
									<span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
										<Eye size={16} />
										{views} views
									</span>
								)}
								{matches !== undefined && (
									<span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
										<MessageSquare size={16} />
										{matches} matches
									</span>
								)}
							</div>
						)}
					</div>
				</div>
			</article>
		);
	}

	return (
		<article className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
			<div className="relative h-48 bg-gray-100 dark:bg-gray-700">
				<Image
					src={imageUrl || "https://images.unsplash.com/photo-1654965778976-409444e9826b?w=400"}
					alt={name}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
				/>
				<div
					className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
						type === "lost"
							? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
							: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
					}`}
				>
					<TypeIcon size={14} aria-hidden="true" />
					{type === "lost" ? "Lost" : "Found"}
				</div>
				{status === "claimed" && (
					<div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
						Claimed
					</div>
				)}
			</div>
			<div className="p-4 flex flex-col flex-1">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
					{name}
				</h3>
				<p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{description}</p>
				<div className="space-y-2 mb-4">
					<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
						<MapPin size={14} className="flex-shrink-0" aria-hidden="true" />
						<span className="truncate">{location}</span>
					</div>
					<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
						<Calendar size={14} className="flex-shrink-0" aria-hidden="true" />
						<span>{dayjs(date).format("MMMM D, YYYY")}</span>
					</div>
				</div>
				<div className="flex gap-2 mt-auto">
					{onClick && (
						<button
							type="button"
							onClick={onClick}
							className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center justify-center gap-2"
						>
							<Eye size={16} aria-hidden="true" />
							View Details
						</button>
					)}
					{showContact && onContact && (
						<button
							type="button"
							onClick={onContact}
							className="px-4 py-2 border border-gray-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
						>
							<MessageSquare size={16} aria-hidden="true" />
						</button>
					)}
				</div>
			</div>
		</article>
	);
}
