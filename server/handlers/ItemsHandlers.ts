import UserSchema from "@/server/models/UserSchema";
import ItemsSchema from "@/server/models/ItemsSchema";
import {
	responsePayload,
	serverResponseError,
	userNotFoundError,
} from "@/server/utils/responsePayload";
import { ValidateStringField } from "@/server/utils/DataValitdation";
import mongoose from "mongoose";
import { connectToDatabase } from "@/server/lib/mongodb";
import { deleteFiles } from "@/server/config/cloudinary.config";

import { handleImagesUpload } from "@/server/utils/MultipleImageHandler";

interface ItemData {
	type: string;
	title: string;
	description: string;
	category: string;
	location: string;
	date_lost_or_found: string;
	photos: File[];
	existing_images: string[];
	status?: string;
}

class ItemsHandlers {
	static async createNewItem(userID: string, itemData: ItemData) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const validateFields = ValidateStringField(
				userID,
				itemData.type,
				itemData.title,
				itemData.description,
				itemData.category,
				itemData.location
			);

			if (!validateFields)
				return responsePayload(
					null,
					"error",
					"Invalid input data",
					400
				);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			let uploadedPublicIds: string[] = [];
			let imageMetadata: any[] = [];

			session.startTransaction();

			if (itemData.photos && itemData.photos.length > 0) {
				const uploadResult = await handleImagesUpload(
					itemData.photos,
					userID,
					5
				);

				if (!uploadResult) {
					await session.abortTransaction();
					return responsePayload(
						null,
						"error",
						"Failed to upload images",
						500
					);
				}

				uploadedPublicIds = uploadResult.uploadedPublicIds;
				imageMetadata = uploadResult.imageMetadata;
			}

			const doc = {
				user_id: user._id,
				type: itemData.type,
				name: itemData.title,
				description: itemData.description,
				category: itemData.category,
				location: itemData.location,
				date_lost_or_found: itemData.date_lost_or_found
					? new Date(itemData.date_lost_or_found)
					: new Date(),
				photos: imageMetadata,
			};

			const newItem = await ItemsSchema.create([doc], { session });

			if (!newItem || newItem.length === 0) {
				if (uploadedPublicIds.length > 0) {
					await deleteFiles(uploadedPublicIds);
				}
				await session.abortTransaction();
				return responsePayload(
					null,
					"error",
					"Failed to create new item",
					500
				);
			}
			await session.commitTransaction();
			return responsePayload(
				null,
				"success",
				"Item created successfully",
				201
			);
		} catch (error) {
			console.log(error);
			await session.abortTransaction();
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}

	static async getUserItems(userID: string) {
		await connectToDatabase();
		try {
			const validateUserID = ValidateStringField(userID);
			if (!validateUserID)
				return responsePayload(null, "error", "Invalid user ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const items = await ItemsSchema.find({ user_id: user._id }).sort({
				created_at: -1,
			});

			return responsePayload(
				items,
				"success",
				"User items fetched successfully",
				200
			);
		} catch (error) {
			console.log(error);
			return serverResponseError();
		}
	}

	static async deleteItemByID(userID: string, itemID: string) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const validateItemID = ValidateStringField(itemID, userID);
			if (!validateItemID)
				return responsePayload(null, "error", "Invalid item ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			session.startTransaction();

			const itemImageToDelete = await ItemsSchema.findById(itemID).select(
				"photos"
			);

			if (itemImageToDelete && itemImageToDelete.photos.length > 0) {
				const publicIds = itemImageToDelete.photos
					.map((img: any) => img.publicId)
					.filter(Boolean);

				if (publicIds.length > 0) {
					const deleteResult = await deleteFiles(publicIds);
				}
			}

			const deleteItem = await ItemsSchema.findByIdAndDelete(itemID, {
				session,
			});
			if (!deleteItem) {
				await session.abortTransaction();
				return responsePayload(
					null,
					"error",
					"Failed to delete item",
					500
				);
			}

			await session.commitTransaction();
			return responsePayload(
				null,
				"success",
				"Item deleted successfully",
				200
			);
		} catch (error) {
			await session.abortTransaction();
			console.log(error);
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}

	static async updateItemByID(
		userID: string,
		itemID: string,
		itemData: ItemData
	) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const validateFields = ValidateStringField(
				userID,
				itemID,
				itemData.type,
				itemData.title,
				itemData.description,
				itemData.category,
				itemData.location,
				itemData.status
			);
			if (!validateFields)
				return responsePayload(null, "error", "Invalid item data", 400);
			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();
			const item = await ItemsSchema.findById(itemID);
			if (!item)
				return responsePayload(null, "error", "Item not found", 404);

			let uploadedPublicIds: string[] = [];

			session.startTransaction();
			let finalPhotos = [];

			const imagesToDelete: string[] = [];
			if (item.photos && item.photos.length > 0) {
				const keptUrls = new Set(itemData.existing_images || []);
				item.photos.forEach((photo: any) => {
					if (!keptUrls.has(photo.url) && photo.publicId) {
						imagesToDelete.push(photo.publicId);
					}
				});
			}

			if (
				itemData.existing_images &&
				itemData.existing_images.length > 0
			) {
				const existingPhotos = item.photos.filter((photo: any) =>
					itemData.existing_images!.includes(photo.url)
				);
				finalPhotos.push(...existingPhotos);
			}

			if (itemData.photos && itemData.photos.length > 0) {
				const uploadResult = await handleImagesUpload(
					itemData.photos,
					userID,
					5 - finalPhotos.length
				);

				if (!uploadResult) {
					return responsePayload(
						null,
						"error",
						"Failed to upload images",
						500
					);
				}

				finalPhotos.push(...uploadResult.imageMetadata);
			}

			const doc = {
				type: itemData.type,
				name: itemData.title,
				description: itemData.description,
				category: itemData.category,
				location: itemData.location,
				status: itemData.status,
				date_lost_or_found: itemData.date_lost_or_found
					? new Date(itemData.date_lost_or_found)
					: new Date(),
				photos: finalPhotos,
			};

			const updatedItem = await ItemsSchema.findByIdAndUpdate(
				itemID,
				doc,
				{ new: true, session }
			);
			if (!updatedItem) {
				if (uploadedPublicIds.length > 0) {
					await deleteFiles(uploadedPublicIds);
				}
				await session.abortTransaction();
				return responsePayload(
					null,
					"error",
					"Failed to update item",
					500
				);
			}

			await session.commitTransaction();
			if (imagesToDelete.length > 0) {
				await deleteFiles(imagesToDelete).catch((err) =>
					console.error(
						"Failed to delete old images from Cloudinary:",
						err
					)
				);
			}
			return responsePayload(
				null,
				"success",
				"Item updated successfully",
				200
			);
		} catch (error) {
			await session.abortTransaction();
			console.log(error);
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}
}

export const { createNewItem, getUserItems, deleteItemByID, updateItemByID } =
	ItemsHandlers;
