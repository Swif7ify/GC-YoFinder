import { uploadFiles, deleteFiles } from "@/server/config/cloudinary.config";
import { PhotoMetadata } from "@/types/types";

interface UploadResult {
    uploadedPublicIds: string[];
    imageMetadata: PhotoMetadata[];
}

export async function handleImagesUpload(
	photos: File[],
	userID: string,
	maxImages = 5
): Promise<UploadResult | false> {
	if (!Array.isArray(photos) || photos.length === 0) {
		return { uploadedPublicIds: [], imageMetadata: [] };
	}

	const validImages = photos
		.filter((img) => img instanceof File && img.size > 0)
		.slice(0, maxImages);

	if (validImages.length === 0) {
		return { uploadedPublicIds: [], imageMetadata: [] };
	}

	const uploadedPublicIds: string[] = [];
	const timestamp = Date.now();

	try {
		const uploadPromises = validImages.map((image, idx) => {
			const publicIdBase = `items_${userID}_${timestamp}_${idx}`;
			return uploadFiles(image, publicIdBase, "gc-yofinder/items");
		});

		const uploadResults = await Promise.all(uploadPromises);

        const buildImageMeta = (res: any): PhotoMetadata => ({
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

		uploadResults.forEach((res) => {
			if (res.public_id) {
				uploadedPublicIds.push(res.public_id);
			}
		});

        const imageMetadata = uploadResults.map(buildImageMeta);

        return { uploadedPublicIds, imageMetadata };
	} catch (uploadError) {
		console.error("Image upload failed:", uploadError);
		// Clean up any uploaded images on failure
		if (uploadedPublicIds.length > 0) {
			await deleteFiles(uploadedPublicIds).catch((err) =>
				console.error("Failed to delete uploaded images:", err)
			);
		}
		return false;
	}
}
