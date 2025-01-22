import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

export const toggleVideoLike = async (videoId) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.post(
			`${conf.BACKEND_URL}/likes/toggle/v/${videoId}`,
			{},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		return response.data;
	} catch (error) {
		console.error("Error toggling video like:", error);
		throw error;
	}
};

export const getVideoLikes = async (videoId) => {
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
		console.error("Error getting video likes:", error);
		throw error;
	}
};

export const isVideoLiked = async (videoId) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return false;
		}

		const response = await axios.get(
			`${conf.BACKEND_URL}/likes/videos/${videoId}/check`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);
		console.log(response);
		return response.data?.data || false;
	} catch (error) {
		console.error("Error checking video like status:", error);
		return false;
	}
};
