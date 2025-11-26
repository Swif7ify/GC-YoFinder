import React from "react";
import { Input } from "../atoms";
import { Label } from "../atoms";

interface FormFieldProps {
	label: string;
	name: string;
	required?: boolean;
	error?: boolean;
	helperText?: string;
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export default function FormField({
	label,
	name,
	required = false,
	error = false,
	helperText,
	inputProps,
}: FormFieldProps) {
	return (
		<div className="w-full">
			<Label htmlFor={name} required={required}>
				{label}
			</Label>
			<Input
				id={name}
				name={name}
				error={error}
				helperText={helperText}
				{...inputProps}
			/>
		</div>
	);
}

