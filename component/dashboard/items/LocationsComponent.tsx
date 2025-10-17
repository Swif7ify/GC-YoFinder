"use client";

import React, { useState, useEffect } from "react";
import {
	MapPin,
	Building2,
	Clock,
	Mail,
	User,
	ChevronRight,
} from "lucide-react";
import { Location } from "@/types/types";

export default function LocationsComponent() {
	const [locations, setLocations] = useState<Location[]>([]);
	const [filterType, setFilterType] = useState<
		"all" | "drop-off" | "pick-up" | "both"
	>("all");

	useEffect(() => {
		// Mock data
		setLocations([
			{
				id: "1",
				name: "Main Library Lost & Found",
				building: "Main Library",
				floor: "Ground Floor",
				description:
					"Located at the information desk near the main entrance. Staff available during operating hours.",
				hours: "Mon-Fri: 8:00 AM - 8:00 PM, Sat: 9:00 AM - 5:00 PM",
				type: "both",
				contactPerson: "Ms. Sarah Johnson",
				contactEmail: "library.lostandfound@gordoncollege.edu.ph",
			},
			{
				id: "2",
				name: "Campus Security Office",
				building: "Administration Building",
				floor: "1st Floor",
				description:
					"Central collection point for all found items across campus. 24/7 security staff available.",
				hours: "24/7",
				type: "both",
				contactPerson: "Security Office",
				contactEmail: "security@gordoncollege.edu.ph",
			},
			{
				id: "3",
				name: "Student Services Center",
				building: "Student Center",
				floor: "2nd Floor",
				description:
					"Drop off or claim items during business hours. Student ID required for pickup.",
				hours: "Mon-Fri: 9:00 AM - 5:00 PM",
				type: "both",
				contactPerson: "Student Services Team",
				contactEmail: "studentservices@gordoncollege.edu.ph",
			},
			{
				id: "4",
				name: "Gym & Sports Complex",
				building: "Athletic Center",
				floor: "Ground Floor",
				description:
					"Lost and found box located at the gym reception desk. Mainly for sports equipment and athletic wear.",
				hours: "Mon-Sat: 6:00 AM - 9:00 PM",
				type: "both",
				contactPerson: "Gym Staff",
				contactEmail: "gym@gordoncollege.edu.ph",
			},
			{
				id: "5",
				name: "Cafeteria Lost & Found",
				building: "Main Cafeteria",
				floor: "Ground Floor",
				description:
					"Items left in dining areas are kept at the cafeteria manager's office.",
				hours: "Mon-Fri: 7:00 AM - 7:00 PM",
				type: "both",
				contactPerson: "Cafeteria Manager",
				contactEmail: "cafeteria@gordoncollege.edu.ph",
			},
			{
				id: "6",
				name: "Science Building Collection Point",
				building: "Science & Research Building",
				floor: "1st Floor Lobby",
				description:
					"Items found in science labs and classrooms. Check with building security.",
				hours: "Mon-Fri: 7:00 AM - 6:00 PM",
				type: "drop-off",
				contactPerson: "Building Security",
			},
		]);
	}, []);

	const filteredLocations = locations.filter(
		(location) => filterType === "all" || location.type === filterType
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<section aria-labelledby="locations-heading">
				<h1
					id="locations-heading"
					className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
				>
					Collection Locations
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Find drop-off and pick-up points for lost and found items
					across campus
				</p>
			</section>

			{/* Info Banner */}
			<div
				className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex gap-3"
				role="note"
			>
				<MapPin
					size={20}
					className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
					aria-hidden="true"
				/>
				<div className="flex-1">
					<p className="text-sm text-emerald-900 dark:text-emerald-100 font-medium mb-1">
						Multiple Collection Points Available
					</p>
					<p className="text-xs text-emerald-800 dark:text-emerald-200">
						You can drop off or claim found items at any of these
						campus locations. Remember to bring your student ID for
						verification.
					</p>
				</div>
			</div>

			{/* Filter Tabs */}
			<div
				className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-1 inline-flex gap-1"
				role="tablist"
				aria-label="Filter locations"
			>
				<button
					type="button"
					role="tab"
					aria-selected={filterType === "all"}
					aria-controls="locations-panel"
					onClick={() => setFilterType("all")}
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
						filterType === "all"
							? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
							: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
					}`}
				>
					All Locations
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={filterType === "both"}
					aria-controls="locations-panel"
					onClick={() => setFilterType("both")}
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
						filterType === "both"
							? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
							: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
					}`}
				>
					Drop-off & Pick-up
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={filterType === "drop-off"}
					aria-controls="locations-panel"
					onClick={() => setFilterType("drop-off")}
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
						filterType === "drop-off"
							? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
							: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
					}`}
				>
					Drop-off Only
				</button>
			</div>

			{/* Locations List */}
			<section
				id="locations-panel"
				role="tabpanel"
				aria-labelledby="locations-heading"
			>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{filteredLocations.map((location) => (
						<article
							key={location.id}
							className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6 hover:shadow-md transition-shadow"
						>
							{/* Header */}
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<div
											className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0"
											aria-hidden="true"
										>
											<MapPin
												size={20}
												className="text-emerald-600 dark:text-emerald-400"
											/>
										</div>
										<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
											{location.name}
										</h3>
									</div>

									<span
										className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
											location.type === "both"
												? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
												: location.type === "drop-off"
												? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
												: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
										}`}
									>
										{location.type === "both"
											? "Drop-off & Pick-up"
											: location.type === "drop-off"
											? "Drop-off Only"
											: "Pick-up Only"}
									</span>
								</div>
							</div>

							{/* Description */}
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
								{location.description}
							</p>

							{/* Details */}
							<div className="space-y-3">
								<div className="flex items-start gap-3 text-sm">
									<Building2
										size={16}
										className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
										aria-hidden="true"
									/>
									<div>
										<p className="text-gray-900 dark:text-gray-100 font-medium">
											{location.building}
										</p>
										<p className="text-gray-600 dark:text-gray-400 text-xs">
											{location.floor}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3 text-sm">
									<Clock
										size={16}
										className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
										aria-hidden="true"
									/>
									<p className="text-gray-600 dark:text-gray-400">
										{location.hours}
									</p>
								</div>

								{location.contactPerson && (
									<div className="flex items-start gap-3 text-sm">
										<User
											size={16}
											className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
											aria-hidden="true"
										/>
										<p className="text-gray-600 dark:text-gray-400">
											{location.contactPerson}
										</p>
									</div>
								)}

								{location.contactEmail && (
									<div className="flex items-start gap-3 text-sm">
										<Mail
											size={16}
											className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
											aria-hidden="true"
										/>
										<a
											href={`mailto:${location.contactEmail}`}
											className="text-emerald-600 dark:text-emerald-400 hover:underline break-all"
										>
											{location.contactEmail}
										</a>
									</div>
								)}
							</div>

							{/* Action Button */}
							<button
								type="button"
								className="mt-4 w-full px-4 py-2 border border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center justify-center gap-2 transition-colors"
								aria-label={`Get directions to ${location.name}`}
							>
								Get Directions
								<ChevronRight size={16} aria-hidden="true" />
							</button>
						</article>
					))}
				</div>
			</section>
		</div>
	);
}
