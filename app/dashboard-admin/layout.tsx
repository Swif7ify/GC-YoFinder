import { Metadata } from "next";

const TAB_MAP: Record<string, string> = {
	dashboard: "Dashboard",
	"new-item": "New Item",
	"search-items": "Search Items",
	"my-items": "My Items",
	messages: "Messages",
};

export async function generateMetadata({
	searchParams,
}: {
	searchParams: any;
}): Promise<Metadata> {
	const tab =
		typeof searchParams?.tab === "string"
			? searchParams.tab.toLowerCase()
			: "";
	const label = TAB_MAP[tab] ?? "Dashboard";
	return {
		title: `GC YoFinder | ${label}`,
	};
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
