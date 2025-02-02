import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";
import { uploadToCloudinary } from "./cloudinaryService";

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
		if (
			!videoData?.title ||
			!videoData?.description ||
			!videoData?.videoFile ||
			!videoData?.thumbnail
		) {
			throw new Error("Missing required fields");
		}

		console.log("Video data: Before: ", videoData);

		// Upload video to Cloudinary
		const video = await uploadToCloudinary(videoData.videoFile, "VIDEO");

		console.log("After video upload to cloudinary: ", video);

		if (!video?.secure_url) {
			throw new Error("Failed to upload video to Cloudinary");
		}

		// Upload thumbnail to Cloudinary if provided
		console.log("Entered for thumbnail");
		const thumbnail = await uploadToCloudinary(
			videoData.thumbnail,
			"THUMBNAIL",
		);
		if (!thumbnail?.secure_url) {
			throw new Error("Failed to upload thumbnail to Cloudinary");
		}
		const thumbnailUrl = thumbnail?.secure_url;

		// Send video details to backend
		const accessToken = getCookie("accessToken");
		const response = await axios.post(
			`${conf.BACKEND_URL}/videos/`,
			{
				title: videoData.title,
				description: videoData.description,
				videoUrl: video?.secure_url,
				duration: video?.duration,
				thumbnailUrl: thumbnailUrl,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
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
const updateVideo = async (videoId, { title, description, thumbnail = "" }) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}
		let thumbnailUrl = "";
		if (thumbnail) {
			const newThumbnailResponse = await uploadToCloudinary(
				thumbnail,
				"THUMBNAIL",
			);
			console.log("newthumbnail response: ", newThumbnailResponse);
			if (!newThumbnailResponse?.secure_url) {
				throw new Error("Failed to upload new thumbnail to Cloudinary");
			}
			thumbnailUrl = newThumbnailResponse?.secure_url;
		}

		const response = await axios.patch(
			`${conf.BACKEND_URL}/videos/${videoId}`,
			{ title, description, thumbnailUrl: thumbnailUrl || "" },
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
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
