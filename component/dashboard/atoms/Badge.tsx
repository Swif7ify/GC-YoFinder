"use client";

import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export type BadgeVariant = "lost" | "found" | "active" | "claimed" | "removed" | "default";

interface BadgeProps {
	variant: BadgeVariant;
	children?: React.ReactNode;
	showIcon?: boolean;
	className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
	lost: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
	found: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
	active: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
	claimed: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
	removed: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
	default: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
};

const variantLabels: Record<BadgeVariant, string> = {
	lost: "Lost",
	found: "Found",
	active: "Active",
	claimed: "Claimed",
	removed: "Removed",
	default: "",
};

export default function Badge({ variant, children, showIcon = false, className = "" }: BadgeProps) {
	const Icon = variant === "lost" ? AlertCircle : CheckCircle2;
	const label = children || variantLabels[variant];

	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
		>
			{showIcon && (variant === "lost" || variant === "found") && <Icon size={12} aria-hidden="true" />}
			{label}
		</span>
	);
}
