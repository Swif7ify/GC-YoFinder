"use client";

import { useEffect, useCallback } from "react";
import { usePusher } from "@/contexts/PusherProvider";

type EventHandler = (data: unknown) => void;

interface UsePusherEventsOptions {
	channelName: string;
	events: Record<string, EventHandler>;
	enabled?: boolean;
}

export function usePusherEvents({ channelName, events, enabled = true }: UsePusherEventsOptions) {
	const { subscribe, unsubscribe, isConnected } = usePusher();

	useEffect(() => {
		if (!enabled || !isConnected) return;

		const channel = subscribe(channelName);
		if (!channel) return;

		// Bind all events
		Object.entries(events).forEach(([eventName, handler]) => {
			channel.bind(eventName, handler);
		});

		return () => {
			// Unbind all events
			Object.entries(events).forEach(([eventName, handler]) => {
				channel.unbind(eventName, handler);
			});
		};
	}, [channelName, events, enabled, isConnected, subscribe]);

	return { isConnected };
}

// Hook for user-specific real-time updates
export function useUserPusherEvents(userID: string | null, events: Record<string, EventHandler>) {
	return usePusherEvents({
		channelName: `private-user-${userID}`,
		events,
		enabled: !!userID,
	});
}

// Hook for admin dashboard updates
export function useAdminPusherEvents(events: Record<string, EventHandler>) {
	return usePusherEvents({
		channelName: "admin-updates",
		events,
		enabled: true,
	});
}

// Hook for conversation real-time messages
export function useConversationPusherEvents(conversationID: string | null, events: Record<string, EventHandler>) {
	return usePusherEvents({
		channelName: `conversation-${conversationID}`,
		events,
		enabled: !!conversationID,
	});
}
