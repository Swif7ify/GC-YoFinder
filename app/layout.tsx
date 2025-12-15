/**
 * Root Layout
 * ===========
 *
 * This is the root layout for the entire application. It wraps all pages
 * and provides global functionality including:
 *
 * - Theme management (dark/light mode)
 * - Global loading states
 * - Toast notifications
 * - Pusher real-time connection
 * - Confirmation dialogs
 * - Translation support
 *
 * DATA FETCHING STRATEGY: Static Shell
 *
 * The root layout is statically generated and provides:
 * - HTML shell with global styles
 * - Provider components that don't fetch data
 * - Metadata for SEO
 *
 * WHY STATIC:
 * - Layout doesn't change based on user or request
 * - Providers initialize on client-side
 * - Faster initial page load
 * - Better caching at CDN level
 *
 * PROVIDER HIERARCHY:
 * 1. PusherProvider - Real-time connection (outermost for global access)
 * 2. ConfirmProvider - Confirmation dialogs
 * 3. LoadingProvider - Global loading states
 * 4. TranslationProvider - i18n support
 * 5. ThemeProvider - Dark/light mode (innermost, wraps content)
 */

import "./globals.css";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider from "@/contexts/ThemeProvider";
import { LoadingProvider } from "@/contexts/LoadingManager";
import { GlobalLoading } from "@/component/GlobalLoader";
import { ConfirmProvider } from "@/ui/ConfirmProvider";
import { PusherProvider } from "@/contexts/PusherProvider";
import { TranslationProvider } from "@/contexts/TranslationProvider";
import { Providers } from "./providers";

/**
 * Application Metadata
 *
 * Global SEO configuration for the application.
 * Individual pages can override these values with their own metadata.
 *
 * This metadata is statically generated at build time for optimal
 * SEO performance and social sharing.
 */
export const metadata = {
	// Human-readable title shown in search results and social cards
	title: "GC Yofinder - Lost and Found System for Gordon College",

	// Primary description used by search engines and social shares
	description:
		"GC Yofinder helps Gordon College students report and recover lost items on campus.",

	// Helpful keyword list (minor SEO value but useful for organization)
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

	// Site authorship information
	authors: [{ name: "1DEV", url: "https://gc-yofinder.vercel.app" }],
	publisher: "GC Yofinder Inc.",

	// Robots instructions — allow indexing and following links
	robots: {
		index: true,
		follow: true,
		nocache: false,
	},

	// Base URL used when Next.js constructs absolute URLs for meta tags
	metadataBase: new URL("https://gc-yofinder.vercel.app"),

	// Canonical alternate for SEO
	alternates: {
		canonical: "https://gc-yofinder.vercel.app",
	},

	// Open Graph (used by Facebook, LinkedIn, etc.)
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

	// Twitter card metadata for richer shares on Twitter/X
	twitter: {
		card: "summary_large_image",
		title: "GC Yofinder - Lost and Found System for Gordon College",
		description:
			"Report and recover lost items on Gordon College campus with GC Yofinder.",
		images: ["/logo.png"],
		creator: "@GCYofinder",
	},

	// Icons used by browsers and when sharing; keep a small favicon and
	// a larger app icon for social previews.
	icons: {
		icon: "/logo.png",
		shortcut: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},

	// Theme color gives a hint to browsers for UI theming (address bar, task switcher)
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#0f172a" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],
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
				<PusherProvider>
					<ConfirmProvider>
						<LoadingProvider>
							<TranslationProvider>
								<Providers>
									<ThemeProvider>{children}</ThemeProvider>
								</Providers>
							</TranslationProvider>
							<GlobalLoading />
						</LoadingProvider>
					</ConfirmProvider>
				</PusherProvider>

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
