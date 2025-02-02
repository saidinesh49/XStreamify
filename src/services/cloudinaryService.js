import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

// Upload a video to Cloudinary
const uploadToCloudinary = async (file, resource_type = "OTHER") => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		let upload_preset;
		if (resource_type === "THUMBNAIL")
			upload_preset = conf.THUMBNAIL_UPLOAD_PRESET;
		else if (resource_type === "VIDEO")
			upload_preset = conf.VIDEO_UPLOAD_PRESET;
		else if (resource_type === "COVERIMAGE")
			upload_preset = conf.COVERIMAGE_UPLOAD_PRESET;
		else if (resource_type === "AVATAR")
			upload_preset = conf.AVATAR_UPLOAD_PRESET;
		else upload_preset = conf.OTHER_UPLOAD_PRESET;
		formData.append("upload_preset", upload_preset);

		const response = await fetch(
			`${conf.CLOUDINARY_URL}/${
				resource_type === "VIDEO" ? "video" : "image"
			}/upload`,
			{
				method: "POST",
				body: formData,
				mode: "cors",
			},
		);

		const data = await response.json();
		return data; // Return the secureURL, duration(if video) of the uploaded video
	} catch (error) {
		console.error("Error uploading video to Cloudinary:", error);
		throw error;
	}
};

export { uploadToCloudinary };
