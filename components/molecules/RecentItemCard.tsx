import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Badge } from "../atoms";
import { RecentItems } from "@/types/types";

dayjs.extend(relativeTime);

interface RecentItemCardProps {
	item: RecentItems;
	href: string;
}

export default function RecentItemCard({ item, href }: RecentItemCardProps) {
	return (
		<Link
			href={href}
			className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
		>
			<div className="flex items-center justify-center">
				<Image
					src={
						item.image_url ||
						"https://images.unsplash.com/photo-1654965778976-409444e9826b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGl0ZW1zJTIwcGxhY2Vob2xkZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
					}
					width={40}
					height={40}
					alt={item.title}
					className="w-24 h-24 rounded-lg flex items-center"
					quality={100}
				/>
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
					{item.title}
				</p>
				<p className="text-md text-gray-600 dark:text-gray-400 mt-1 truncate mb-1">
					{item.description}
				</p>
				<div className="flex items-center gap-4 mt-1">
					<div className="flex gap-2 items-center">
						<MapPin
							size={14}
							className="text-gray-400 dark:text-gray-500 flex-shrink-0"
							aria-hidden="true"
						/>
						<p className="text-sm text-gray-600 dark:text-gray-400 truncate">
							{item.location}
						</p>
					</div>
					<div className="flex gap-2 items-center">
						<Clock
							size={14}
							className="text-gray-400 dark:text-gray-500 flex-shrink-0"
							aria-hidden="true"
						/>
						<p className="text-sm text-gray-600 dark:text-gray-400 truncate">
							{dayjs(item.date).format("MMMM D, YYYY")}
							<span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
								({dayjs(item.date).fromNow()})
							</span>
						</p>
					</div>
				</div>
			</div>
			<Badge
				variant={item.type === "lost" ? "danger" : "success"}
			>
				{item.type.toUpperCase()}
			</Badge>
		</Link>
	);
}

