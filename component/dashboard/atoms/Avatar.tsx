"use client";

import React from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
	src?: string | null;
	alt?: string;
	name?: string;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeStyles = {
	sm: "w-8 h-8",
	md: "w-10 h-10",
	lg: "w-12 h-12",
	xl: "w-16 h-16",
};

const iconSizes = {
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
};

function getInitials(name?: string): string {
	if (!name) return "";
	return name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export default function Avatar({ src, alt = "Avatar", name, size = "md", className = "" }: AvatarProps) {
	const initials = getInitials(name);

	return (
		<div
			className={`${sizeStyles[size]} rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-medium overflow-hidden ${className}`}
		>
			{src ? (
				<Image src={src} alt={alt} width={64} height={64} className="w-full h-full object-cover" />
			) : initials ? (
				<span className="text-sm">{initials}</span>
			) : (
				<User size={iconSizes[size]} aria-hidden="true" />
			)}
		</div>
	);
}
