import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

const getSearchSuggestions = async (query) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.get(
			`${conf.BACKEND_URL}/search-engine/suggestions`,
			{
				params: { query },
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		return response.data;
	} catch (error) {
		console.log("Error while fetching search suggestions:", error);
		return null;
	}
};

const addSearchTerm = async (term) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.post(
			`${conf.BACKEND_URL}/search-engine/add-term`,
			{ term },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		return response.data;
	} catch (error) {
		console.log("Error while adding search term:", error);
		return null;
	}
};

const getSearchResults = async (query) => {
	try {
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}

		const response = await axios.get(
			`${conf.BACKEND_URL}/search-engine/results`,
			{
				params: { query },
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);
		console.log("Search results: ", response);
		return response?.data;
	} catch (error) {
		console.log("Error while fetching search results:", error);
		return null;
	}
};

export { getSearchSuggestions, addSearchTerm, getSearchResults };
