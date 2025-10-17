"use client";
import { useLoading } from "@/contexts/LoadingManager";
import { useCallback } from "react";

export const useApiLoading = () => {
	const { startLoading, stopLoading } = useLoading();

	const withLoading = useCallback(
		async <T>(apiCall: () => Promise<T>): Promise<T> => {
			try {
				startLoading();
				const result = await apiCall();
				return result;
			} finally {
				stopLoading();
			}
		},
		[startLoading, stopLoading]
	);

	return { withLoading };
};
