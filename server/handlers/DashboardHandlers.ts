import UserSchema from "@/server/models/UserSchema";
import ItemsSchema from "@/server/models/ItemsSchema";
import ConversationSchema from "@/server/models/ConversationSchema";
import MessageSchema from "@/server/models/MessageSchema";
import {
	responsePayload,
	serverResponseError,
	userNotFoundError,
} from "@/server/utils/responsePayload";
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

			const userData = await UserSchema.findById(userID).select(
				"-__v -password"
			);
			if (!userData) return userNotFoundError();

			return responsePayload(
				userData,
				"success",
				"User data retrieved successfully",
				200
			);
		} catch (error) {
			return serverResponseError();
		}
	}

	static async updateUserDataByID(
		userID: string,
		updateData: { username?: string; phone?: string }
	) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const validateFields = ValidateStringField(
				userID,
				updateData.username,
				updateData.phone
			);
			if (!validateFields)
				return responsePayload(
					null,
					"error",
					"Invalid input data",
					400
				);

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
			return responsePayload(
				null,
				"success",
				"User data updated successfully",
				200
			);
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
			if (!isValidUserID)
				return responsePayload(null, "error", "Invalid user ID", 400);

			if (!image.photo) {
				return responsePayload(
					null,
					"error",
					"Invalid image file",
					400
				);
			}

			const uploadedPublicIds: string[] = [];

			const username = await UserSchema.findById(userID).select(
				"username"
			);
			if (!username) return userNotFoundError();
			const usernameStr = String(username.username || userID);
			const sanitize = (s: string) =>
				s
					.replace(/[^a-zA-Z0-9-_]/g, "_")
					.replace(/_/g, "_")
					.slice(0, 50);
			const imageBase = `${sanitize(usernameStr)}_profile_photo`;

			const imageResult = await uploadFiles(
				image.photo as File,
				imageBase
			);

			uploadedPublicIds.push(imageResult.public_id);

			const buildPhotoMeta = (res: any) => ({
				url: res.secure_url || res.url,
				publicId: res.public_id || res.publicId || "",
				cloudinaryId: res.public_id || "",
				format: res.format || "",
				size: typeof res.bytes === "number" ? res.bytes : res.size || 0,
				width: res.width || 0,
				height: res.height || 0,
				uploaded_at: res.created_at
					? new Date(res.created_at)
					: new Date(),
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
			return responsePayload(
				null,
				"success",
				"User photo updated successfully",
				200
			);
		} catch (error) {
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}

	static async getUserSettingsByID(userID: string) {
		await connectToDatabase();
		try {
			const isValidUserID = await ValidateStringField(userID);
			if (!isValidUserID) return userNotFoundError();

			const user = await UserSchema.findById(userID).select(
				"preferences"
			);
			if (!user) return userNotFoundError();

			const prefs = (user as any).preferences || {};
			const payload = {
				language: prefs.language ?? "en",
				notifications: {
					email: prefs?.notifications?.email ?? true,
					match: prefs?.notifications?.match ?? true,
					message: prefs?.notifications?.message ?? true,
				},
				privacy: {
					profileVisibility:
						prefs?.privacy?.profileVisibility ?? "college",
					showEmail: prefs?.privacy?.showEmail ?? false,
					showContactInfo: prefs?.privacy?.showContactInfo ?? true,
				},
				display: {
					theme: prefs?.display?.theme ?? "system",
					textSize: prefs?.display?.textSize ?? 16,
					reduceMotion: prefs?.display?.reduceMotion ?? false,
				},
			};

			return responsePayload(
				payload,
				"success",
				"User settings retrieved successfully",
				200
			);
		} catch (error) {
			return serverResponseError();
		}
	}

	static async updateUserSettingsByID(
		userID: string,
		update: {
			language?: string;
			notifications?: {
				email?: boolean;
				match?: boolean;
				message?: boolean;
			};
			privacy?: {
				profileVisibility?: "public" | "college" | "private";
				showEmail?: boolean;
				showContactInfo?: boolean;
			};
			display?: {
				theme?: "system" | "light" | "dark";
				textSize?: number;
				reduceMotion?: boolean;
			};
		}
	) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const isValidUserID = await ValidateStringField(userID);
			if (!isValidUserID) return userNotFoundError();

			const set: Record<string, any> = {};
			if (typeof update.language === "string") {
				set["preferences.language"] = update.language;
			}
			if (update.notifications) {
				const n = update.notifications;
				if (typeof n.email === "boolean")
					set["preferences.notifications.email"] = n.email;
				if (typeof n.match === "boolean")
					set["preferences.notifications.match"] = n.match;
				if (typeof n.message === "boolean")
					set["preferences.notifications.message"] = n.message;
			}
			if (update.privacy) {
				const p = update.privacy;
				if (typeof p.profileVisibility === "string")
					set["preferences.privacy.profileVisibility"] =
						p.profileVisibility;
				if (typeof p.showEmail === "boolean")
					set["preferences.privacy.showEmail"] = p.showEmail;
				if (typeof p.showContactInfo === "boolean")
					set["preferences.privacy.showContactInfo"] =
						p.showContactInfo;
			}
			if (update.display) {
				const d = update.display;
				if (typeof d.theme === "string")
					set["preferences.display.theme"] = d.theme;
				if (typeof d.textSize === "number")
					set["preferences.display.textSize"] = Math.max(
						12,
						Math.min(28, d.textSize)
					);
				if (typeof d.reduceMotion === "boolean")
					set["preferences.display.reduceMotion"] = d.reduceMotion;
			}

			if (Object.keys(set).length === 0) {
				return responsePayload(
					null,
					"error",
					"No valid settings provided",
					400
				);
			}

			session.startTransaction();
			const updated = await UserSchema.findByIdAndUpdate(
				userID,
				{ $set: set },
				{ new: true, session, select: "preferences" }
			);
			if (!updated) {
				await session.abortTransaction();
				return userNotFoundError();
			}
			await session.commitTransaction();
			return responsePayload(
				null,
				"success",
				"User settings updated successfully",
				200
			);
		} catch (error) {
			await session.abortTransaction();
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
			if (!validateUserID)
				return responsePayload(null, "error", "Invalid user ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			page = Math.max(1, Number(page) || 1);
			limit = Math.max(1, Math.min(100, Number(limit) || 10));

			// Build query based on filters
			// By default, only show active items (approved by admin)
			const query: any = { status: "active" };

			if (filters?.searchQuery) {
				const searchRegex = new RegExp(filters.searchQuery, "i");
				query.$or = [
					{ name: searchRegex },
					{ description: searchRegex },
					{ location: searchRegex },
				];
			}

			if (filters?.type && filters.type !== "all") {
				query.type = filters.type;
			}

			// Allow filtering by status only for active and claimed (not pending/rejected)
			if (filters?.status && filters.status !== "all") {
				if (
					filters.status === "active" ||
					filters.status === "claimed"
				) {
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
						typeof item.user_id.photo === "string"
							? item.user_id.photo
							: item.user_id.photo.url || null;
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
					views: item.views ?? 0,
					matched: item.matched ?? 0,
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

			return responsePayload(
				payload,
				"success",
				"Items fetched successfully",
				200
			);
		} catch (error) {
			console.error("Error fetching all items:", error);
			return serverResponseError();
		}
	}

	// Get user dashboard stats
	static async getUserStats(userID: string) {
		await connectToDatabase();
		try {
			const validateUserID = ValidateStringField(userID);
			if (!validateUserID)
				return responsePayload(null, "error", "Invalid user ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			// Get date ranges
			const now = new Date();
			const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

			// Get user's item stats
			const [
				totalItemsPosted,
				itemsPostedThisWeek,
				lostItemsPosted,
				foundItemsPosted,
				pendingItems,
				activeItems,
				claimedItems,
				totalConversations,
				unreadMessages,
			] = await Promise.all([
				ItemsSchema.countDocuments({ user_id: userID }),
				ItemsSchema.countDocuments({
					user_id: userID,
					created_at: { $gte: weekStart },
				}),
				ItemsSchema.countDocuments({ user_id: userID, type: "lost" }),
				ItemsSchema.countDocuments({ user_id: userID, type: "found" }),
				ItemsSchema.countDocuments({
					user_id: userID,
					status: "pending",
				}),
				ItemsSchema.countDocuments({
					user_id: userID,
					status: "active",
				}),
				ItemsSchema.countDocuments({
					user_id: userID,
					status: "claimed",
				}),
				ConversationSchema.countDocuments({
					$or: [{ user1_id: userID }, { user2_id: userID }],
				}),
				MessageSchema.countDocuments({
					receiver_id: userID,
					is_read: false,
				}),
			]);

			const stats = {
				itemsPosted: {
					total: totalItemsPosted,
					thisWeek: itemsPostedThisWeek,
				},
				itemsFound: {
					total: foundItemsPosted,
					thisWeek: 0, // Can be calculated if needed
				},
				activeClaims: {
					total: pendingItems + activeItems,
					pending: pendingItems,
				},
				messages: {
					total: totalConversations,
					unread: unreadMessages,
				},
				breakdown: {
					lost: lostItemsPosted,
					found: foundItemsPosted,
					pending: pendingItems,
					active: activeItems,
					claimed: claimedItems,
				},
			};

			return responsePayload(
				stats,
				"success",
				"User stats retrieved successfully",
				200
			);
		} catch (error) {
			console.error("Error fetching user stats:", error);
			return serverResponseError();
		}
	}

	// Get user recent activity (up to 5 items)
	static async getUserRecentActivity(userID: string, limit = 5) {
		await connectToDatabase();
		try {
			const validateUserID = ValidateStringField(userID);
			if (!validateUserID)
				return responsePayload(null, "error", "Invalid user ID", 400);

			const user = await UserSchema.findById(userID);
			if (!user) return userNotFoundError();

			// Fetch recent items, messages, and status changes
			const [recentItems, recentMessages, recentStatusChanges] =
				await Promise.all([
					// Recent items posted by user
					ItemsSchema.find({ user_id: userID })
						.sort({ created_at: -1 })
						.limit(3)
						.select("name type status created_at")
						.lean(),
					// Recent messages received by user
					MessageSchema.find({ receiver_id: userID })
						.sort({ created_at: -1 })
						.limit(2)
						.populate("sender_id", "firstname lastname")
						.select("message created_at")
						.lean(),
					// Recent status changes (claimed items)
					ItemsSchema.find({ user_id: userID, status: "claimed" })
						.sort({ updated_at: -1 })
						.limit(2)
						.select("name status updated_at")
						.lean(),
				]);

			// Combine and format activities
			const activities: any[] = [];

			// Add item activities
			recentItems.forEach((item: any) => {
				const action =
					item.type === "lost"
						? `You reported a lost item`
						: `You reported a found item`;
				activities.push({
					id: `item-${item._id}`,
					action,
					item: item.name,
					time: this.formatTimeAgo(item.created_at),
					type: item.type === "lost" ? "lost" : "found",
					timestamp: item.created_at,
				});
			});

			// Add message activities
			recentMessages.forEach((msg: any) => {
				const sender = msg.sender_id
					? `${msg.sender_id.firstname} ${msg.sender_id.lastname}`
					: "Someone";
				activities.push({
					id: `message-${msg._id}`,
					action: `${sender} sent you a message`,
					item:
						msg.message.substring(0, 50) +
						(msg.message.length > 50 ? "..." : ""),
					time: this.formatTimeAgo(msg.created_at),
					type: "message",
					timestamp: msg.created_at,
				});
			});

			// Add claimed item activities
			recentStatusChanges.forEach((item: any) => {
				activities.push({
					id: `claimed-${item._id}`,
					action: `Item was claimed`,
					item: item.name,
					time: this.formatTimeAgo(item.updated_at),
					type: "claimed",
					timestamp: item.updated_at,
				});
			});

			// Sort by timestamp and limit
			activities.sort(
				(a, b) =>
					new Date(b.timestamp).getTime() -
					new Date(a.timestamp).getTime()
			);
			const limitedActivities = activities
				.slice(0, limit)
				.map((activity) => {
					const { timestamp, ...rest } = activity;
					return rest;
				});

			return responsePayload(
				limitedActivities,
				"success",
				"User recent activity retrieved successfully",
				200
			);
		} catch (error) {
			console.error("Error fetching user recent activity:", error);
			return serverResponseError();
		}
	}

	// Helper function to format time ago
	private static formatTimeAgo(date: Date): string {
		const now = new Date();
		const diff = now.getTime() - new Date(date).getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (minutes < 1) return "Just now";
		if (minutes < 60)
			return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
		if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
		if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
		return new Date(date).toLocaleDateString();
	}
}

export const {
	getUserDataByID,
	updateUserDataByID,
	updateUserPhotoByID,
	getAllItems,
	getUserStats,
	getUserSettingsByID,
	updateUserSettingsByID,
	getUserRecentActivity,
} = DashboardHandlers;
