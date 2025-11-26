import React from "react";
import Image from "next/image";
import { UserIcon } from "lucide-react";

interface AvatarProps {
	src?: string;
	alt?: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}

export default function Avatar({
	src,
	alt = "Avatar",
	size = "md",
	className = "",
}: AvatarProps) {
	const sizeClasses = {
		sm: "h-8 w-8",
		md: "h-9 w-9",
		lg: "h-12 w-12",
	};

	return (
		<div
			className={`${sizeClasses[size]} bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-400 flex-shrink-0 ${className}`}
		>
			{src ? (
				<Image
					src={src}
					alt={alt}
					width={96}
					height={96}
					className="rounded-full w-full h-full object-cover"
				/>
			) : (
				<UserIcon
					size={size === "sm" ? 16 : size === "md" ? 20 : 24}
					className="text-emerald-700 dark:text-emerald-400"
					aria-hidden="true"
				/>
			)}
		</div>
	);
}

