import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

// Upload a video to Cloudinary
const uploadToCloudinary = async (file, resource_type = "image") => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", conf.UPLOAD_PRESET);

		const response = await fetch(
			`${conf.CLOUDINARY_URL}/${resource_type}/upload`,
			{
				method: "POST",
				body: formData,
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
