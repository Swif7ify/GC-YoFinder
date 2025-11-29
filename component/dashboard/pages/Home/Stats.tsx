import { TrendingUp } from "lucide-react";
import { StatsCard } from "@/types/types";

interface StatsProps {
	stats: StatsCard[];
}

export default function Stats({ stats }: StatsProps) {
	return (
		<section aria-labelledby="stats-heading">
			<h2 id="stats-heading" className="sr-only">
				Dashboard Statistics
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<article
							key={index}
							className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6 transition-all hover:shadow-md"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
										{stat.label}
									</p>
									<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
										{stat.value}
									</p>
									<p
										className={`text-xs mt-2 flex items-center gap-1 ${
											stat.trend === "up"
												? "text-emerald-600 dark:text-emerald-400"
												: "text-gray-500 dark:text-gray-400"
										}`}
									>
										{stat.trend === "up" && (
											<TrendingUp
												size={14}
												aria-hidden="true"
											/>
										)}
										{stat.change}
									</p>
								</div>
								<div
									className={`${stat.bgColor} p-3 rounded-lg`}
								>
									{" "}
									<Icon
										size={24}
										className={stat.iconColor}
										aria-hidden="true"
									/>
								</div>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
}
