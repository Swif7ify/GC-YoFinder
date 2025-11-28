"use client";

import React from "react";

type BadgeVariant = "pending" | "active" | "rejected" | "claimed" | "removed" | "lost" | "found" | "default";

interface BadgeProps {
	variant?: BadgeVariant;
	children: React.ReactNode;
	className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
	pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
	active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
	rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
	claimed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
	removed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
	lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
	found: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
	default: "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300",
};

export default function Badge({ variant = "default", children, className = "" }: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
		>
			{children}
		</span>
	);
}
