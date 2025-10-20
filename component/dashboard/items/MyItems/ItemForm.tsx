"use client";

import React, { useState, useRef } from "react";
import {
	Upload,
	MapPin,
	Calendar,
	X,
	Plus,
	Save,
	Loader2,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import { toastError, toastSuccess } from "@/utils/toast";
import CustomSelect from "@/ui/CustomSelect";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ITEM_CATEGORIES, MyItem } from "@/types/types";
import Image from "next/image";
import { motion } from "framer-motion";

interface ItemFormProps {
	item: MyItem;
	onClose: () => void;
	handleUpdate: (formData: FormData) => Promise<void>;
}

export default function ItemForm({
	item,
	onClose,
	handleUpdate,
}: ItemFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [itemType, setItemType] = useState<"lost" | "found">(item.type);
	const [title, setTitle] = useState(item.title);
	const [description, setDescription] = useState(item.description);
	const [location, setLocation] = useState(item.location);
	const [date, setDate] = useState<Dayjs | null>(
		item.dateReported ? dayjs(item.dateReported) : dayjs()
	);
	const [category, setCategory] = useState(item.category);
	const [status, setStatus] = useState<"active" | "claimed" | "removed">(
		item.status
	);
	const [existingImages, setExistingImages] = useState<string[]>(
		item.images || []
	);
	const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
	const allImages = [...existingImages, ...newImagePreviews];

	const [uploadError, setUploadError] = useState<string | null>(null);
	const MAX_IMAGES = 5;
	const MAX_BYTES = 5 * 1024 * 1024; // 5MB

	const categories = ITEM_CATEGORIES;
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const dataURLtoBlob = (dataUrl: string): Blob => {
		const arr = dataUrl.split(",");
		const mimeMatch = arr[0].match(/:(.*?);/);
		const mime = mimeMatch ? mimeMatch[1] : "image/png";
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
	};

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

		const remaining = MAX_IMAGES - allImages.length;
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
				setNewImagePreviews((prev) =>
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
		const existingCount = existingImages.length;

		if (index < existingCount) {
			setExistingImages((prev) => prev.filter((_, i) => i !== index));
		} else {
			const newIndex = index - existingCount;
			setNewImagePreviews((prev) =>
				prev.filter((_, i) => i !== newIndex)
			);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting) return;

		// Validation
		if (!title.trim()) {
			toastError(
				"Validation Error",
				"Please enter a title for the item."
			);
			return;
		}
		if (!description.trim()) {
			toastError("Validation Error", "Please provide a description.");
			return;
		}
		if (!category) {
			toastError("Validation Error", "Please select a category.");
			return;
		}
		if (!location.trim()) {
			toastError("Validation Error", "Please specify a location.");
			return;
		}

		try {
			setIsSubmitting(true);

			const form = new FormData();
			form.append("type", itemType);
			form.append("status", status);
			form.append("title", title.trim());
			form.append("description", description.trim());
			form.append("category", category);
			form.append("location", location.trim());
			form.append(
				"date_lost_or_found",
				date ? date.toISOString() : item.dateReported
			);

			existingImages.forEach((url) => {
				form.append("existing_images", url);
			});

			newImagePreviews.forEach((dataUrl, idx) => {
				const blob = dataURLtoBlob(dataUrl);
				const file = new File([blob], `image_${idx}.png`, {
					type: blob.type,
				});
				form.append("photos", file);
			});

			await handleUpdate(form);

			onClose();
		} catch (error) {
			console.error("Update error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ">
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.8 }}
				className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-3xl  border border-gray-200 dark:border-neutral-800"
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-800">
					<div>
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
							Edit Item
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
							Update the details of your item
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
						aria-label="Close form"
					>
						<X
							size={24}
							className="text-gray-600 dark:text-gray-400"
						/>
					</button>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
				>
					{/* Item Type Selection */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
							Item Type
						</label>
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

					{/* Status Selection */}
					<div>
						<label
							htmlFor="status"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Status
						</label>
						<CustomSelect
							value={status}
							onValueChange={(value) =>
								setStatus(
									value as "active" | "claimed" | "removed"
								)
							}
							options={[
								{ value: "active", label: "Active" },
								{ value: "claimed", label: "Claimed" },
								{ value: "removed", label: "Removed" },
							]}
							placeholder="Select status"
						/>
					</div>

					{/* Title */}
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Item Title <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g., Black leather wallet"
							className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
							required
						/>
					</div>

					{/* Category */}
					<div>
						<label
							htmlFor="category"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Category <span className="text-red-500">*</span>
						</label>
						<CustomSelect
							value={category}
							onValueChange={(value) => setCategory(value)}
							options={categories.map((cat) => ({
								value: cat,
								label: cat,
							}))}
							placeholder="Select a category"
						/>
					</div>

					{/* Description */}
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Description <span className="text-red-500">*</span>
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Provide detailed information about the item..."
							rows={4}
							className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
							required
						/>
					</div>

					{/* Location */}
					<div>
						<label
							htmlFor="location"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Location <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<MapPin
								size={20}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
								aria-hidden="true"
							/>
							<input
								type="text"
								id="location"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder="e.g., Library - 2nd Floor"
								className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
								required
							/>
						</div>
					</div>

					{/* Date */}
					<div>
						<label
							htmlFor="date"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Date {itemType === "lost" ? "Lost" : "Found"}{" "}
							<span className="text-red-500">*</span>
						</label>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								value={date}
								onChange={(newValue) => setDate(newValue)}
								maxDate={dayjs()}
								slotProps={{
									textField: {
										fullWidth: true,
										required: true,
										placeholder: "Select date and time",
										InputProps: {
											startAdornment: (
												<Calendar
													size={20}
													className="mr-2 text-gray-400 dark:text-gray-500"
													aria-hidden="true"
												/>
											),
										},
									},
								}}
							/>
						</LocalizationProvider>
					</div>

					{/* Image Upload */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Item Photos (Optional)
						</label>
						<div className="space-y-3">
							{/* Upload Button */}
							{allImages.length < MAX_IMAGES && (
								<button
									type="button"
									onClick={() =>
										fileInputRef.current?.click()
									}
									className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center justify-center gap-2"
								>
									<Upload
										size={20}
										className="text-gray-400 dark:text-gray-500"
										aria-hidden="true"
									/>
									<span className="text-sm text-gray-600 dark:text-gray-400">
										Click to upload photos (
										{newImagePreviews.length}/{MAX_IMAGES})
									</span>
								</button>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept="image/png,image/jpeg"
								multiple
								onChange={handleImageUpload}
								className="hidden"
								aria-label="Upload item photos"
							/>

							{/* Error Message */}
							{uploadError && (
								<p className="text-xs text-red-600 dark:text-red-400">
									{uploadError}
								</p>
							)}

							{/* Image Previews */}
							{allImages.length > 0 && (
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
									{allImages.map((src, idx) => (
										<div
											key={idx}
											className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group"
										>
											<Image
												src={src}
												alt={`Preview ${idx + 1}`}
												fill
												className="object-cover"
												sizes="(max-width: 640px) 50vw, 33vw"
											/>
											<button
												type="button"
												onClick={() => removeImage(idx)}
												className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
												aria-label={`Remove image ${
													idx + 1
												}`}
											>
												<X size={16} />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</form>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-2.5 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
					>
						Cancel
					</button>
					<button
						type="submit"
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center gap-2"
					>
						{isSubmitting ? (
							<>
								<Loader2
									size={18}
									className="animate-spin"
									aria-hidden="true"
								/>
								Saving...
							</>
						) : (
							<>
								<Save size={18} aria-hidden="true" />
								Save Changes
							</>
						)}
					</button>
				</div>
			</motion.div>
		</div>
	);
}
