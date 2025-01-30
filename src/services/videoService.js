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
		return data; // Return the URL of the uploaded video
	} catch (error) {
		console.error("Error uploading video to Cloudinary:", error);
		throw error;
	}
};

// Fetch all videos with optional filters, sorting, and pagination
const getAllVideos = async ({
	page = 1,
	limit = 10,
	query = "",
	sortBy = "views",
	sortType = "desc",
	userId = "",
}) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.get(`${conf.BACKEND_URL}/videos`, {
			params: { page, limit, query, sortBy, sortType, userId },
			headers: { Authorization: `Bearer ${accessToken}` },
			withCredentials: true,
		});

		if (!response?.data) {
			console.log("Problem occurred while fetching videos");
			return null;
		}

		return response.data;
	} catch (error) {
		console.log("Error while fetching videos: ", error);
		return null;
	}
};

// Upload a video
const uploadVideo = async (videoData) => {
	try {
		// Ensure all required fields are present
		if (!videoData?.title || !videoData?.description || !videoData?.videoFile) {
			throw new Error("Missing required fields");
		}

		console.log("Video data: Before: ", videoData);

		// Upload video to Cloudinary
		const video = await uploadToCloudinary(videoData.videoFile, "video");

		console.log("After video upload: ", video);

		// Upload thumbnail to Cloudinary if provided
		let thumbnail = "";
		if (videoData?.thumbnail) {
			thumbnail = await uploadToCloudinary(videoData.thumbnail, "image");
		}

		// Send video details to backend
		const accessToken = getCookie("accessToken");
		const response = await axios.post(
			`${conf.BACKEND_URL}/videos/`,
			{
				title: videoData.title,
				description: videoData.description,
				videoUrl: video?.secure_url,
				duration: video?.duration,
				thumbnailUrl: thumbnail?.secure_url || "",
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				withCredentials: true,
			},
		);

		console.log(response);

		return response.data;
	} catch (error) {
		console.error("Error uploading video:", error);
		throw error;
	}
};

// Fetch a video by ID
const getVideoById = async (videoId) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.get(`${conf.BACKEND_URL}/videos/${videoId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			withCredentials: true,
		});

		if (!response?.data) {
			console.log("Problem occurred while fetching video");
			return null;
		}

		return response.data;
	} catch (error) {
		console.log("Error while fetching video: ", error);
		return null;
	}
};

// Update a video
const updateVideo = async (videoId, { title, description, thumbnail }) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.patch(
			`${conf.BACKEND_URL}/videos/${videoId}`,
			{ title, description, thumbnail },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		if (!response?.data) {
			console.log("Problem occurred while updating video");
			return null;
		}

		return response.data;
	} catch (error) {
		console.log("Error while updating video: ", error);
		return null;
	}
};

// Delete a video
const deleteVideo = async (videoId) => {
	try {
		if (!videoId) {
			console.log("videoId is required!");
			return null;
		}
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.delete(
			`${conf.BACKEND_URL}/videos/${videoId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		if (!response?.data) {
			console.log("Problem occurred while deleting video");
			return null;
		}

		return response.data;
	} catch (error) {
		console.log("Error while deleting video: ", error);
		return null;
	}
};

// Toggle publish status of a video
const togglePublishStatus = async (videoId) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.patch(
			`${conf.BACKEND_URL}/videos/toggle/publish/${videoId}`,
			{},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		if (!response?.data) {
			console.log("Problem occurred while toggling publish status");
			return null;
		}

		return response.data;
	} catch (error) {
		console.log("Error while toggling publish status: ", error);
		return null;
	}
};

// Get video likes count
const getVideoLikesCount = async (videoId) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.get(
			`${conf.BACKEND_URL}/likes/videos/${videoId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		return response.data;
	} catch (error) {
		console.log("Error while fetching video likes: ", error);
		return null;
	}
};

export {
	getAllVideos,
	uploadVideo,
	getVideoById,
	updateVideo,
	deleteVideo,
	togglePublishStatus,
	getVideoLikesCount,
};
