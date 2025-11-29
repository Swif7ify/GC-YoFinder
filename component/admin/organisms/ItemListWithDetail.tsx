"use client";

import React from "react";
import ItemCard from "../molecules/ItemCard";
import DetailPanel from "../molecules/DetailPanel";

interface Item {
	_id: string;
	name: string;
	description: string;
	type: "lost" | "found";
	status: "pending" | "active" | "rejected" | "claimed" | "removed";
	category: string;
	location: string;
	date_lost_or_found?: string;
	photos: { url: string }[];
	user_id: {
		firstname: string;
		lastname: string;
		email?: string;
	} | null;
	created_at: string;
}

interface ItemListWithDetailProps {
	items: Item[];
	selectedItem: Item | null;
	onSelectItem: (item: Item | null) => void;
	formatDate: (date: string) => string;
	renderItemActions?: (item: Item) => React.ReactNode;
	renderDetailActions?: (item: Item) => React.ReactNode;
	emptyIcon?: React.ReactNode;
	emptyTitle?: string;
	emptyDescription?: string;
}

export default function ItemListWithDetail({
	items,
	selectedItem,
	onSelectItem,
	formatDate,
	renderItemActions,
	renderDetailActions,
	emptyIcon,
	emptyTitle,
	emptyDescription,
}: ItemListWithDetailProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Items List */}
			<div className="lg:col-span-2 space-y-4">
				{items.length === 0 ? (
					<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
						{emptyIcon}
						<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">{emptyTitle}</h3>
						<p className="text-gray-500 dark:text-gray-400 mt-1">{emptyDescription}</p>
					</div>
				) : (
					items.map((item) => (
						<ItemCard
							key={item._id}
							item={item}
							isSelected={selectedItem?._id === item._id}
							onClick={() => onSelectItem(item)}
							formatDate={formatDate}
							actions={renderItemActions?.(item)}
						/>
					))
				)}
			</div>

			{/* Detail Panel */}
			<div className="lg:col-span-1">
				<DetailPanel
					item={selectedItem}
					onClose={() => onSelectItem(null)}
					formatDate={formatDate}
					actions={selectedItem ? renderDetailActions?.(selectedItem) : undefined}
					emptyIcon={emptyIcon}
					emptyTitle="Select an item"
					emptyDescription="Click on an item to view details"
				/>
			</div>
		</div>
	);
}
