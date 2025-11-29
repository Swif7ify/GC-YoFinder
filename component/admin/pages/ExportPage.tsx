"use client";

import React, { useState } from "react";
import {
	DownloadIcon,
	FileSpreadsheetIcon,
	FileTextIcon,
	PackageIcon,
	UsersIcon,
	ClockIcon,
	CheckCircleIcon,
	AlertCircleIcon,
	Loader2Icon,
} from "lucide-react";
import { api } from "@/lib/api.config";
import { toastError, toastSuccess } from "@/utils/toast";

type ExportType = "items" | "users" | "activity";
type ExportFormat = "csv" | "json";

interface ExportOption {
	id: ExportType;
	title: string;
	description: string;
	icon: React.ReactNode;
}

const exportOptions: ExportOption[] = [
	{
		id: "items",
		title: "Items Data",
		description: "Export all lost and found items with details, status, and metadata",
		icon: <PackageIcon size={24} />,
	},
	{
		id: "users",
		title: "Users Data",
		description: "Export user accounts with registration info (excludes passwords)",
		icon: <UsersIcon size={24} />,
	},
	{
		id: "activity",
		title: "Activity Logs",
		description: "Export system activity and audit logs",
		icon: <ClockIcon size={24} />,
	},
];

export default function ExportPage() {
	const [selectedType, setSelectedType] = useState<ExportType>("items");
	const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
	const [isExporting, setIsExporting] = useState(false);
	const [exportHistory, setExportHistory] = useState<
		{ type: ExportType; format: ExportFormat; date: string; status: "success" | "failed" }[]
	>([]);

	const handleExport = async () => {
		setIsExporting(true);
		try {
			const response = await api(`/api/admin/export?type=${selectedType}&format=${selectedFormat}`);

			if (response.status !== 200) {
				const errorData = await response.json();
				toastError("Export Failed", errorData.error || "Failed to export data");
				setExportHistory((prev) => [
					{ type: selectedType, format: selectedFormat, date: new Date().toLocaleString(), status: "failed" },
					...prev.slice(0, 9),
				]);
				return;
			}

			// Get the blob data
			const blob = await response.blob();
			const filename = `${selectedType}_export_${new Date().toISOString().split("T")[0]}.${selectedFormat}`;

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			toastSuccess(
				"Export Complete",
				`${selectedType} data exported successfully as ${selectedFormat.toUpperCase()}`
			);
			setExportHistory((prev) => [
				{ type: selectedType, format: selectedFormat, date: new Date().toLocaleString(), status: "success" },
				...prev.slice(0, 9),
			]);
		} catch (error) {
			console.error("Export error:", error);
			toastError("Export Failed", "An error occurred while exporting data");
			setExportHistory((prev) => [
				{ type: selectedType, format: selectedFormat, date: new Date().toLocaleString(), status: "failed" },
				...prev.slice(0, 9),
			]);
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Data Export</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Export system data for backup, reporting, or analysis purposes
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Export Options */}
				<div className="lg:col-span-2 space-y-6">
					{/* Data Type Selection */}
					<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
							Select Data to Export
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{exportOptions.map((option) => (
								<button
									key={option.id}
									type="button"
									onClick={() => setSelectedType(option.id)}
									className={`p-4 rounded-lg border-2 transition-all text-left ${
										selectedType === option.id
											? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
											: "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
									}`}
								>
									<div
										className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
											selectedType === option.id
												? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
												: "bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400"
										}`}
									>
										{option.icon}
									</div>
									<h3
										className={`font-medium mb-1 ${
											selectedType === option.id
												? "text-emerald-700 dark:text-emerald-300"
												: "text-gray-900 dark:text-gray-100"
										}`}
									>
										{option.title}
									</h3>
									<p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
								</button>
							))}
						</div>
					</div>

					{/* Format Selection */}
					<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Export Format</h2>
						<div className="flex gap-4">
							<button
								type="button"
								onClick={() => setSelectedFormat("csv")}
								className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
									selectedFormat === "csv"
										? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
										: "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
								}`}
							>
								<FileSpreadsheetIcon
									size={24}
									className={
										selectedFormat === "csv"
											? "text-emerald-600 dark:text-emerald-400"
											: "text-gray-500 dark:text-gray-400"
									}
								/>
								<div className="text-left">
									<h3
										className={`font-medium ${
											selectedFormat === "csv"
												? "text-emerald-700 dark:text-emerald-300"
												: "text-gray-900 dark:text-gray-100"
										}`}
									>
										CSV
									</h3>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Spreadsheet compatible format
									</p>
								</div>
							</button>
							<button
								type="button"
								onClick={() => setSelectedFormat("json")}
								className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
									selectedFormat === "json"
										? "border-emerald-500 bg-emerald-900/20"
										: "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
								}`}
							>
								<FileTextIcon
									size={24}
									className={
										selectedFormat === "json"
											? "text-emerald-600 dark:text-emerald-400"
											: "text-gray-500 dark:text-gray-400"
									}
								/>
								<div className="text-left">
									<h3
										className={`font-medium ${
											selectedFormat === "json"
												? "text-emerald-700 dark:text-emerald-300"
												: "text-gray-900 dark:text-gray-100"
										}`}
									>
										JSON
									</h3>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Developer-friendly format
									</p>
								</div>
							</button>
						</div>
					</div>

					{/* Export Button */}
					<button
						type="button"
						onClick={handleExport}
						disabled={isExporting}
						className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
					>
						{isExporting ? (
							<>
								<Loader2Icon size={20} className="animate-spin" />
								Exporting...
							</>
						) : (
							<>
								<DownloadIcon size={20} />
								Export {exportOptions.find((o) => o.id === selectedType)?.title} as{" "}
								{selectedFormat.toUpperCase()}
							</>
						)}
					</button>
				</div>

				{/* Export History */}
				<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Exports</h2>
					{exportHistory.length === 0 ? (
						<div className="text-center py-8">
							<DownloadIcon size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
							<p className="text-sm text-gray-500 dark:text-gray-400">No exports yet</p>
							<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
								Your export history will appear here
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{exportHistory.map((item, index) => (
								<div
									key={index}
									className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800"
								>
									{item.status === "success" ? (
										<CheckCircleIcon size={18} className="text-emerald-500 flex-shrink-0" />
									) : (
										<AlertCircleIcon size={18} className="text-red-500 flex-shrink-0" />
									)}
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
											{exportOptions.find((o) => o.id === item.type)?.title}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{item.format.toUpperCase()} • {item.date}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
