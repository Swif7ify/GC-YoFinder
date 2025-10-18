import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const cloudConfig = cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

const uploadFiles = async (
	file: File,
	publicIDBase: string,
	folder = "gc-yofinder/users"
) => {
	const buffer = Buffer.from(await file.arrayBuffer());
	const publicID = `${publicIDBase}-${Date.now()}`;
	return new Promise<{ url: string; public_id: string }>(
		(resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder,
					public_id: publicID,
					resource_type: "image",
					overwrite: true,
					transformation: [
						{ quality: "auto" },
						{ fetch_format: "auto" },
					],
				},
				(error, result) => {
					if (error) return reject(error);
					if (!result)
						return reject(new Error("No result from Cloudinary"));
					resolve(result);
				}
			);
			streamifier.createReadStream(buffer).pipe(uploadStream);
		}
	);
};

const deleteFiles = async (
	publicIds: string[],
	resourceType: "image" | "video" | "raw" | "auto" = "image"
) => {
	try {
		if (!publicIds || publicIds.length === 0) {
			return { success: true, results: [] };
		}

		const validPublicIds = publicIds.filter(
			(id) => id && typeof id === "string" && id.trim().length > 0
		);

		if (validPublicIds.length === 0) {
			return { success: true, results: [] };
		}

		const deletePromises = validPublicIds.map((publicId) =>
			cloudinary.uploader.destroy(publicId, {
				resource_type: resourceType,
			})
		);

		const results = await Promise.all(deletePromises);

		results.forEach((result, index) => {
			if (result.result !== "ok" && result.result !== "not found") {
				console.warn(
					`Failed to delete image ${validPublicIds[index]}:`,
					result
				);
			}
		});

		return { success: true, results };
	} catch (error) {
		console.error("Error in deleteFiles:", error);
		return { success: false, error };
	}
};

export { cloudConfig, streamifier, uploadFiles, deleteFiles };
