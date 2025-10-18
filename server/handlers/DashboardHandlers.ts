import UserSchema from "@/server/models/UserSchema";
import {
	responsePayload,
	serverResponseError,
	userNotFoundError,
} from "@/server/utils/responsePayload";
import { ValidateStringField } from "@/server/utils/DataValitdation";
import mongoose from "mongoose";

class DashboardHandlers {
	static async getUserDataByID(userID: string) {
		try {
			const isValidUserID = await ValidateStringField(userID);
			if (!isValidUserID) return userNotFoundError();

			const userData = await UserSchema.findById(userID).select(
				"-_id -__v -password"
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
				userData,
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
}

export const { getUserDataByID, updateUserDataByID } = DashboardHandlers;
