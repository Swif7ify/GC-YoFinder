"use client";

import React, { useState, useEffect } from "react";
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
	RefreshCwIcon,
} from "lucide-react";
import { api } from "@/lib/api.config";
import { toastError, toastSuccess } from "@/utils/toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type ExportType = "items" | "users" | "activity";
type ExportFormat = "csv" | "json";

interface ExportHistory {
	id: string;
	type: ExportType;
	format: ExportFormat;
	record_count: number;
	status: "success" | "failed";
	error_message?: string;
	admin_name: string;
	created_at: string;
}

const typeLabels: Record<ExportType, string> = {
	items: "Items Data",
	users: "Users Data",
	activity: "Activity Logs",
};

const typeIcons: Record<ExportType, React.ReactNode> = {
	items: <PackageIcon size={16} />,
	users: <UsersIcon size={16} />,
	activity: <ClockIcon size={16} />,
};

export default function ExportPage() {
	const [selectedType, setSelectedType] = useState<ExportType>("items");
	const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
	const [isExporting, setIsExporting] = useState(false);
	const [isLoadingHistory, setIsLoadingHistory] = useState(true);
	const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);

	const fetchHistory = async () => {
		try {
			setIsLoadingHistory(true);
			const response = await api("/api/admin/export/history");
			if (response.status === 200) {
				const data = await response.json();
				setExportHistory(data.history || []);
			}
		} catch (error) {
			console.error("Error fetching export history:", error);
		} finally {
			setIsLoadingHistory(false);
		}
	};

	useEffect(() => {
		fetchHistory();
	}, []);

	const handleExport = async () => {
		setIsExporting(true);
		try {
			const response = await api(`/api/admin/export?type=${selectedType}&format=${selectedFormat}`);

			if (response.status !== 200) {
				const errorData = await response.json();
				toastError("Export Failed", errorData.error || "Failed to export data");
				fetchHistory();
				return;
			}

			const blob = await response.blob();
			const filename = `${selectedType}_export_${new Date().toISOString().split("T")[0]}.${selectedFormat}`;

			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			toastSuccess("Export Complete", `Exported ${typeLabels[selectedType]} as ${selectedFormat.toUpperCase()}`);
			fetchHistory();
		} catch (error) {
			console.error("Export error:", error);
			toastError("Export Failed", "An error occurred while exporting data");
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Data Export</h1>
				<p className="text-sm text-gray-600 dark:text-gray-400">Export system data for backup or reporting</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Export Form */}
				<div className="lg:col-span-2 space-y-4">
					{/* Data Type */}
					<div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-5">
						<h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Data Type</h2>
						<div className="grid grid-cols-3 gap-3">
							{(["items", "users", "activity"] as ExportType[]).map((type) => (
								<button
									key={type}
									type="button"
									onClick={() => setSelectedType(type)}
									className={`p-3 rounded-lg border text-left transition-colors ${
										selectedType === type
											? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
											: "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
									}`}
								>
									<div
										className={`w-8 h-8 rounded-md flex items-center justify-center mb-2 ${
											selectedType === type
												? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
												: "bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400"
										}`}
									>
										{typeIcons[type]}
									</div>
									<p
										className={`text-sm font-medium ${
											selectedType === type
												? "text-emerald-700 dark:text-emerald-300"
												: "text-gray-900 dark:text-gray-100"
										}`}
									>
										{typeLabels[type]}
									</p>
								</button>
							))}
						</div>
					</div>

					{/* Format */}
					<div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-5">
						<h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Format</h2>
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => setSelectedFormat("csv")}
								className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
									selectedFormat === "csv"
										? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
										: "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
								}`}
							>
								<FileSpreadsheetIcon
									size={20}
									className={
										selectedFormat === "csv"
											? "text-emerald-600 dark:text-emerald-400"
											: "text-gray-500 dark:text-gray-400"
									}
								/>
								<div className="text-left">
									<p
										className={`text-sm font-medium ${
											selectedFormat === "csv"
												? "text-emerald-700 dark:text-emerald-300"
												: "text-gray-900 dark:text-gray-100"
										}`}
									>
										CSV
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">Spreadsheet format</p>
								</div>
							</button>
							<button
								type="button"
								onClick={() => setSelectedFormat("json")}
								className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
									selectedFormat === "json"
										? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
										: "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600"
								}`}
							>
								<FileTextIcon
									size={20}
									className={
										selectedFormat === "json"
											? "text-emerald-600 dark:text-emerald-400"
											: "text-gray-500 dark:text-gray-400"
									}
								/>
								<div className="text-left">
									<p
										className={`text-sm font-medium ${
											selectedFormat === "json"
												? "text-emerald-700 dark:text-emerald-300"
												: "text-gray-900 dark:text-gray-100"
										}`}
									>
										JSON
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">Developer format</p>
								</div>
							</button>
						</div>
					</div>

					{/* Export Button */}
					<button
						type="button"
						onClick={handleExport}
						disabled={isExporting}
						className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
					>
						{isExporting ? (
							<>
								<Loader2Icon size={18} className="animate-spin" />
								Exporting...
							</>
						) : (
							<>
								<DownloadIcon size={18} />
								Export {typeLabels[selectedType]}
							</>
						)}
					</button>
				</div>

				{/* Export History */}
				<div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-5">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">Recent Exports</h2>
						<button
							type="button"
							onClick={fetchHistory}
							disabled={isLoadingHistory}
							className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 transition-colors"
							aria-label="Refresh history"
						>
							<RefreshCwIcon size={14} className={isLoadingHistory ? "animate-spin" : ""} />
						</button>
					</div>

					{isLoadingHistory ? (
						<div className="flex items-center justify-center py-8">
							<Loader2Icon size={20} className="animate-spin text-gray-400" />
						</div>
					) : exportHistory.length === 0 ? (
						<div className="text-center py-8">
							<DownloadIcon size={24} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
							<p className="text-xs text-gray-500 dark:text-gray-400">No exports yet</p>
						</div>
					) : (
						<div className="space-y-2">
							{exportHistory.map((item) => (
								<div
									key={item.id}
									className="flex items-start gap-2.5 p-2.5 rounded-md bg-gray-50 dark:bg-neutral-800"
								>
									{item.status === "success" ? (
										<CheckCircleIcon size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
									) : (
										<AlertCircleIcon size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
									)}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-1.5">
											<span className="text-gray-500 dark:text-gray-400">
												{typeIcons[item.type]}
											</span>
											<p className="text-xs font-medium text-gray-900 dark:text-gray-100">
												{typeLabels[item.type]}
											</p>
										</div>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
											{item.format.toUpperCase()} • {item.record_count} records
										</p>
										<p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
											{dayjs(item.created_at).fromNow()}
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
