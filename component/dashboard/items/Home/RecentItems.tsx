import Link from "next/link";
import { RecentItems } from "@/types/types";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface QuickActionsProps {
	recentItems_n: RecentItems[];
}

export default function RecentItemsComponent({
	recentItems_n,
}: QuickActionsProps) {
	return (
		<section
			aria-labelledby="recent-items-heading"
			className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
		>
			<div className="flex items-center justify-between mb-4">
				<h2
					id="recent-items-heading"
					className="text-lg font-semibold text-gray-900 dark:text-gray-100"
				>
					Recent Items
				</h2>
				<Link
					href="/dashboard?tab=my-items"
					className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-2 py-1"
				>
					View All
				</Link>
			</div>
			<ul className="space-y-3 h-full" role="list">
				{recentItems_n.map((item) => (
					<Link
						href={`/dashboard?tab=search-items&item=${item.title}`}
						key={item.id}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
					>
						<div className="flex items-center justify-center">
							<Image
								src={
									item.image_url ||
									"https://images.unsplash.com/photo-1654965778976-409444e9826b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGl0ZW1zJTIwcGxhY2Vob2xkZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
								}
								width={40}
								height={40}
								alt={item.title}
								className="w-24 h-24 rounded-lg  flex items-center"
								quality={100}
							/>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
								{item.title}
							</p>
							<p className="text-md text-gray-600 dark:text-gray-400 mt-1 truncate mb-1">
								{item.description}
							</p>

							<div className="flex items-center gap-4 mt-1">
								<div className="flex gap-2 items-center">
									<MapPin
										size={14}
										className="text-gray-400 dark:text-gray-500 flex-shrink-0"
										aria-hidden="true"
									/>
									<p className="text-sm text-gray-600 dark:text-gray-400 truncate">
										{item.location}
									</p>
								</div>
								<div className="flex gap-2 items-center">
									<Clock
										size={14}
										className="text-gray-400 dark:text-gray-500 flex-shrink-0"
										aria-hidden="true"
									/>
									<p className="text-sm text-gray-600 dark:text-gray-400 truncate ">
										{dayjs(item.date).format(
											"MMMM D, YYYY"
										)}
										<span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
											({dayjs(item.date).fromNow()})
										</span>
									</p>
								</div>
							</div>
						</div>
						<span
							className={`text-xs px-2 py-1 rounded-full font-medium ${
								item.type === "lost"
									? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
									: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
							}`}
						>
							{item.type.toUpperCase()}
						</span>
					</Link>
				))}
				{recentItems_n.length === 0 && (
					<p className="text-gray-600 dark:text-gray-400">
						No recent items found.
					</p>
				)}
			</ul>
		</section>
	);
}
