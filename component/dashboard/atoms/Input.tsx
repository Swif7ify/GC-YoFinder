"use client";

import React from "react";

interface InputProps {
	id?: string;
	name?: string;
	type?: "text" | "email" | "password" | "search" | "tel" | "number";
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	label?: string;
	required?: boolean;
	disabled?: boolean;
	icon?: React.ReactNode;
	className?: string;
	maxLength?: number;
	pattern?: string;
	autoComplete?: string;
}

export default function Input({
	id,
	name,
	type = "text",
	value,
	onChange,
	placeholder,
	label,
	required = false,
	disabled = false,
	icon,
	className = "",
	maxLength,
	pattern,
	autoComplete,
}: InputProps) {
	return (
		<div className={className}>
			{label && (
				<label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}
			<div className="relative">
				{icon && (
					<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
						{icon}
					</span>
				)}
				<input
					id={id}
					name={name}
					type={type}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					required={required}
					disabled={disabled}
					maxLength={maxLength}
					pattern={pattern}
					autoComplete={autoComplete}
					className={`w-full ${
						icon ? "pl-10" : "px-4"
					} pr-4 py-2.5 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-50 dark:disabled:bg-neutral-800/30 disabled:cursor-not-allowed`}
				/>
			</div>
		</div>
	);
}
