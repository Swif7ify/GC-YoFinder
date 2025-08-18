"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		router.push("/login");
	}, []);

	return <div></div>;
}
