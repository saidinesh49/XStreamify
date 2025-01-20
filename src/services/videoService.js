import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

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
		const formData = new FormData();
		
		// Ensure all required fields are present
		if (!videoData.title || !videoData.description || !videoData.videoFile) {
			throw new Error("Missing required fields");
		}

		// Get the full path and append it as a field
		const videoPath = videoData.videoFile.path || videoData.videoFile;
		formData.append('videoFile', videoData.videoFile);
		formData.append('title', videoData.title);
		formData.append('description', videoData.description);
		
		if (videoData.thumbnail) {
			const thumbnailPath = videoData.thumbnail.path || videoData.thumbnail;
			formData.append('thumbnail', thumbnailPath);
		}

		// Log the paths for debugging
		console.log('Video path:', videoPath);
		if (videoData.thumbnail) {
			console.log('Thumbnail path:', videoData.thumbnail.path);
		}

		const response = await axios.post(
			`${conf.BACKEND_URL}/videos`, 
			formData,
			{
				headers: { 
					Authorization: `Bearer ${getCookie('accessToken')}`,
					'Content-Type': 'multipart/form-data'
				},
				withCredentials: true
			}
		);
		
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

export {
	getAllVideos,
	uploadVideo,
	getVideoById,
	updateVideo,
	deleteVideo,
	togglePublishStatus,
};
