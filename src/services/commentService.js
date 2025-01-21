import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

export const getVideoComments = async (videoId, page = 1, limit = 10) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.get(
			`${conf.BACKEND_URL}/comments/${videoId}?page=${page}&limit=${limit}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error fetching comments:", error);
		throw error;
	}
};

export const addComment = async (videoId, commentContent) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.post(
			`${conf.BACKEND_URL}/comments/${videoId}`,
			{ commentContent },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error adding comment:", error);
		throw error;
	}
};

export const updateComment = async (commentId, commentContent) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.patch(
			`${conf.BACKEND_URL}/comments/c/${commentId}`,
			{ commentContent },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error updating comment:", error);
		throw error;
	}
};

export const deleteComment = async (commentId) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.delete(
			`${conf.BACKEND_URL}/comments/c/${commentId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error deleting comment:", error);
		throw error;
	}
};