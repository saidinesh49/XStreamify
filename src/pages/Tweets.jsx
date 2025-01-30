import React, { useState, useEffect } from "react";
import { MessageCircle, Heart, Share2, Send, MoreVertical } from "lucide-react";
import { useUserContext } from "../context/UserContext";
import { LoginToAccess } from "../utils/LoginToAccess";
import Loading from "../utils/Loading";
import {
	createTweet,
	getAllTweets,
	likeTweet,
	getTweetComments,
	addCommentToTweet,
	isTweetLikedByUser,
	deleteTweet,
	getTweetLikes,
	getTweetCommentsCount,
	getTweetById,
} from "../services/tweetService";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TweetDetail from "../components/TweetDetail";
import TweetCard from "../components/TweetCard";
import { toast } from "react-toastify";

export default function Tweets() {
	const { userData } = useUserContext();
	const [tweets, setTweets] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [newTweet, setNewTweet] = useState("");
	const [selectedTweet, setSelectedTweet] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [showTweetOptions, setShowTweetOptions] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (userData?.username) {
			fetchTweets();
		}
	}, [userData, currentPage]);

	const fetchTweets = async () => {
		try {
			setLoading(true);
			const response = await getAllTweets(currentPage, 10);
			if (response) {
				setTweets(response.data);
				setTotalPages(response.totalPages);
			}
		} catch (error) {
			toast.error("Error fetching tweets");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateTweet = async (e) => {
		e.preventDefault();
		if (!newTweet.trim()) return;

		try {
			await createTweet(newTweet);
			toast.success("Tweet posted successfully");
			setNewTweet("");
			fetchTweets();
		} catch (error) {
			toast.error("Failed to post tweet");
		}
	};

	const checkLikeStatus = async (tweetId) => {
		const isLiked = await isTweetLikedByUser(tweetId);
		setTweets(
			tweets.map((tweet) =>
				tweet._id === tweetId ? { ...tweet, isLiked } : tweet,
			),
		);
	};

	const handleLike = async (e, tweetId) => {
		e.stopPropagation();
		try {
			await likeTweet(tweetId);
			// Fetch updated likes count
			const newLikesCount = await getTweetLikes(tweetId);
			const isLiked = await isTweetLikedByUser(tweetId);

			setTweets(
				tweets.map((t) =>
					t._id === tweetId
						? {
								...t,
								isLiked,
								likesCount: newLikesCount,
						  }
						: t,
				),
			);

			// Update selected tweet if in modal
			if (selectedTweet && selectedTweet._id === tweetId) {
				setSelectedTweet((prev) => ({
					...prev,
					isLiked,
					likesCount: newLikesCount,
				}));
			}
		} catch (error) {
			toast.error("Failed to like tweet");
		}
	};

	const handleDelete = async (tweetId) => {
		try {
			await deleteTweet(tweetId);
			setTweets(tweets.filter((t) => t._id !== tweetId));
			toast.success("Tweet deleted successfully");
		} catch (error) {
			toast.error("Failed to delete tweet");
		}
		setShowTweetOptions(null);
	};

	const handleTweetClick = (tweet) => {
		console.log("Navigating to tweet:", tweet._id); // Add debug log
		navigate(`/tweets/${tweet._id}`);
	};

	const handleComment = async (e) => {
		e.preventDefault();
		if (!newComment.trim() || !selectedTweet) return;

		try {
			await addCommentToTweet(selectedTweet._id, newComment);
			const response = await getTweetComments(selectedTweet._id);
			if (response?.data) {
				setComments(response.data);
			}
			setNewComment("");
			toast.success("Comment added successfully");
		} catch (error) {
			toast.error("Failed to add comment");
		}
	};

	useEffect(() => {
		const checkTweetsLikeStatus = async () => {
			const updatedTweets = await Promise.all(
				tweets.map(async (tweet) => {
					const isLiked = await isTweetLikedByUser(tweet._id);
					return { ...tweet, isLiked };
				}),
			);
			setTweets(updatedTweets);
		};

		if (tweets.length > 0) {
			checkTweetsLikeStatus();
		}
	}, [tweets.length]);

	const handleOwnerClick = (e, username) => {
		e.stopPropagation();
		navigate(`/c/${username}`);
	};

	const handleShare = (e, tweet) => {
		e.stopPropagation();
		const tweetUrl = `${window.location.origin}/tweets/${tweet._id}`;
		navigator.clipboard.writeText(tweetUrl);
		toast.success("Tweet link copied to clipboard!");
	};

	const handleLoadMore = () => {
		if (currentPage < totalPages) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	if (!userData?.username) {
		return (
			<div className="pt-20 px-4">
				<LoginToAccess />
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading />
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto pt-20 px-4">
			{/* Tweet creation form */}
			<form onSubmit={handleCreateTweet} className="mb-8">
				<div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm">
					<textarea
						value={newTweet}
						onChange={(e) => setNewTweet(e.target.value)}
						placeholder="What's happening?"
						className="w-full bg-transparent border-none focus:ring-0 resize-none text-surface-800 dark:text-white"
						rows="3"
					/>
					<div className="flex justify-end mt-2">
						<button
							type="submit"
							disabled={!newTweet.trim()}
							className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 transition-colors"
						>
							Tweet
						</button>
					</div>
				</div>
			</form>

			{/* Tweets list */}
			<div className="space-y-4">
				{tweets.map((tweet) => (
					<TweetCard
						key={tweet._id}
						tweet={tweet}
						userData={userData}
						onClick={() => handleTweetClick(tweet)} // Ensure this is correct
						onLike={handleLike}
						onShare={handleShare}
						onDelete={handleDelete}
						onOwnerClick={(username) => navigate(`/c/${username}`)}
						showOptions={showTweetOptions}
						onOptionsClick={(id) =>
							setShowTweetOptions(showTweetOptions === id ? null : id)
						}
					/>
				))}
			</div>

			{/* Load More Button */}
			{currentPage < totalPages && (
				<div className="mt-6 text-center">
					<button
						onClick={handleLoadMore}
						className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
					>
						Load More Tweets
					</button>
				</div>
			)}
		</div>
	);
}
