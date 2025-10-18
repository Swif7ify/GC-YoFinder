"use client";
import React, { useState } from "react";
import {
	Camera,
	Eye,
	X,
	ChevronLeft,
	ChevronRight,
	Download,
	ExternalLink,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

import { CloudinaryImagePreviewProps } from "@/types/types";

export default function CloudinaryImagePreview({
	images,
	className = "",
	gridCols = "3",
	aspectRatio = "square",
	showCount = true,
	allowDownload = false,
	children,
}: CloudinaryImagePreviewProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null
	);
	const [imageError, setImageError] = useState<Set<number>>(new Set());

	const handleImageError = (index: number) => {
		setImageError((prev) => new Set([...prev, index]));
	};

	const handlePrevious = () => {
		if (selectedImageIndex === null) return;
		setSelectedImageIndex(
			selectedImageIndex === 0
				? images.length - 1
				: selectedImageIndex - 1
		);
	};

	const handleNext = () => {
		if (selectedImageIndex === null) return;
		setSelectedImageIndex(
			selectedImageIndex === images.length - 1
				? 0
				: selectedImageIndex + 1
		);
	};

	const handleDownload = async (imageUrl: string, index: number) => {
		try {
			// Show loading state (optional)
			const button = document.querySelector(
				`[data-download-index="${index}"]`
			) as HTMLButtonElement;
			if (button) {
				button.disabled = true;
				button.innerHTML =
					'<div class="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>';
			}

			// Fetch the image as blob
			const response = await fetch(imageUrl);
			if (!response.ok) throw new Error("Failed to fetch image");

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);

			// Create download link
			const link = document.createElement("a");
			link.href = url;
			link.download = `evidence-${index + 1}.${getFileExtension(
				imageUrl
			)}`;
			document.body.appendChild(link);
			link.click();

			// Cleanup
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			// Reset button state
			if (button) {
				button.disabled = false;
				button.innerHTML =
					'<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
			}
		} catch (error) {
			console.error("Download failed:", error);
			// Fallback to opening in new tab
			window.open(imageUrl, "_blank");
		}
	};

	// Helper function to get file extension
	const getFileExtension = (url: string): string => {
		const match = url.match(/\.([^.?]+)(\?|$)/);
		return match ? match[1] : "jpg";
	};

	const getGridClass = () => {
		switch (gridCols) {
			case "2":
				return "grid-cols-2";
			case "3":
				return "grid-cols-2 md:grid-cols-3";
			case "4":
				return "grid-cols-2 md:grid-cols-4";
			case "6":
				return "grid-cols-3 md:grid-cols-6";
			default:
				return "grid-cols-2 md:grid-cols-3";
		}
	};

	const getAspectClass = () => {
		switch (aspectRatio) {
			case "square":
				return "aspect-square";
			case "video":
				return "aspect-video";
			case "auto":
				return "aspect-auto";
			default:
				return "aspect-square";
		}
	};

	if (!images || images.length === 0) {
		return children || null;
	}

	return (
		<>
			<div className={className}>
				{showCount && (
					<div className="flex items-center gap-2 mb-3">
						<Camera className="h-4 w-4 text-gray-500 dark:text-gray-400" />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{images.length} image
							{images.length !== 1 ? "s" : ""}
						</span>
					</div>
				)}

				<div className={`grid gap-3 ${getGridClass()}`}>
					{images.map((imageUrl, index) => (
						<motion.div
							key={index}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className={`relative ${getAspectClass()} bg-gray-100 dark:bg-neutral-800 rounded-lg overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-200`}
							onClick={() => setSelectedImageIndex(index)}
						>
							{imageError.has(index) ? (
								<div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
									<Camera className="h-8 w-8 mb-2" />
									<p className="text-xs text-center px-2">
										Image unavailable
									</p>
								</div>
							) : (
								<>
									<img
										src={imageUrl}
										alt={`Image ${index + 1}`}
										className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
										onError={() => handleImageError(index)}
										loading="lazy"
									/>
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
										<Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
									</div>
									{images.length > 1 && (
										<div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
											{index + 1}/{images.length}
										</div>
									)}
								</>
							)}
						</motion.div>
					))}
				</div>
			</div>

			{/* Modal */}
			<Dialog.Root
				open={selectedImageIndex !== null}
				onOpenChange={() => setSelectedImageIndex(null)}
			>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm" />
					<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] max-w-7xl max-h-[95vh] w-[95vw] outline-none">
						{/* Add Dialog.Title here */}
						<Dialog.Title className="sr-only">
							Image{" "}
							{selectedImageIndex !== null
								? selectedImageIndex + 1
								: 1}{" "}
							of {images.length}
						</Dialog.Title>

						<AnimatePresence mode="wait">
							{selectedImageIndex !== null && (
								<motion.div
									key={selectedImageIndex}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.2 }}
									className="relative bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden"
								>
									{/* Header */}
									<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm">
										<div className="flex items-center gap-3">
											<Camera className="h-5 w-5 text-gray-500 dark:text-gray-400" />
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												Image {selectedImageIndex + 1}{" "}
												of {images.length}
											</h3>
										</div>
										<div className="flex items-center gap-2">
											{allowDownload && (
												<button
													data-download-index={
														selectedImageIndex
													}
													onClick={() =>
														handleDownload(
															images[
																selectedImageIndex
															],
															selectedImageIndex
														)
													}
													className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
													title="Download image"
												>
													<Download className="h-5 w-5 text-gray-500 dark:text-gray-400" />
												</button>
											)}
											<button
												onClick={() =>
													window.open(
														images[
															selectedImageIndex
														],
														"_blank"
													)
												}
												className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
												title="Open in new tab"
											>
												<ExternalLink className="h-5 w-5 text-gray-500 dark:text-gray-400" />
											</button>
											<Dialog.Close asChild>
												<button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
													<X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
												</button>
											</Dialog.Close>
										</div>
									</div>

									{/* Image Container */}
									<div className="relative max-h-[80vh] overflow-hidden">
										<img
											src={images[selectedImageIndex]}
											alt={`Image ${
												selectedImageIndex + 1
											}`}
											className="w-full h-full object-contain max-h-[80vh]"
										/>

										{/* Navigation Buttons */}
										{images.length > 1 && (
											<>
												<button
													onClick={handlePrevious}
													className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
													title="Previous image"
												>
													<ChevronLeft className="h-6 w-6" />
												</button>
												<button
													onClick={handleNext}
													className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
													title="Next image"
												>
													<ChevronRight className="h-6 w-6" />
												</button>
											</>
										)}
									</div>

									{/* Thumbnail Strip */}
									{images.length > 1 && (
										<div className="p-4 bg-gray-50 dark:bg-neutral-800 border-t border-gray-200 dark:border-gray-700">
											<div className="flex gap-2 overflow-x-auto pb-2">
												{images.map((img, idx) => (
													<button
														key={idx}
														onClick={() =>
															setSelectedImageIndex(
																idx
															)
														}
														className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
															idx ===
															selectedImageIndex
																? "border-orange-500 ring-2 ring-orange-200 dark:ring-orange-800"
																: "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
														}`}
													>
														<img
															src={img}
															alt={`Thumbnail ${
																idx + 1
															}`}
															className="w-full h-full object-cover"
														/>
													</button>
												))}
											</div>
										</div>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
}
