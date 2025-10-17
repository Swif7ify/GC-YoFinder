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
	status: "active" | "claimed" | "expired" | "removed";
	views: number;
	matchCount: number;
	image_url?: string;
}
