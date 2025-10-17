"use client";

import React, { useState, useRef } from "react";
import {
	Upload,
	MapPin,
	Calendar,
	AlertCircle,
	CheckCircle2,
	Info,
	X,
	Plus,
} from "lucide-react";
import { toastError } from "@/utils/toast";
import CustomSelect from "@/ui/CustomSelect";

import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";

export default function NewItemComponent() {
	const [itemType, setItemType] = useState<"lost" | "found">("lost");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [date, setDate] = useState<Dayjs | null>(dayjs());
	const [category, setCategory] = useState("");
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const MAX_IMAGES = 5;
	const MAX_BYTES = 5 * 1024 * 1024; // 5MB

	const categories = [
		"Electronics",
		"Personal Items",
		"Bags & Accessories",
		"Books & Supplies",
		"Clothing",
		"Keys & Cards",
		"Sports Equipment",
		"Other",
	];

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;

		const allowed = new Set(["image/png", "image/jpeg"]);
		let skipped = 0;
		const acceptedFiles: File[] = [];

		for (const f of files) {
			if (!allowed.has(f.type) || f.size > MAX_BYTES) {
				skipped++;
				continue;
			}
			acceptedFiles.push(f);
		}

		if (!acceptedFiles.length) {
			setUploadError(
				"Files must be PNG or JPEG and must not exceed 5 MB."
			);
			toastError(
				"Image Upload Failed",
				"All selected files were invalid. Please upload PNG or JPEG files not exceeding 5 MB."
			);
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}

		const remaining = MAX_IMAGES - imagePreviews.length;
		const toAdd = acceptedFiles.slice(0, remaining);

		const readers = toAdd.map(
			(file) =>
				new Promise<string | null>((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result as string);
					reader.onerror = () => resolve(null);
					reader.readAsDataURL(file);
				})
		);

		Promise.all(readers).then((results) => {
			const urls = results.filter(Boolean) as string[];
			if (urls.length) {
				setImagePreviews((prev) =>
					[...prev, ...urls].slice(0, MAX_IMAGES)
				);
				setUploadError(
					skipped
						? `${skipped} file(s) skipped: only PNG/JPEG ≤ 5MB allowed`
						: null
				);
			}
			if (fileInputRef.current) fileInputRef.current.value = "";
		});
	};

	const removeImage = (index: number) => {
		setImagePreviews((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement submit logic
		console.log({
			itemType,
			title,
			description,
			location,
			date,
			category,
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<section aria-labelledby="new-item-heading">
				<h1
					id="new-item-heading"
					className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
				>
					Report an Item
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Help reunite lost items with their owners or claim found
					items
				</p>
			</section>

			{/* Info Banner */}
			<div
				className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3"
				role="alert"
				aria-live="polite"
			>
				<Info
					size={20}
					className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
					aria-hidden="true"
				/>
				<div className="flex-1">
					<p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
						Tips for better matches
					</p>
					<p className="text-xs text-blue-800 dark:text-blue-200">
						Provide detailed descriptions, clear photos, and
						accurate location information to help others identify
						your item.
					</p>
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Item Type Selection */}
				<div
					aria-labelledby="item-type-heading"
					className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
				>
					<h2
						id="item-type-heading"
						className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
					>
						What would you like to report?
					</h2>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<button
							type="button"
							onClick={() => setItemType("lost")}
							className={`p-6 rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
								itemType === "lost"
									? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20"
									: "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 "
							}`}
							aria-pressed={itemType === "lost"}
						>
							<div className="flex flex-col items-center gap-3">
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center ${
										itemType === "lost"
											? "bg-red-100 dark:bg-red-900/40"
											: "bg-gray-100 dark:bg-gray-700"
									}`}
								>
									<AlertCircle
										size={24}
										className={
											itemType === "lost"
												? "text-red-600 dark:text-red-400"
												: "text-gray-400 dark:text-gray-500"
										}
										aria-hidden="true"
									/>
								</div>
								<div className="text-center">
									<p
										className={`font-semibold ${
											itemType === "lost"
												? "text-red-700 dark:text-red-300"
												: "text-gray-700 dark:text-gray-300"
										}`}
									>
										Lost Item
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
										I lost something
									</p>
								</div>
							</div>
						</button>

						<button
							type="button"
							onClick={() => setItemType("found")}
							className={`p-6 rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
								itemType === "found"
									? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20"
									: "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 "
							}`}
							aria-pressed={itemType === "found"}
						>
							<div className="flex flex-col items-center gap-3">
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center ${
										itemType === "found"
											? "bg-green-100 dark:bg-green-900/40"
											: "bg-gray-100 dark:bg-gray-700"
									}`}
								>
									<CheckCircle2
										size={24}
										className={
											itemType === "found"
												? "text-green-600 dark:text-green-400"
												: "text-gray-400 dark:text-gray-500"
										}
										aria-hidden="true"
									/>
								</div>
								<div className="text-center">
									<p
										className={`font-semibold ${
											itemType === "found"
												? "text-green-700 dark:text-green-300"
												: "text-gray-700 dark:text-gray-300"
										}`}
									>
										Found Item
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
										I found something
									</p>
								</div>
							</div>
						</button>
					</div>
				</div>

				{/* Item Details */}
				<div
					aria-labelledby="item-details-heading"
					className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
				>
					<h2
						id="item-details-heading"
						className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
					>
						Item Details
					</h2>

					<div className="space-y-4">
						{/* Title */}
						<div>
							<label
								htmlFor="item-title"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Item Title{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								id="item-title"
								type="text"
								required
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="e.g., Black Laptop Bag"
								className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700  rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
							/>
						</div>

						{/* Category */}
						<div>
							<label
								htmlFor="item-category"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Category <span className="text-red-500">*</span>
							</label>
							<CustomSelect
								value={category}
								onValueChange={(value) => setCategory(value)}
								placeholder="Select a Category"
								options={categories.map((cat) => ({
									value: cat,
									label: cat,
								}))}
							/>
						</div>

						{/* Description */}
						<div>
							<label
								htmlFor="item-description"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Description{" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								id="item-description"
								required
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={4}
								placeholder="Provide detailed description (color, brand, distinctive features, etc.)"
								className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700  rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
							/>
						</div>

						{/* Location */}
						<div>
							<label
								htmlFor="item-location"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								<MapPin
									size={16}
									className="inline mr-1"
									aria-hidden="true"
								/>
								Location <span className="text-red-500">*</span>
							</label>
							<input
								id="item-location"
								type="text"
								required
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder="e.g., Library 2nd Floor, near entrance"
								className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700  rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
							/>
						</div>

						{/* Date */}
						<div>
							<label
								htmlFor="item-date"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								<Calendar
									size={16}
									className="inline mr-1"
									aria-hidden="true"
								/>
								Date {itemType === "lost" ? "Lost" : "Found"}{" "}
								<span className="text-red-500">*</span>
							</label>

							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
									aria-label={`Select date and time the item was ${
										itemType === "lost" ? "lost" : "found"
									}`}
									value={date}
									onChange={(newValue: Dayjs | null) =>
										setDate(newValue)
									}
									slotProps={{
										textField: {
											id: "item-date",
											required: true,
											size: "small",
											className:
												"w-full bg-white dark:bg-neutral-800/50 rounded-md",
										},
									}}
								/>
							</LocalizationProvider>
						</div>
					</div>
				</div>

				{/* Image Upload */}
				<div
					aria-labelledby="image-upload-heading"
					className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
				>
					<h2
						id="image-upload-heading"
						className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
					>
						Upload Images up to {MAX_IMAGES}
					</h2>

					<div className="space-y-3">
						{/* Thumbnails + inline plus tile */}
						{imagePreviews.length > 0 ? (
							<div className="flex items-start gap-3">
								<div className="grid grid-cols-3 sm:grid-cols-5 gap-3 flex-1">
									{imagePreviews.map((src, idx) => (
										<div
											key={idx}
											className="relative rounded-md overflow-hidden border border-gray-200 dark:border-neutral-800"
										>
											<img
												src={src}
												alt={`Preview ${idx + 1}`}
												className="w-full h-20 object-cover"
											/>
											<button
												type="button"
												onClick={() => removeImage(idx)}
												className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
												aria-label={`Remove image ${
													idx + 1
												}`}
											>
												<X
													size={14}
													aria-hidden="true"
												/>
											</button>
										</div>
									))}
								</div>

								{/* plus button placed to the right of thumbnails */}
								{imagePreviews.length < MAX_IMAGES && (
									<div className="flex-shrink-0">
										<button
											type="button"
											onClick={() =>
												fileInputRef.current?.click()
											}
											className="w-20 h-20 flex items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/30 hover:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
											aria-label="Add more photos"
										>
											<Plus
												size={20}
												className="text-gray-500 dark:text-gray-400"
												aria-hidden="true"
											/>
										</button>
									</div>
								)}

								{/* hidden input (shared) */}
								<input
									ref={fileInputRef}
									id="image-upload"
									type="file"
									accept="image/png,image/jpeg"
									multiple
									className="hidden"
									onChange={handleImageUpload}
									aria-describedby="image-upload-help"
								/>
							</div>
						) : (
							/* placeholder when no previews */
							<label
								htmlFor="image-upload"
								className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors focus-within:ring-2 focus-within:ring-emerald-500"
							>
								<div className="flex flex-col items-center justify-center pt-2 pb-2">
									<Upload
										size={28}
										className="text-gray-400 dark:text-gray-500 mb-2"
										aria-hidden="true"
									/>
									<p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
										Click to add photos or drag & drop
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-500">
										PNG, JPG, JPEG — up to {MAX_IMAGES}{" "}
										photos
									</p>
								</div>
								<input
									ref={fileInputRef}
									id="image-upload"
									type="file"
									accept="image/png,image/jpeg"
									multiple
									className="hidden"
									onChange={handleImageUpload}
									aria-describedby="image-upload-help"
								/>
							</label>
						)}

						{uploadError && (
							<p
								className="text-sm text-red-600 dark:text-red-400"
								role="status"
								aria-live="polite"
							>
								{uploadError}
							</p>
						)}

						<p
							id="image-upload-help"
							className="text-xs text-gray-500 dark:text-gray-400"
						>
							{imagePreviews.length}/{MAX_IMAGES} uploaded
						</p>
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end gap-4">
					<button
						type="button"
						className="px-6 py-2.5 border border-gray-300 dark:border-neutral-700  rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
					>
						Submit Report
					</button>
				</div>
			</form>
		</div>
	);
}
