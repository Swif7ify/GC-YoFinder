"use client";
import React, { createContext, useContext, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ConfirmOptions = {
	title?: string;
	description?: string;
	variant?: "default" | "danger";
	confirmText?: string;
	cancelText?: string;
};

type ConfirmFn = (opts?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [opts, setOpts] = useState<ConfirmOptions>({});
	const resolverRef = useRef<(value: boolean) => void | null>(null);

	const confirm: ConfirmFn = (options = {}) => {
		setOpts(options);
		setOpen(true);
		return new Promise<boolean>((resolve) => {
			resolverRef.current = resolve;
		});
	};

	const close = (result: boolean) => {
		setOpen(false);
		// resolve promise
		resolverRef.current?.(result);
		resolverRef.current = null;
	};

	const confirmButtonClasses =
		opts.variant === "danger"
			? "px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
			: "px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900";

	return (
		<ConfirmContext.Provider value={confirm}>
			{children}
			<AnimatePresence>
				{open && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={() => close(false)}
							className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
							aria-hidden="true"
						/>

						{/* Dialog */}
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 20 }}
								transition={{
									duration: 0.2,
									ease: [0.16, 1, 0.3, 1],
								}}
								role="dialog"
								aria-modal="true"
								aria-labelledby="confirm-title"
								aria-describedby="confirm-description"
								className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-lg shadow-2xl border border-gray-200 dark:border-neutral-800 pointer-events-auto"
							>
								{/* Header */}
								<div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
									<h3
										id="confirm-title"
										className="text-lg font-semibold text-gray-900 dark:text-gray-100"
									>
										{opts.title ?? "Confirm"}
									</h3>
								</div>

								{/* Content */}
								<div className="p-6">
									<p
										id="confirm-description"
										className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
									>
										{opts.description ??
											"Are you sure you want to continue?"}
									</p>

									{/* Actions */}
									<div className="mt-6 flex justify-end gap-3">
										<button
											onClick={() => close(false)}
											className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
										>
											{opts.cancelText ?? "Cancel"}
										</button>
										<button
											onClick={() => close(true)}
											className={confirmButtonClasses}
										>
											{opts.confirmText ?? "Confirm"}
										</button>
									</div>
								</div>
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>
		</ConfirmContext.Provider>
	);
}

export function useConfirm(): ConfirmFn {
	const ctx = useContext(ConfirmContext);
	if (!ctx)
		throw new Error("useConfirm must be used within a ConfirmProvider");
	return ctx;
}
