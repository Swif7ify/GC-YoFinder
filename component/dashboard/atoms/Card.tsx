"use client";

import React from "react";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	padding?: "none" | "sm" | "md" | "lg";
	hover?: boolean;
}

const paddingStyles = {
	none: "",
	sm: "p-4",
	md: "p-6",
	lg: "p-8",
};

export default function Card({ children, className = "", padding = "md", hover = false }: CardProps) {
	return (
		<div
			className={`bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 ${
				paddingStyles[padding]
			} ${hover ? "hover:shadow-md transition-shadow" : ""} ${className}`}
		>
			{children}
		</div>
	);
}

interface CardHeaderProps {
	children: React.ReactNode;
	className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
	return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
	children: React.ReactNode;
	icon?: React.ReactNode;
	className?: string;
}

export function CardTitle({ children, icon, className = "" }: CardTitleProps) {
	return (
		<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 ${className}`}>
			{icon && <span className="text-emerald-600 dark:text-emerald-400">{icon}</span>}
			{children}
		</h2>
	);
}
