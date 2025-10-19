import "./globals.css";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider from "@/contexts/ThemeProvider";
import { LoadingProvider } from "@/contexts/LoadingManager";
import { GlobalLoading } from "@/component/GlobalLoader";
import { ConfirmProvider } from "@/ui/ConfirmProvider";
// import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
	title: "GC Yofinder - Lost and Found System for Gordon College",
	description: "Lost and Found System for Gordon College",
	keywords: [
		"GC Yofinder",
		"Lost and Found",
		"Gordon College",
		"Lost Item Recovery",
		"Found Item Reporting",
		"Campus Safety",
		"Student Services",
		"Item Tracking",
		"Community Engagement",
		"GCYofinder",
	],
	authors: [{ name: "1DEV", url: "https://gc-yofinder.vercel.app" }],
	publisher: "GC Yofinder Inc.",
	robots: {
		index: true,
		follow: true,
		nocache: false,
	},
	metadataBase: new URL("https://gc-yofinder.vercel.app"),
	alternates: {
		canonical: "https://gc-yofinder.vercel.app",
	},
	openGraph: {
		type: "website",
		url: "https://gc-yofinder.vercel.app",
		title: "GC Yofinder - Lost and Found System for Gordon College",
		description:
			"GC Yofinder is a platform that helps students report and recover lost items on campus.",
		siteName: "GC Yofinder",
		images: [
			{
				url: "/logo.svg",
				alt: "GC Yofinder - Lost and Found System",
			},
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "GC Yofinder - Lost and Found System (Fallback)",
			},
		],
		category: "education",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<link rel="icon" type="image/x-icon" href="/logo.png" />
			<body className="bg-slate-50 dark:bg-black">
				<ConfirmProvider>
					<LoadingProvider>
						<ThemeProvider>{children}</ThemeProvider>
						<GlobalLoading />
					</LoadingProvider>
				</ConfirmProvider>

				<ToastContainer
					position="bottom-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="colored"
					transition={Slide}
				/>
			</body>
		</html>
	);
}
