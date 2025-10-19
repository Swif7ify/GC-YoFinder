import { ElementType } from "react";

export interface UserData {
	created_at: string;
	email: string;
	username: string;
	firstname: string;
	lastname: string;
	is_online: boolean;
	phone?: string;
	photo?: {
		url: string;
		publicId: string;
		cloudinaryId: string;
		format: string;
		size: number;
		width: number;
		height: number;
		uploaded_at: Date;
		resourceType: "image" | "video" | "raw" | "auto";
	};
	role: "student" | "admin";
	updated_at: string;
}

export interface RecentItems {
	id: string;
	title: string;
	description: string;
	type: "lost" | "found";
	location: string;
	date: string;
	status: "active" | "claimed" | "removed";
	image_url?: string;
}

export interface Items {
	id: RecentItems["id"];
	title: RecentItems["title"];
	description: RecentItems["description"];
	type: RecentItems["type"];
	location: RecentItems["location"];
	date: RecentItems["date"];
	status: RecentItems["status"];
	image_url: RecentItems["image_url"];
	category: string;
}

export interface RecentActivity {
	id: string;
	action: string;
	item: string;
	time: string;
	type: "match" | "message" | "update" | "claimed";
}

export interface Conversation {
	id: string;
	name: string;
	subject: string;
	lastMessage: string;
	time: string;
	avatar?: string;
	unreadCount: number;
}

export interface Message {
	id: string;
	senderId: string;
	senderName: string;
	content: string;
	timestamp: string;
	isOwn: boolean;
}

export interface Location {
	id: string;
	name: string;
	building: string;
	floor: string;
	description: string;
	hours: string;
	type: "drop-off" | "pick-up" | "both";
	contactPerson?: string;
	contactEmail?: string;
}

export interface MyItem {
	id: string;
	title: string;
	description: string;
	type: "lost" | "found";
	location: string;
	dateReported: string;
	status: "active" | "claimed" | "removed";
	views: number;
	matchCount: number;
	image_url?: string;
	category: string;
}

export interface CloudinaryImagePreviewProps {
	images: string[];
	className?: string;
	gridCols?: "2" | "3" | "4" | "6";
	aspectRatio?: "square" | "video" | "auto";
	showCount?: boolean;
	allowDownload?: boolean;
	children?: React.ReactNode;
}

export interface StatsCard {
	label: string;
	value: number | string;
	change: string;
	icon: ElementType;
	color: string;
	bgColor: string;
	iconColor: string;
	trend: string;
}

export type ItemCategory =
	| "Electronics"
	| "Personal Items"
	| "Bags & Accessories"
	| "Books & Supplies"
	| "Clothing"
	| "Keys & Cards"
	| "Sports Equipment"
	| "Other";

export const ITEM_CATEGORIES: ItemCategory[] = [
	"Electronics",
	"Personal Items",
	"Bags & Accessories",
	"Books & Supplies",
	"Clothing",
	"Keys & Cards",
	"Sports Equipment",
	"Other",
];
