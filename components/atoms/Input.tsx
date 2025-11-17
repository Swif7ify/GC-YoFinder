import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
	helperText?: string;
}

export default function Input({
	error = false,
	helperText,
	className = "",
	...props
}: InputProps) {
	return (
		<div className="w-full">
			<input
				className={`w-full px-3 py-2 rounded-lg border ${
					error
						? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
						: "border-gray-300 dark:border-neutral-700 focus:border-emerald-500 focus:ring-emerald-500"
				} bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
				{...props}
			/>
			{helperText && (
				<p className={`mt-1 text-xs ${error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
					{helperText}
				</p>
			)}
		</div>
	);
}

