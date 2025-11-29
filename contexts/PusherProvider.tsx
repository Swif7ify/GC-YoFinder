"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
} from "react";
import Pusher, { type Channel } from "pusher-js";

interface PusherContextType {
	pusher: Pusher | null;
	isConnected: boolean;
	subscribe: (channelName: string) => Channel | null;
	unsubscribe: (channelName: string) => void;
}

const PusherContext = createContext<PusherContextType>({
	pusher: null,
	isConnected: false,
	subscribe: () => null,
	unsubscribe: () => {},
});

export function usePusher() {
	return useContext(PusherContext);
}

interface PusherProviderProps {
	children: React.ReactNode;
}

export function PusherProvider({ children }: PusherProviderProps) {
	const pusherRef = useRef<Pusher | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const channelsRef = useRef<Map<string, Channel>>(new Map());

	useEffect(() => {
		const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
		const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1";

		if (!pusherKey) {
			console.warn("Pusher key not configured");
			return;
		}

		const pusher = new Pusher(pusherKey, {
			cluster: pusherCluster,
			authEndpoint: "/api/pusher/auth",
		});

		pusher.connection.bind("connected", () => {
			setIsConnected(true);
			console.log("Pusher connected");
		});

		pusher.connection.bind("disconnected", () => {
			setIsConnected(false);
			console.log("Pusher disconnected");
		});

		pusher.connection.bind("error", (err: unknown) => {
			console.error("Pusher connection error:", err);
		});

		pusherRef.current = pusher;

		return () => {
			channelsRef.current.forEach((_, channelName) => {
				pusher.unsubscribe(channelName);
			});
			channelsRef.current.clear();
			pusher.disconnect();
		};
	}, []);

	const subscribe = useCallback((channelName: string) => {
		if (!pusherRef.current) return null;

		if (channelsRef.current.has(channelName)) {
			return channelsRef.current.get(channelName) ?? null;
		}

		const channel = pusherRef.current.subscribe(channelName);
		channelsRef.current.set(channelName, channel);
		return channel;
	}, []);

	const unsubscribe = useCallback((channelName: string) => {
		if (!pusherRef.current) return;

		if (channelsRef.current.has(channelName)) {
			pusherRef.current.unsubscribe(channelName);
			channelsRef.current.delete(channelName);
		}
	}, []);

	return (
		<PusherContext.Provider
			value={{
				pusher: pusherRef.current,
				isConnected,
				subscribe,
				unsubscribe,
			}}
		>
			{children}
		</PusherContext.Provider>
	);
}
