import UserSchema from "@/server/models/UserSchema";
import ItemsSchema from "@/server/models/ItemsSchema";
import ItemViewSchema from "@/server/models/ItemViewSchema";
import ItemMatchSchema from "@/server/models/ItemMatchSchema";
import { createNotification } from "@/server/handlers/NotificationHandlers";
import { responsePayload, serverResponseError, userNotFoundError } from "@/server/utils/responsePayload";
import { ValidateStringField } from "@/server/utils/DataValitdation";
import mongoose from "mongoose";
import { connectToDatabase } from "@/server/lib/mongodb";
import { deleteFiles } from "@/server/config/cloudinary.config";

import { handleImagesUpload } from "@/server/utils/MultipleImageHandler";

// Helper function to format item for response (matches getAllItems format)
function formatItemForResponse(item: any) {
	if (!item) return null;

	// Extract user photo URL
	let userPhoto = null;
	if (item.user_id && item.user_id.photo) {
		userPhoto = typeof item.user_id.photo === "string" ? item.user_id.photo : item.user_id.photo.url || null;
	}

	// Extract item photos URLs
	let itemPhotos: string[] = [];
	if (item.photos && Array.isArray(item.photos)) {
		itemPhotos = item.photos
			.map((photo: any) => {
				if (typeof photo === "string") {
					return photo;
				}
				return photo.url || null;
			})
			.filter(Boolean);
	}

	return {
		...item,
		id: item._id?.toString() || item.id,
		user_id: item.user_id
			? {
					id: item.user_id._id?.toString() || item.user_id.id,
					firstname: item.user_id.firstname,
					lastname: item.user_id.lastname,
					username: item.user_id.username,
					photo: userPhoto,
			  }
			: null,
		photos: itemPhotos,
		views: item.views || 0,
		matched: item.matched || 0,
	};
}

interface ItemData {
	type: string;
	title: string;
	description: string;
	category: string;
	location: string;
	date_lost_or_found: string;
	photos: File[];
	existing_images?: string[] | null;
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

			if (!validateFields) return responsePayload(null, "error", "Invalid input data", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			let uploadedPublicIds: string[] = [];
			let imageMetadata: any[] = [];

			session.startTransaction();

			if (itemData.photos && itemData.photos.length > 0) {
				const uploadResult = await handleImagesUpload(itemData.photos, userID, 5);

				if (!uploadResult) {
					await session.abortTransaction();
					return responsePayload(null, "error", "Failed to upload images", 500);
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
				date_lost_or_found: itemData.date_lost_or_found ? new Date(itemData.date_lost_or_found) : new Date(),
				photos: imageMetadata,
			};

			const newItem = await ItemsSchema.create([doc], { session });

			if (!newItem || newItem.length === 0) {
				if (uploadedPublicIds.length > 0) {
					await deleteFiles(uploadedPublicIds);
				}
				await session.abortTransaction();
				return responsePayload(null, "error", "Failed to create new item", 500);
			}
			await session.commitTransaction();
			return responsePayload(null, "success", "Item created successfully", 201);
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
			if (!validateUserID) return responsePayload(null, "error", "Invalid user ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const items = await ItemsSchema.find({ user_id: user._id }).sort({
				created_at: -1,
			});

			return responsePayload(items, "success", "User items fetched successfully", 200);
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
			if (!validateItemID) return responsePayload(null, "error", "Invalid item ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			session.startTransaction();

			const itemImageToDelete = await ItemsSchema.findById(itemID).select("photos");

			if (itemImageToDelete && itemImageToDelete.photos.length > 0) {
				const publicIds = itemImageToDelete.photos.map((img: any) => img.publicId).filter(Boolean);

				if (publicIds.length > 0) {
					const deleteResult = await deleteFiles(publicIds);
				}
			}

			const deleteItem = await ItemsSchema.findByIdAndDelete(itemID, {
				session,
			});
			if (!deleteItem) {
				await session.abortTransaction();
				return responsePayload(null, "error", "Failed to delete item", 500);
			}

			await session.commitTransaction();
			return responsePayload(null, "success", "Item deleted successfully", 200);
		} catch (error) {
			await session.abortTransaction();
			console.log(error);
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}

	static async updateItemByID(userID: string, itemID: string, itemData: ItemData) {
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
				itemData.location
			);
			if (!validateFields) return responsePayload(null, "error", "Invalid item data", 400);
			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();
			const item = await ItemsSchema.findById(itemID);
			if (!item) return responsePayload(null, "error", "Item not found", 404);

			// Verify user owns this item
			if (item.user_id.toString() !== userID) {
				return responsePayload(null, "error", "You can only edit your own items", 403);
			}

			// Determine new status based on current status and user request
			let newStatus = item.status;

			if (item.status === "rejected") {
				// If item was rejected and user is editing, set back to pending for re-approval
				newStatus = "pending";
			} else if (item.status === "active" && itemData.status === "claimed") {
				// Users can only mark active items as claimed
				newStatus = "claimed";
			}
			// Users cannot set status to "active" - only admin can approve
			// Pending items stay pending, claimed items stay claimed

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

			if (itemData.existing_images && itemData.existing_images.length > 0) {
				const existingPhotos = item.photos.filter((photo: any) =>
					itemData.existing_images!.includes(photo.url)
				);
				finalPhotos.push(...existingPhotos);
			}

			if (itemData.photos && itemData.photos.length > 0) {
				const uploadResult = await handleImagesUpload(itemData.photos, userID, 5 - finalPhotos.length);

				if (!uploadResult) {
					return responsePayload(null, "error", "Failed to upload images", 500);
				}

				finalPhotos.push(...uploadResult.imageMetadata);
			}

			const doc: any = {
				type: itemData.type,
				name: itemData.title,
				description: itemData.description,
				category: itemData.category,
				location: itemData.location,
				status: newStatus,
				date_lost_or_found: itemData.date_lost_or_found ? new Date(itemData.date_lost_or_found) : new Date(),
				photos: finalPhotos,
				updated_at: new Date(),
			};

			// Set claimed_by and claimed_at when marking as claimed
			if (newStatus === "claimed" && item.status !== "claimed") {
				doc.claimed_by = userID;
				doc.claimed_at = new Date();
			}

			const updatedItem = await ItemsSchema.findByIdAndUpdate(itemID, doc, { new: true, session });
			if (!updatedItem) {
				if (uploadedPublicIds.length > 0) {
					await deleteFiles(uploadedPublicIds);
				}
				await session.abortTransaction();
				return responsePayload(null, "error", "Failed to update item", 500);
			}

			await session.commitTransaction();
			if (imagesToDelete.length > 0) {
				await deleteFiles(imagesToDelete).catch((err) =>
					console.error("Failed to delete old images from Cloudinary:", err)
				);
			}
			return responsePayload(null, "success", "Item updated successfully", 200);
		} catch (error) {
			await session.abortTransaction();
			console.log(error);
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}

	// Track item view (only if not own item and not already viewed)
	static async trackItemView(userID: string, itemID: string) {
		await connectToDatabase();
		try {
			const validateFields = ValidateStringField(userID, itemID);
			if (!validateFields) return responsePayload(null, "error", "Invalid user ID or item ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const item = await ItemsSchema.findById(itemID);
			if (!item) return responsePayload(null, "error", "Item not found", 404);

			// Don't track views for own items
			if (item.user_id.toString() === userID) {
				// Still return the formatted item so the view count is displayed correctly
				const formattedItem = formatItemForResponse(
					await ItemsSchema.findById(itemID).populate("user_id", "firstname lastname username photo").lean()
				);
				return responsePayload(formattedItem, "success", "View not tracked (own item)", 200);
			}

			// Check if user has already viewed this item (without transaction to avoid conflicts)
			const existingView = await ItemViewSchema.findOne({
				item_id: itemID,
				user_id: userID,
			});

			if (existingView) {
				// Return the current item even if view was already tracked
				const currentItem = await ItemsSchema.findById(itemID)
					.populate("user_id", "firstname lastname username photo")
					.lean();

				// Format the item to match AllItem structure
				const formattedItem = formatItemForResponse(currentItem);
				return responsePayload(formattedItem, "success", "View already tracked", 200);
			}

			// Try to create view record atomically using upsert
			// This handles race conditions where multiple requests come in simultaneously
			try {
				const result = await ItemViewSchema.findOneAndUpdate(
					{
						item_id: itemID,
						user_id: userID,
					},
					{
						$setOnInsert: {
							item_id: itemID,
							user_id: userID,
							viewed_at: new Date(),
						},
					},
					{
						upsert: true,
						new: true,
						rawResult: true,
					}
				);

				// Check if document was actually created (not just found and updated)
				// If upserted field exists, it means a new document was created
				const wasCreated = result.lastErrorObject?.upserted !== undefined;

				if (wasCreated) {
					// Only increment view count if we actually created a new view record
					await ItemsSchema.findByIdAndUpdate(itemID, {
						$inc: { views: 1 },
					});
				}
			} catch (createError: any) {
				// Handle duplicate key error (E11000) or write conflict gracefully
				if (
					createError.code === 11000 ||
					createError.codeName === "WriteConflict" ||
					createError.code === 112
				) {
					// View was already created by another concurrent request
					// Return the current item with updated view count
					const currentItem = await ItemsSchema.findById(itemID)
						.populate("user_id", "firstname lastname username photo")
						.lean();

					// Format the item to match AllItem structure
					const formattedItem = formatItemForResponse(currentItem);
					return responsePayload(formattedItem, "success", "View already tracked", 200);
				}
				throw createError; // Re-throw if it's a different error
			}

			// Fetch the updated item with the new view count
			const updatedItem = await ItemsSchema.findById(itemID)
				.populate("user_id", "firstname lastname username photo")
				.lean();

			// Format the item to match AllItem structure
			const formattedItem = formatItemForResponse(updatedItem);
			return responsePayload(formattedItem, "success", "View tracked successfully", 200);
		} catch (error: any) {
			// Handle write conflicts gracefully
			if (error.code === 11000 || error.codeName === "WriteConflict" || error.code === 112) {
				// Return the current item even if view was already tracked
				const currentItem = await ItemsSchema.findById(itemID)
					.populate("user_id", "firstname lastname username photo")
					.lean();

				// Format the item to match AllItem structure
				const formattedItem = formatItemForResponse(currentItem);
				return responsePayload(formattedItem, "success", "View already tracked", 200);
			}
			console.error("Error tracking item view:", error);
			return serverResponseError();
		}
	}

	// Track item match (when someone claims they found/lost this item)
	static async trackItemMatch(userID: string, itemID: string) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const validateFields = ValidateStringField(userID, itemID);
			if (!validateFields) return responsePayload(null, "error", "Invalid user ID or item ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			const itemDoc = await ItemsSchema.findById(itemID)
				.populate("user_id", "firstname lastname username")
				.lean();
			if (!itemDoc) return responsePayload(null, "error", "Item not found", 404);

			const item = itemDoc as any;

			// Get item owner ID (handle both populated and non-populated cases)
			const itemOwnerID = item.user_id?._id?.toString() || item.user_id?.toString();

			// Don't allow matching own items
			if (itemOwnerID === userID) {
				return responsePayload(null, "error", "Cannot match your own item", 400);
			}

			// Don't allow matching if already claimed
			if (item.status === "claimed") {
				return responsePayload(null, "error", "Item has already been claimed", 400);
			}

			// Check if user has already matched this item
			const existingMatch = await ItemMatchSchema.findOne({
				item_id: itemID,
				user_id: userID,
			});

			if (existingMatch) {
				return responsePayload(null, "error", "You have already matched this item", 400);
			}

			session.startTransaction();

			// Create match record
			const newMatch = new ItemMatchSchema({
				item_id: itemID,
				user_id: userID,
			});
			await newMatch.save({ session });

			// Increment match count
			await ItemsSchema.findByIdAndUpdate(itemID, { $inc: { matched: 1 } }, { session });

			await session.commitTransaction();

			// Create notification for item owner
			const matcherName = `${user.firstname} ${user.lastname}`;
			const itemName = item.name;
			const matchType = item.type === "lost" ? "found" : "lost";

			// Create notification (this will trigger Pusher event)
			try {
				const notificationResponse = await createNotification(
					itemOwnerID,
					"match",
					"New Match",
					`${matcherName} says they ${matchType} your item: ${itemName}`,
					itemID,
					undefined,
					userID
				);

				// Log if notification creation failed (but don't fail the match)
				if (notificationResponse.status_code !== 201) {
					console.error("Failed to create notification:", notificationResponse.status.message);
				}
			} catch (notifError) {
				console.error("Error creating notification:", notifError);
				// Don't fail the match if notification fails
			}

			// Return updated item
			const updatedItem = await ItemsSchema.findById(itemID)
				.populate("user_id", "firstname lastname username photo")
				.lean();

			const formattedItem = formatItemForResponse(updatedItem);
			return responsePayload(formattedItem, "success", "Match tracked successfully", 200);
		} catch (error: any) {
			await session.abortTransaction();
			// Handle duplicate key error (user already matched)
			if (error.code === 11000) {
				return responsePayload(null, "error", "You have already matched this item", 400);
			}
			console.error("Error tracking item match:", error);
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}

	// Check if user has matched an item
	static async hasUserMatchedItem(userID: string, itemID: string) {
		await connectToDatabase();
		try {
			const match = await ItemMatchSchema.findOne({
				item_id: itemID,
				user_id: userID,
			});
			return match !== null;
		} catch (error) {
			console.error("Error checking match:", error);
			return false;
		}
	}
}

export const {
	createNewItem,
	getUserItems,
	deleteItemByID,
	updateItemByID,
	trackItemView,
	trackItemMatch,
	hasUserMatchedItem,
} = ItemsHandlers;
