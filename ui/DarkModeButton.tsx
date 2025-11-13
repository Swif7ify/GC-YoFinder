import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeButton() {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [timer, setTimer] = useState(0);
	const [isSwitch, setIsSwitch] = useState(false);

	const handleToggleDarkMode = () => {
		if (isSwitch) return;
		setIsSwitch(true);
		setIsDarkMode((prev) => {
			const newValue = !prev;
			if (typeof window !== "undefined") {
				if (newValue) {
					document.documentElement.classList.add("dark");
					localStorage.setItem("theme", "dark");
				} else {
					document.documentElement.classList.remove("dark");
					localStorage.setItem("theme", "light");
				}
			}
			setTimer(1);
			return newValue;
		});
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const theme = localStorage.getItem("theme");
			if (theme === "dark") {
				setIsDarkMode(true);
			} else {
				setIsDarkMode(false);
			}
		}
	}, []);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isSwitch && timer > 0) {
			interval = setInterval(() => {
				setTimer((prev) => {
					if (prev <= 1) {
						setIsSwitch(false);
						clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isSwitch, timer]);

	return (
		<>
			<button disabled={isSwitch} onClick={handleToggleDarkMode}>
				{isDarkMode ? <Moon className="text-gray-900 dark:text-gray-300" /> : <Sun className="text-yellow-500" />}
			</button>
		</>
	);
}
