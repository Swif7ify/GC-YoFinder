"use client";

import React from "react";
import { MapPinIcon, UserIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import Badge from "../atoms/Badge";

interface ItemCardProps {
	item: {
		_id: string;
		name: string;
		description: string;
		type: "lost" | "found";
		status: "pending" | "active" | "rejected" | "claimed" | "removed";
		location: string;
		photos: { url: string }[];
		user_id: {
			firstname: string;
			lastname: string;
		} | null;
		created_at: string;
	};
	isSelected?: boolean;
	onClick?: () => void;
	actions?: React.ReactNode;
	formatDate: (date: string) => string;
}

export default function ItemCard({ item, isSelected, onClick, actions, formatDate }: ItemCardProps) {
	return (
		<div
			className={`bg-white dark:bg-neutral-900 rounded-xl border ${
				isSelected ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-gray-200 dark:border-neutral-800"
			} p-4 cursor-pointer hover:shadow-md transition-all`}
			onClick={onClick}
		>
			<div className="flex items-start gap-4">
				{/* Thumbnail */}
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
							<h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</h3>
							<div className="flex items-center gap-2 mt-1">
								<Badge variant={item.type}>{item.type.toUpperCase()}</Badge>
								<Badge variant={item.status}>
									{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
								</Badge>
							</div>
						</div>
						<span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.created_at)}</span>
					</div>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
					<div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
						<span className="flex items-center gap-1">
							<MapPinIcon size={12} />
							{item.location}
						</span>
						<span className="flex items-center gap-1">
							<UserIcon size={12} />
							{item.user_id ? `${item.user_id.firstname} ${item.user_id.lastname}` : "Unknown"}
						</span>
					</div>
				</div>

				{/* Actions */}
				{actions && <div className="flex flex-col gap-2">{actions}</div>}
			</div>
		</div>
	);
}
