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
