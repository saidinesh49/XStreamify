import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

const createTweet = async (content) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.post(
			`${conf.BACKEND_URL}/tweets/`,
			{ content },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);
		return response.data?.data;
	} catch (error) {
		console.error("Error creating tweet:", error);
		throw error;
	}
};

const getTweetOwner = async (ownerId) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.get(`${conf.BACKEND_URL}/users/${ownerId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			withCredentials: true,
		});
		return response.data?.data;
	} catch (error) {
		console.error("Error fetching tweet owner:", error);
		return null;
	}
};

const getTweetLikes = async (tweetId) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.get(
			`${conf.BACKEND_URL}/likes/tweets/${tweetId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);
		console.log("Tweet likes:", response);
		return response.data?.data?.numberOfLikes || 0;
	} catch (error) {
		console.error("Error getting tweet likes:", error);
		return 0;
	}
};

const getTweetCommentsCount = async (tweetId) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.get(
			`${conf.BACKEND_URL}/comments/count/tweets/${tweetId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);
		return response.data?.data?.count || 0;
	} catch (error) {
		console.error("Error getting tweet comments count:", error);
		return 0;
	}
};

const getUserTweets = async (userId) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.get(
			`${conf.BACKEND_URL}/tweets/user/${userId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		// Fetch owner details for each tweet
		if (response.data?.data) {
			const tweetsWithDetails = await Promise.all(
				response.data.data.map(async (tweet) => {
					const [owner, likesCount, commentsCount, isLiked] = await Promise.all(
						[
							getTweetOwner(tweet.owner),
							getTweetLikes(tweet._id),
							getTweetCommentsCount(tweet._id),
							isTweetLikedByUser(tweet._id),
						],
					);

					return {
						...tweet,
						owner: owner || { username: "unknown", fullName: "Unknown User" },
						likesCount,
						commentsCount,
						isLiked,
					};
				}),
			);
			return { ...response.data, data: tweetsWithDetails };
		}
		return response.data;
	} catch (error) {
		console.error("Error fetching tweets:", error);
		return null;
	}
};

const getAllTweets = async (page = 1, limit = 10) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.get(`${conf.BACKEND_URL}/tweets`, {
			params: { page, limit },
			headers: { Authorization: `Bearer ${accessToken}` },
			withCredentials: true,
		});

		if (response.data?.data?.tweets) {
			// Get details for each tweet
			const tweetsWithDetails = await Promise.all(
				response.data.data.tweets.map(async (tweet) => {
					// Tweet already has owner details from populate
					const [likesCount, commentsCount, isLiked] = await Promise.all([
						getTweetLikes(tweet._id),
						getTweetCommentsCount(tweet._id),
						isTweetLikedByUser(tweet._id),
					]);

					return {
						...tweet,
						likesCount,
						commentsCount,
						isLiked,
					};
				}),
			);

			return {
				data: tweetsWithDetails,
				totalPages: response.data.data.totalPages,
				currentPage: response.data.data.currentPage,
				totalTweets: response.data.data.totalTweets,
			};
		}
		return null;
	} catch (error) {
		console.error("Error fetching all tweets:", error);
		return null;
	}
};

const getTweetComments = async (tweetId) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.get(
			`${conf.BACKEND_URL}/comments/tweets/${tweetId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching tweet comments:", error);
		return null;
	}
};

const addCommentToTweet = async (tweetId, content) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.post(
			`${conf.BACKEND_URL}/comments/tweets/${tweetId}`,
			{ content },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error adding comment:", error);
		throw error;
	}
};

const likeTweet = async (tweetId) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.post(
			`${conf.BACKEND_URL}/likes/toggle/t/${tweetId}`,
			{},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);
		return response.data?.data;
	} catch (error) {
		console.error("Error toggling tweet like:", error);
		throw error;
	}
};

const isTweetLikedByUser = async (tweetId) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.get(
			`${conf.BACKEND_URL}/likes/tweets/${tweetId}/check`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);
		return response.data?.data?.isLiked || false;
	} catch (error) {
		console.error("Error checking tweet like status:", error);
		return false;
	}
};

const deleteTweet = async (tweetId) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.delete(
			`${conf.BACKEND_URL}/tweets/${tweetId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error deleting tweet:", error);
		throw error;
	}
};

const getTweetById = async (tweetId) => {
	try {
		const accessToken = getCookie("accessToken");
		console.log("Fetching tweet with ID:", tweetId);

		// Get tweet with populated owner
		const response = await axios.get(`${conf.BACKEND_URL}/tweets/${tweetId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			withCredentials: true,
		});

		console.log("Tweet API response:", response);

		if (response?.data?.data) {
			const tweet = response.data.data;

			// No need to fetch owner separately since it's populated from backend
			const [likesCount, commentsCount, isLiked] = await Promise.all([
				getTweetLikes(tweet._id),
				getTweetCommentsCount(tweet._id),
				isTweetLikedByUser(tweet._id),
			]);

			return {
				...tweet,
				likesCount,
				commentsCount,
				isLiked,
			};
		}
		console.log("No tweet data in response");
		return null;
	} catch (error) {
		console.error("Error in getTweetById:", error);
		return null;
	}
};

export {
	createTweet,
	getUserTweets,
	getAllTweets,
	getTweetComments,
	addCommentToTweet,
	likeTweet,
	isTweetLikedByUser,
	deleteTweet,
	getTweetOwner,
	getTweetLikes,
	getTweetCommentsCount,
	getTweetById,
};
