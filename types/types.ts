import { ElementType } from "react";

export interface PhotoMetadata {
	url: string;
	publicId: string;
	cloudinaryId: string;
	format: string;
	size: number;
	width: number;
	height: number;
	uploaded_at: Date;
	version?: number;
	signature?: string;
	etag?: string;
	resourceType: "image" | "video" | "raw" | "auto";
}

export interface UserData {
	created_at: string;
	email: string;
	username: string;
	firstname: string;
	lastname: string;
	is_online: boolean;
	phone?: string;
	photo?: PhotoMetadata;
	role: "student" | "admin";
	updated_at: string;
}

// Shared status type for all items
export type ItemStatus =
	| "pending"
	| "active"
	| "claimed"
	| "rejected"
	| "removed";

export interface RecentItems {
	id: string;
	title: string;
	description: string;
	type: "lost" | "found";
	location: string;
	date: string;
	status: ItemStatus;
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
	itemStatus?: ItemStatus;
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
	status: ItemStatus;
	views: number;
	matchCount: number;
	image_url?: string;
	images: string[];
	category: string;
}

export interface AllItem {
	id: string;
	category: string;
	claimed_at?: string;
	claimed_by?: string;
	// contact_info?: {
	// 	show_email?: boolean;
	// 	show_phone?: boolean;
	// }
	created_at: string;
	date_lost_or_found: string;
	description: string;
	location: string;
	matched: number;
	name: string;
	photos: PhotoMetadata[];
	status: ItemStatus;
	type: "lost" | "found";
	updated_at: string;
	user_id: {
		id: string;
		firstname: string;
		lastname: string;
		username: string;
		photo?: string;
	};
	views: number;
}

export interface AdminItem {
	_id: string;
	name: string;
	description: string;
	type: "lost" | "found";
	status: ItemStatus;
	category: string;
	location: string;
	date_lost_or_found?: string;
	views?: number;
	matched?: number;
	photos: PhotoMetadata[];
	user_id: {
		_id?: string;
		firstname: string;
		lastname: string;
		email?: string;
		username?: string;
	} | null;
	created_at: string;
	updated_at?: string;
	claimed_at?: string;
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

export interface UserNotificationsPrefs {
	email: boolean;
	match: boolean;
	message: boolean;
}

export interface UserPrivacyPrefs {
	profileVisibility: "public" | "college" | "private";
	showEmail: boolean;
	showContactInfo: boolean;
}

export interface UserDisplayPrefs {
	theme: "system" | "light" | "dark";
	textSize: number;
	reduceMotion: boolean;
}

export interface UserSettings {
	language: "en" | "fil";
	notifications: UserNotificationsPrefs;
	privacy: UserPrivacyPrefs;
	display: UserDisplayPrefs;
}
