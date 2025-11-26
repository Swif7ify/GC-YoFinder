import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger" | "ghost";
	size?: "sm" | "md" | "lg";
	icon?: LucideIcon;
	iconPosition?: "left" | "right";
	fullWidth?: boolean;
	children: React.ReactNode;
}

export default function Button({
	variant = "primary",
	size = "md",
	icon: Icon,
	iconPosition = "left",
	fullWidth = false,
	children,
	className = "",
	...props
}: ButtonProps) {
	const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
	
	const variantClasses = {
		primary: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 focus-visible:ring-emerald-500",
		secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-100 dark:hover:bg-neutral-700 focus-visible:ring-gray-500",
		danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-500",
		ghost: "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus-visible:ring-gray-500",
	};

	const sizeClasses = {
		sm: "px-3 py-1.5 text-sm gap-1.5",
		md: "px-4 py-2 text-sm gap-2",
		lg: "px-6 py-3 text-base gap-2",
	};

	const iconSize = {
		sm: 16,
		md: 18,
		lg: 20,
	};

	return (
		<button
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
			{...props}
		>
			{Icon && iconPosition === "left" && <Icon size={iconSize[size]} aria-hidden="true" />}
			{children}
			{Icon && iconPosition === "right" && <Icon size={iconSize[size]} aria-hidden="true" />}
		</button>
	);
}

