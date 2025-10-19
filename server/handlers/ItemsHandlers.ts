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
import { uploadFiles, deleteFiles } from "@/server/config/cloudinary.config";

interface ItemData {
	type: string;
	title: string;
	description: string;
	category: string;
	location: string;
	date_lost_or_found: string;
	photos: File[];
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

			const uploadedPublicIds: string[] = [];
			let imageMetadata: any[] = [];

			session.startTransaction();

			if (itemData.photos && itemData.photos.length > 0) {
				try {
					const validImages = itemData.photos
						.filter((img) => img instanceof File && img.size > 0)
						.slice(0, 6);

					if (validImages.length > 0) {
						const uploadPromises = validImages.map((image, idx) => {
							const publicIdBase = `items_${userID}_${Date.now()}_${idx}`;
							return uploadFiles(
								image,
								publicIdBase,
								"gc-yofinder/items"
							);
						});

						const uploadResults = await Promise.all(uploadPromises);
						uploadedPublicIds.push(
							...uploadResults.map((res) => res.public_id)
						);

						const buildImageMeta = (res: any) => ({
							url: res.secure_url || res.url,
							publicId: res.public_id || res.publicId || "",
							cloudinaryId: res.public_id || "",
							format: res.format || "",
							size:
								typeof res.bytes === "number"
									? res.bytes
									: res.size || 0,
							width: res.width || 0,
							height: res.height || 0,
							uploadedAt: res.created_at
								? new Date(res.created_at)
								: new Date(),
							version: res.version,
							signature: res.signature,
							etag: res.etag,
							resourceType: res.resource_type || "image",
						});

						imageMetadata = uploadResults.map(buildImageMeta);
					}
				} catch (uploadError) {
					// If upload fails, delete any previously uploaded images
					if (uploadedPublicIds.length > 0) {
						await deleteFiles(uploadedPublicIds);
					}
					return responsePayload(
						null,
						"error",
						"Image upload failed",
						500
					);
				}
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
}

export const { createNewItem, getUserItems, deleteItemByID } = ItemsHandlers;
