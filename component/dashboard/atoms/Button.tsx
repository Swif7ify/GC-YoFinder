"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
	onClick?: () => void;
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "danger" | "outline";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	loading?: boolean;
	icon?: React.ReactNode;
	className?: string;
	type?: "button" | "submit" | "reset";
	fullWidth?: boolean;
}

const variantStyles = {
	primary: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white",
	secondary: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300",
	danger: "bg-red-600 hover:bg-red-700 text-white",
	outline:
		"border border-gray-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
};

const sizeStyles = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-sm",
	lg: "px-6 py-2.5 text-base",
};

export default function Button({
	onClick,
	children,
	variant = "primary",
	size = "md",
	disabled = false,
	loading = false,
	icon,
	className = "",
	type = "button",
	fullWidth = false,
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
			className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed ${
				variantStyles[variant]
			} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
		>
			{loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : icon}
			{children}
		</button>
	);
}
