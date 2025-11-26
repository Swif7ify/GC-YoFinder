import React from "react";
import { StatsCard } from "../molecules";
import { StatsCard as StatsCardType } from "@/types/types";

interface StatsGridProps {
	stats: StatsCardType[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
	return (
		<section aria-labelledby="stats-heading">
			<h2 id="stats-heading" className="sr-only">
				Dashboard Statistics
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat, index) => (
					<StatsCard
						key={index}
						label={stat.label}
						value={stat.value}
						change={stat.change}
						trend={stat.trend}
						icon={stat.icon}
						iconColor={stat.iconColor}
						bgColor={stat.bgColor}
					/>
				))}
			</div>
		</section>
	);
}

