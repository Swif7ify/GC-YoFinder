"use client";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);

		const theme = localStorage.getItem("theme");
		if (theme === "dark" && !document.documentElement.classList.contains("dark")) {
			document.documentElement.classList.add("dark");
		} else if (theme === "light" && document.documentElement.classList.contains("dark")) {
			document.documentElement.classList.remove("dark");
		}

		const storedTextSize = localStorage.getItem("textSize");
		if (storedTextSize) {
			const n = Number(storedTextSize);
			if (!Number.isNaN(n)) document.documentElement.style.fontSize = `${n}px`;
		}

		const storedReduceMotion = localStorage.getItem("reduceMotion");
		if (storedReduceMotion === "1") {
			document.documentElement.setAttribute("data-reduce-motion", "1");
		} else {
			document.documentElement.removeAttribute("data-reduce-motion");
		}

		const onStorage = (e: StorageEvent) => {
			if (e.key === "theme") {
				if (e.newValue === "dark") document.documentElement.classList.add("dark");
				else if (e.newValue === "light") document.documentElement.classList.remove("dark");
				else {
					const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
					document.documentElement.classList.toggle("dark", prefersDark);
				}
			} else if (e.key === "textSize" && e.newValue) {
				const n = Number(e.newValue);
				if (!Number.isNaN(n)) document.documentElement.style.fontSize = `${n}px`;
			} else if (e.key === "reduceMotion") {
				if (e.newValue === "1") {
					document.documentElement.setAttribute("data-reduce-motion", "1");
				} else {
					document.documentElement.removeAttribute("data-reduce-motion");
				}
			}
		};

		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	if (!mounted) {
		return <div style={{ visibility: "hidden" }}>{children}</div>;
	}

	return <>{children}</>;
}
