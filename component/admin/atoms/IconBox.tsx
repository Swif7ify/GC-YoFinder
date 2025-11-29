"use client";

import React from "react";

interface IconBoxProps {
	icon: React.ReactNode;
	variant?: "lost" | "found" | "default";
	size?: "sm" | "md" | "lg";
}

const variantStyles = {
	lost: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
	found: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
	default: "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400",
};

const sizeStyles = {
	sm: "p-1.5",
	md: "p-2",
	lg: "p-3",
};

export default function IconBox({ icon, variant = "default", size = "md" }: IconBoxProps) {
	return <div className={`rounded-lg ${variantStyles[variant]} ${sizeStyles[size]}`}>{icon}</div>;
}
