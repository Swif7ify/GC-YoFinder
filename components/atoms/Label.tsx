import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	required?: boolean;
	children: React.ReactNode;
}

export default function Label({
	required = false,
	children,
	className = "",
	...props
}: LabelProps) {
	return (
		<label
			className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${className}`}
			{...props}
		>
			{children}
			{required && <span className="text-red-500 ml-1">*</span>}
		</label>
	);
}

