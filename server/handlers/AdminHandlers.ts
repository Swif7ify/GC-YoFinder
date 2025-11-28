import UserSchema from "@/server/models/UserSchema";
import ItemsSchema from "@/server/models/ItemsSchema";
import ConversationSchema from "@/server/models/ConversationSchema";
import MessageSchema from "@/server/models/MessageSchema";
import { responsePayload, serverResponseError, userNotFoundError } from "@/server/utils/responsePayload";
import { ValidateStringField } from "@/server/utils/DataValitdation";
import mongoose from "mongoose";
import { connectToDatabase } from "@/server/lib/mongodb";
import pusher from "@/server/config/pusher.config";

class AdminHandlers {
	// Get admin user data by ID
	static async getAdminDataByID(userID: string) {
		await connectToDatabase();
		try {
			const isValidUserID = await ValidateStringField(userID);
			if (!isValidUserID) return userNotFoundError();

			const userData = await UserSchema.findById(userID).select("-__v -password");
			if (!userData) return userNotFoundError();

			if (userData.role !== "admin") {
				return responsePayload(null, "error", "User is not an admin", 403);
			}

			return responsePayload(userData, "success", "Admin data retrieved successfully", 200);
		} catch (error) {
			return serverResponseError();
		}
	}

	// Update admin profile data
	static async updateAdminDataByID(
		userID: string,
		updateData: { username?: string; phone?: string; firstname?: string; lastname?: string }
	) {
		await connectToDatabase();
		const session = await mongoose.startSession();
		try {
			const validateFields = ValidateStringField(userID);
			if (!validateFields) return responsePayload(null, "error", "Invalid input data", 400);

			session.startTransaction();

			const fieldsToUpdate: any = {};
			if (updateData.username) fieldsToUpdate.username = updateData.username;
			if (updateData.phone) fieldsToUpdate.phone = updateData.phone;
			if (updateData.firstname) fieldsToUpdate.firstname = updateData.firstname;
			if (updateData.lastname) fieldsToUpdate.lastname = updateData.lastname;

			const userData = await UserSchema.findByIdAndUpdate(
				userID,
				{ $set: fieldsToUpdate },
				{ new: true, session, select: "-_id -__v -password" }
			);

			if (!userData) {
				await session.abortTransaction();
				return userNotFoundError();
			}

			await session.commitTransaction();
			return responsePayload(userData, "success", "Admin data updated successfully", 200);
		} catch (error) {
			return serverResponseError();
		} finally {
			await session.endSession();
		}
	}

	// Get dashboard statistics
	static async getDashboardStats() {
		await connectToDatabase();
		try {
			// Get date ranges
			const now = new Date();
			const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

			const [
				totalUsers,
				activeUsers,
				newUsersToday,
				newUsersThisWeek,
				totalItems,
				pendingItems,
				activeItems,
				claimedItems,
				rejectedItems,
				lostItems,
				foundItems,
				itemsToday,
				itemsThisWeek,
				itemsThisMonth,
				totalConversations,
				totalMessages,
				totalViews,
				totalMatches,
			] = await Promise.all([
				UserSchema.countDocuments({ role: "student" }),
				UserSchema.countDocuments({ role: "student", is_online: true }),
				UserSchema.countDocuments({ role: "student", created_at: { $gte: todayStart } }),
				UserSchema.countDocuments({ role: "student", created_at: { $gte: weekStart } }),
				ItemsSchema.countDocuments(),
				ItemsSchema.countDocuments({ status: "pending" }),
				ItemsSchema.countDocuments({ status: "active" }),
				ItemsSchema.countDocuments({ status: "claimed" }),
				ItemsSchema.countDocuments({ status: "rejected" }),
				ItemsSchema.countDocuments({ type: "lost" }),
				ItemsSchema.countDocuments({ type: "found" }),
				ItemsSchema.countDocuments({ created_at: { $gte: todayStart } }),
				ItemsSchema.countDocuments({ created_at: { $gte: weekStart } }),
				ItemsSchema.countDocuments({ created_at: { $gte: monthStart } }),
				ConversationSchema.countDocuments(),
				MessageSchema.countDocuments(),
				ItemsSchema.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
				ItemsSchema.aggregate([{ $group: { _id: null, total: { $sum: "$matched" } } }]),
			]);

			// Calculate success rate (claimed / total non-pending items)
			const resolvedItems = claimedItems;
			const totalProcessedItems = activeItems + claimedItems + rejectedItems;
			const successRate = totalProcessedItems > 0 ? Math.round((resolvedItems / totalProcessedItems) * 100) : 0;

			// Get recent items for activity
			const recentItems = await ItemsSchema.find()
				.populate("user_id", "firstname lastname username photo")
				.sort({ created_at: -1 })
				.limit(5)
				.lean();

			// Get category breakdown
			const categoryBreakdown = await ItemsSchema.aggregate([
				{ $group: { _id: "$category", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: 5 },
			]);

			// Get location breakdown
			const locationBreakdown = await ItemsSchema.aggregate([
				{ $group: { _id: "$location", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: 5 },
			]);

			const stats = {
				// User stats
				totalUsers,
				activeUsers,
				newUsersToday,
				newUsersThisWeek,
				// Item stats
				totalItems,
				pendingItems,
				activeItems,
				claimedItems,
				rejectedItems,
				lostItems,
				foundItems,
				itemsToday,
				itemsThisWeek,
				itemsThisMonth,
				// Engagement stats
				totalConversations,
				totalMessages,
				totalViews: totalViews[0]?.total || 0,
				totalMatches: totalMatches[0]?.total || 0,
				// Calculated stats
				successRate,
				// Breakdowns
				categoryBreakdown,
				locationBreakdown,
				// Recent activity
				recentItems: recentItems.map((item: any) => ({
					id: item._id,
					name: item.name,
					type: item.type,
					status: item.status,
					category: item.category,
					location: item.location,
					createdAt: item.created_at,
					user: item.user_id
						? {
								id: item.user_id._id,
								name: `${item.user_id.firstname || ""} ${item.user_id.lastname || ""}`.trim(),
								username: item.user_id.username,
								photo: item.user_id.photo?.url || null,
						  }
						: null,
				})),
			};

			return responsePayload(stats, "success", "Dashboard stats retrieved successfully", 200);
		} catch (error) {
			console.error("Error in getDashboardStats:", error);
			return serverResponseError();
		}
	}

	// Get all users for management
	static async getAllUsers(page = 1, limit = 20, search?: string) {
		await connectToDatabase();
		try {
			const skip = (page - 1) * limit;
			let query: any = { role: "student" };

			if (search) {
				query = {
					...query,
					$or: [
						{ firstname: { $regex: search, $options: "i" } },
						{ lastname: { $regex: search, $options: "i" } },
						{ email: { $regex: search, $options: "i" } },
						{ username: { $regex: search, $options: "i" } },
					],
				};
			}

			const [users, total] = await Promise.all([
				UserSchema.find(query, "-password").sort({ created_at: -1 }).skip(skip).limit(limit).lean(),
				UserSchema.countDocuments(query),
			]);

			const pagination = {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				hasNext: page < Math.ceil(total / limit),
				hasPrev: page > 1,
			};

			return responsePayload({ users, pagination }, "success", "Users retrieved successfully", 200);
		} catch (error) {
			return serverResponseError();
		}
	}

	// Get items by status for admin management
	static async getItemsByStatus(status: string, page = 1, limit = 20) {
		await connectToDatabase();
		try {
			const skip = (page - 1) * limit;
			let query: any = {};

			if (status !== "all") {
				query.status = status;
			}

			const [items, total] = await Promise.all([
				ItemsSchema.find(query)
					.populate("user_id", "firstname lastname email username")
					.sort({ created_at: -1 })
					.skip(skip)
					.limit(limit)
					.lean(),
				ItemsSchema.countDocuments(query),
			]);

			const pagination = {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				hasNext: page < Math.ceil(total / limit),
				hasPrev: page > 1,
			};

			return responsePayload({ items, pagination }, "success", "Items retrieved successfully", 200);
		} catch (error) {
			return serverResponseError();
		}
	}

	// Update item status (approve/reject/archive)
	static async updateItemStatus(
		itemID: string,
		status: "active" | "rejected" | "pending" | "removed" | "claimed",
		adminID: string
	) {
		await connectToDatabase();
		try {
			const item = await ItemsSchema.findById(itemID).populate("user_id", "firstname lastname");
			if (!item) {
				return responsePayload(null, "error", "Item not found", 404);
			}

			item.status = status;
			item.updated_at = new Date();
			await item.save();

			// Send notification to item owner
			const { createNotification } = await import("@/server/handlers/NotificationHandlers");
			const itemOwnerID = item.user_id._id.toString();
			const itemName = item.name;

			if (status === "active") {
				await createNotification(
					itemOwnerID,
					"item_update",
					"Item Approved",
					`Your item "${itemName}" has been approved and is now visible to others.`,
					itemID
				);
			} else if (status === "rejected") {
				await createNotification(
					itemOwnerID,
					"item_update",
					"Item Rejected",
					`Your item "${itemName}" has been rejected. Please review and resubmit.`,
					itemID
				);
			} else if (status === "pending") {
				await createNotification(
					itemOwnerID,
					"item_update",
					"Item Under Review",
					`Your item "${itemName}" has been restored to pending review.`,
					itemID
				);
			} else if (status === "removed") {
				await createNotification(
					itemOwnerID,
					"item_update",
					"Item Archived",
					`Your item "${itemName}" has been archived.`,
					itemID
				);
			}

			// Trigger Pusher events for real-time updates
			// Notify admin dashboard to refresh
			await pusher.trigger("admin-updates", "item-status-changed", {
				itemId: itemID,
				status,
				previousStatus: item.status,
			});

			// Notify the item owner's dashboard to refresh
			await pusher.trigger(`private-user-${itemOwnerID}`, "item-updated", {
				itemId: itemID,
				status,
			});

			// Notify all users about item status changes (for search items real-time updates)
			if (status === "active") {
				await pusher.trigger("global-items", "item-approved", {
					itemId: itemID,
				});
			} else if (status === "claimed") {
				await pusher.trigger("global-items", "item-claimed", {
					itemId: itemID,
				});
			}

			return responsePayload(item, "success", `Item ${status} successfully`, 200);
		} catch (error) {
			console.error("Error in updateItemStatus:", error);
			return serverResponseError();
		}
	}

	// Get recent activity logs
	static async getRecentActivity(page = 1, limit = 50) {
		await connectToDatabase();
		try {
			const skip = (page - 1) * limit;

			const recentItems = await ItemsSchema.find()
				.populate("user_id", "firstname lastname email")
				.sort({ created_at: -1 })
				.skip(skip)
				.limit(limit)
				.lean();

			const activities = recentItems.map((item: any) => ({
				id: item._id,
				type: "item_created",
				description: `${item.user_id?.firstname} ${item.user_id?.lastname} posted a ${item.type} item: ${item.name}`,
				user: item.user_id,
				item: {
					id: item._id,
					name: item.name,
					type: item.type,
					status: item.status,
				},
				timestamp: item.created_at,
			}));

			return responsePayload(activities, "success", "Recent activity retrieved successfully", 200);
		} catch (error) {
			return serverResponseError();
		}
	}
}

export const {
	getAdminDataByID,
	updateAdminDataByID,
	getDashboardStats,
	getAllUsers,
	getItemsByStatus,
	updateItemStatus,
	getRecentActivity,
} = AdminHandlers;
