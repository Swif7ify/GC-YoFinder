import UserSchema from "@/server/models/UserSchema";
import ItemsSchema from "@/server/models/ItemsSchema";
import { responsePayload, serverResponseError, userNotFoundError } from "@/server/utils/responsePayload";
import { ValidateStringField } from "@/server/utils/DataValitdation";
import mongoose from "mongoose";
import { connectToDatabase } from "@/server/lib/mongodb";
import { uploadFiles, deleteFiles } from "@/server/config/cloudinary.config";

class DashboardHandlers {
	static async getUserDataByID(userID: string) {
		await connectToDatabase();
		try {
			const isValidUserID = await ValidateStringField(userID);
			if (!isValidUserID) return userNotFoundError();

			const userData = await UserSchema.findById(userID).select("-__v -password");
			if (!userData) return userNotFoundError();

			return responsePayload(userData, "success", "User data retrieved successfully", 200);
		} catch (error) {
			return serverResponseError();
		}
	}

	static async updateUserDataByID(userID: string, updateData: { username?: string; phone?: string }) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const validateFields = ValidateStringField(userID, updateData.username, updateData.phone);
			if (!validateFields) return responsePayload(null, "error", "Invalid input data", 400);

			session.startTransaction();
			const userData = await UserSchema.findByIdAndUpdate(
				userID,
				{
					$set: {
						username: updateData.username,
						phone: updateData.phone,
					},
				},
				{ new: true, session, select: "-_id -__v -password" }
			);

			if (!userData) {
				await session.abortTransaction();
				return userNotFoundError();
			}

			await session.commitTransaction();
			return responsePayload(null, "success", "User data updated successfully", 200);
		} catch (error) {
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}

	static async updateUserPhotoByID(userID: string, image: { photo: File }) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const isValidUserID = await ValidateStringField(userID);
			if (!isValidUserID) return responsePayload(null, "error", "Invalid user ID", 400);

			if (!image.photo) {
				return responsePayload(null, "error", "Invalid image file", 400);
			}

			const uploadedPublicIds: string[] = [];

			const username = await UserSchema.findById(userID).select("username");
			if (!username) return userNotFoundError();
			const usernameStr = String(username.username || userID);
			const sanitize = (s: string) =>
				s
					.replace(/[^a-zA-Z0-9-_]/g, "_")
					.replace(/_/g, "_")
					.slice(0, 50);
			const imageBase = `${sanitize(usernameStr)}_profile_photo`;

			const imageResult = await uploadFiles(image.photo as File, imageBase);

			uploadedPublicIds.push(imageResult.public_id);

			const buildPhotoMeta = (res: any) => ({
				url: res.secure_url || res.url,
				publicId: res.public_id || res.publicId || "",
				cloudinaryId: res.public_id || "",
				format: res.format || "",
				size: typeof res.bytes === "number" ? res.bytes : res.size || 0,
				width: res.width || 0,
				height: res.height || 0,
				uploaded_at: res.created_at ? new Date(res.created_at) : new Date(),
				version: res.version,
				signature: res.signature,
				etag: res.etag,
				resourceType: res.resource_type || "image",
			});

			const photoMetadata = buildPhotoMeta(imageResult);

			session.startTransaction();
			const userData = await UserSchema.findByIdAndUpdate(
				userID,
				{
					$set: {
						photo: photoMetadata,
					},
				},
				{ new: true, session, select: "-_id -__v -password" }
			);
			if (!userData) {
				await session.abortTransaction();
				if (uploadedPublicIds.length > 0) {
					await deleteFiles(uploadedPublicIds);
				}
				return userNotFoundError();
			}

			await session.commitTransaction();
			return responsePayload(null, "success", "User photo updated successfully", 200);
		} catch (error) {
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}

	static async getAllItems(
		userID: string,
		page = 1,
		limit = 10,
		filters?: {
			searchQuery?: string;
			type?: "all" | "lost" | "found";
			status?: "all" | "active" | "claimed";
			category?: string;
			location?: string;
		}
	) {
		await connectToDatabase();
		try {
			const validateUserID = ValidateStringField(userID);
			if (!validateUserID) return responsePayload(null, "error", "Invalid user ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			page = Math.max(1, Number(page) || 1);
			limit = Math.max(1, Math.min(100, Number(limit) || 10));

			// Build query based on filters
			// By default, only show active items (approved by admin)
			const query: any = { status: "active" };

			if (filters?.searchQuery) {
				const searchRegex = new RegExp(filters.searchQuery, "i");
				query.$or = [{ name: searchRegex }, { description: searchRegex }, { location: searchRegex }];
			}

			if (filters?.type && filters.type !== "all") {
				query.type = filters.type;
			}

			// Allow filtering by status only for active and claimed (not pending/rejected)
			if (filters?.status && filters.status !== "all") {
				if (filters.status === "active" || filters.status === "claimed") {
					query.status = filters.status;
				}
			}

			if (filters?.category && filters.category !== "all") {
				query.category = filters.category;
			}

			if (filters?.location && filters.location !== "all") {
				query.location = filters.location;
			}

			const total = await ItemsSchema.countDocuments(query);

			const items = await ItemsSchema.find(query)
				.populate({
					path: "user_id",
					select: "firstname lastname username photo",
				})
				.sort({ created_at: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.lean()
				.exec();

			const itemsWithPhotoUrl = items.map((item: any) => {
				// Extract user photo URL
				let userPhoto = null;
				if (item.user_id && item.user_id.photo) {
					userPhoto =
						typeof item.user_id.photo === "string" ? item.user_id.photo : item.user_id.photo.url || null;
				}

				let itemPhotos = [];
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
					user_id: item.user_id
						? {
								...item.user_id,
								photo: userPhoto,
						  }
						: null,
					photos: itemPhotos,
				};
			});

			const totalPages = Math.ceil(total / limit);
			const payload = {
				items: itemsWithPhotoUrl,
				meta: {
					total,
					page,
					limit,
					totalPages,
				},
			};

			return responsePayload(payload, "success", "Items fetched successfully", 200);
		} catch (error) {
			console.error("Error fetching all items:", error);
			return serverResponseError();
		}
	}
}

export const { getUserDataByID, updateUserDataByID, updateUserPhotoByID, getAllItems } = DashboardHandlers;
