"use client";

import React from "react";
import { XIcon, MapPinIcon, CalendarIcon, UserIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import Badge from "../atoms/Badge";

interface DetailPanelProps {
	item: {
		_id: string;
		name: string;
		description: string;
		type: "lost" | "found";
		status: "pending" | "active" | "rejected" | "claimed" | "removed";
		category: string;
		location: string;
		date_lost_or_found?: string;
		photos: { url: string }[];
		user_id: {
			firstname: string;
			lastname: string;
			email?: string;
		} | null;
	} | null;
	onClose: () => void;
	formatDate: (date: string) => string;
	actions?: React.ReactNode;
	emptyIcon?: React.ReactNode;
	emptyTitle?: string;
	emptyDescription?: string;
}

export default function DetailPanel({
	item,
	onClose,
	formatDate,
	actions,
	emptyIcon,
	emptyTitle = "Select an item",
	emptyDescription = "Click on an item to view details",
}: DetailPanelProps) {
	if (!item) {
		return (
			<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
				{emptyIcon || <EyeIcon size={48} className="mx-auto text-gray-400 mb-4" />}
				<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{emptyTitle}</h3>
				<p className="text-gray-500 dark:text-gray-400 mt-1">{emptyDescription}</p>
			</div>
		);
	}

	return (
		<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5 sticky top-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-semibold text-gray-900 dark:text-gray-100">Item Details</h3>
				<button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded">
					<XIcon size={16} className="text-gray-500" />
				</button>
			</div>

			{/* Images */}
			{item.photos && item.photos.length > 0 && (
				<div className="mb-4">
					<div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800">
						<Image
							src={item.photos[0].url}
							alt={item.name}
							width={400}
							height={225}
							className="w-full h-full object-cover"
						/>
					</div>
					{item.photos.length > 1 && (
						<div className="flex gap-2 mt-2">
							{item.photos.slice(1, 4).map((photo, idx) => (
								<div
									key={idx}
									className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800"
								>
									<Image
										src={photo.url}
										alt={`${item.name} ${idx + 2}`}
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

			<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{item.name}</h4>

			<div className="flex flex-wrap gap-2 mb-3">
				<Badge variant={item.type}>{item.type.toUpperCase()}</Badge>
				<Badge variant={item.status}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Badge>
				<Badge variant="default">{item.category}</Badge>
			</div>

			<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>

			<div className="space-y-2 text-sm">
				<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
					<MapPinIcon size={14} />
					<span>{item.location}</span>
				</div>
				{item.date_lost_or_found && (
					<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
						<CalendarIcon size={14} />
						<span>
							{item.type === "lost" ? "Lost on" : "Found on"} {formatDate(item.date_lost_or_found)}
						</span>
					</div>
				)}
				<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
					<UserIcon size={14} />
					<span>{item.user_id ? `${item.user_id.firstname} ${item.user_id.lastname}` : "Unknown User"}</span>
				</div>
				{item.user_id?.email && (
					<div className="text-xs text-gray-500 dark:text-gray-500 ml-5">{item.user_id.email}</div>
				)}
			</div>

			{/* Actions */}
			{actions && <div className="mt-6">{actions}</div>}
		</div>
	);
}
