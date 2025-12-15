"use client";

import { BananaProvider } from "sagingjs";

export function Providers({ children }: { children: React.ReactNode }) {
	return <BananaProvider>{children}</BananaProvider>;
}
