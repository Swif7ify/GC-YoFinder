"use client";
import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
	value: string;
	label: string;
	icon?: React.ReactNode;
	disabled?: boolean;
}

interface CustomSelectProps {
	value: string;
	onValueChange: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

export default function CustomSelect({
	value,
	onValueChange,
	options,
	placeholder = "Select an option",
	className = "",
	disabled = false,
}: CustomSelectProps) {
	return (
		<Select.Root
			value={value}
			onValueChange={onValueChange}
			disabled={disabled}
		>
			<Select.Trigger
				className={`w-full flex items-center justify-between rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-white px-3 py-2  outline-none  disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
			>
				<div className="flex items-center gap-3">
					{options.find((opt) => opt.value === value)?.icon}
					<Select.Value placeholder={placeholder} />
				</div>
				<Select.Icon>
					<ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content className="overflow-hidden bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md z-[60] max-h-64">
					<Select.Viewport className="p-1">
						{options.map((option) => (
							<Select.Item
								key={option.value}
								value={option.value}
								disabled={option.disabled}
								className="relative flex items-center px-3 py-2 text-sm text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700  outline-none cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<div className="flex items-center gap-3">
									{option.icon}
									<Select.ItemText>
										{option.label}
									</Select.ItemText>
								</div>

								<Select.ItemIndicator className="absolute right-2">
									<Check className="h-4 w-4 text-orange-500" />
								</Select.ItemIndicator>
							</Select.Item>
						))}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}
