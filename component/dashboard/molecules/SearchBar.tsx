"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search...", className = "" }: SearchBarProps) {
	return (
		<div className={`relative ${className}`}>
			<Search
				size={20}
				className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
				aria-hidden="true"
			/>
			<input
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
				aria-label={placeholder}
			/>
		</div>
	);
}
