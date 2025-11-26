"use client";

import React from "react";

interface IconButtonProps {
	onClick?: () => void;
	icon: React.ReactNode;
	label: string;
	variant?: "default" | "danger" | "primary";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	className?: string;
	type?: "button" | "submit" | "reset";
}

const variantStyles = {
	default: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700",
	danger: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
	primary: "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
};

const sizeStyles = {
	sm: "p-1.5",
	md: "p-2",
	lg: "p-3",
};

export default function IconButton({
	onClick,
	icon,
	label,
	variant = "default",
	size = "md",
	disabled = false,
	className = "",
	type = "button",
}: IconButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			aria-label={label}
		>
			{icon}
		</button>
	);
}
