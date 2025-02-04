import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

const getUserFeed = async () => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.get(`${conf.BACKEND_URL}/feeds/feed`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			withCredentials: true,
		});

		return response.data;
	} catch (error) {
		console.log("Error while fetching user feed:", error);
		return null;
	}
};

const getUserTags = async (type) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.get(`${conf.BACKEND_URL}/feeds/tags/${type}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			withCredentials: true,
		});

		return response.data;
	} catch (error) {
		console.log("Error while fetching user tags:", error);
		return null;
	}
};

const addCustomTag = async (tagData) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.post(
			`${conf.BACKEND_URL}/feeds/tags/${tagData.type}`,
			{ tag: tagData.tag },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		return response.data;
	} catch (error) {
		console.log("Error while adding custom tag:", error);
		return null;
	}
};

const removeTag = async (tagData) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.delete(
			`${conf.BACKEND_URL}/feeds/tags/${tagData.type}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				data: { tag: tagData.tag },
				withCredentials: true,
			},
		);

		return response.data;
	} catch (error) {
		console.log("Error while removing tag:", error);
		return null;
	}
};

const addTagsFromInteraction = async (tags) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		// Fetch user's exclude tags
		const excludeTagsResponse = await getUserTags("exclude");
		const excludeTags = excludeTagsResponse?.data?.excludedTags || [];

		// Filter out tags that are in the exclude list
		const filteredTags = tags.filter((tag) => !excludeTags.includes(tag));

		// Add filtered tags
		const response = await axios.post(
			`${conf.BACKEND_URL}/feeds/tags/include`,
			{ tag: filteredTags },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		return response.data;
	} catch (error) {
		console.log("Error while adding tags from interaction:", error);
		return null;
	}
};

export {
	getUserFeed,
	getUserTags,
	addCustomTag,
	removeTag,
	addTagsFromInteraction,
};
