import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { toast } from "react-toastify";
import TweetCard from "../components/TweetCard";
import Loading from "../utils/Loading";
import { useUserContext } from "../context/UserContext";
import {
	getTweetById,
	getTweetComments,
	addCommentToTweet,
	likeTweet,
	deleteTweet,
	getTweetLikes,
	isTweetLikedByUser,
} from "../services/tweetService";

export default function TweetDetails() {
	const { tweetId } = useParams();
	const navigate = useNavigate();
	const { userData } = useUserContext();
	const [tweet, setTweet] = useState(null);
	const [comments, setComments] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [newComment, setNewComment] = useState("");
	const [showOptions, setShowOptions] = useState(false);

	useEffect(() => {
		loadTweetDetails();
	}, [tweetId]);

	const loadTweetDetails = async () => {
		try {
			setIsLoading(true);
			const tweetData = await getTweetById(tweetId);
			console.log("Loaded tweet data:", tweetData); // Debug log

			if (!tweetData || !tweetData.owner) {
				console.log("Invalid tweet data:", tweetData);
				navigate("/404NotFound");
				return;
			}

			setTweet(tweetData);
			const commentsResponse = await getTweetComments(tweetId);
			setComments(commentsResponse?.data || []);
		} catch (error) {
			console.error("Error loading tweet:", error); // Improved error logging
			toast.error("Failed to load tweet");
			navigate("/tweets");
		} finally {
			setIsLoading(false);
		}
	};

	const handleLike = async (e) => {
		e.preventDefault();
		try {
			await likeTweet(tweetId);
			const [newLikesCount, isLiked] = await Promise.all([
				getTweetLikes(tweetId),
				isTweetLikedByUser(tweetId),
			]);
			setTweet((prev) => ({
				...prev,
				isLiked,
				likesCount: newLikesCount,
			}));
		} catch (error) {
			toast.error("Failed to like tweet");
		}
	};

	const handleComment = async (e) => {
		e.preventDefault();
		try {
			await addCommentToTweet(tweetId, newComment);
			const commentsResponse = await getTweetComments(tweetId);
			setComments(commentsResponse?.data || []);
			setNewComment("");
			toast.success("Comment added successfully");
		} catch (error) {
			toast.error("Failed to add comment");
		}
	};

	const handleDelete = async () => {
		try {
			await deleteTweet(tweetId);
			toast.success("Tweet deleted successfully");
			navigate("/tweets");
		} catch (error) {
			toast.error("Failed to delete tweet");
		}
	};

	const handleShare = () => {
		const tweetUrl = `${window.location.origin}/tweets/${tweet._id}`;
		navigator.clipboard.writeText(tweetUrl);
		toast.success("Tweet link copied to clipboard!");
	};

	const handleProfileNavigate = (username) => {
		navigate(`/c/${username}`);
	};

	const handleOptionsClick = () => {
		setShowOptions(!showOptions);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading />
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto pt-20 px-4">
			<button
				onClick={() => navigate("/tweets")}
				className="mb-4 text-surface-600 dark:text-surface-400 hover:text-primary-500 transition-colors"
			>
				← Back to Tweets
			</button>

			{tweet && (
				<div className="space-y-6">
					<TweetCard
						tweet={tweet}
						userData={userData}
						onLike={handleLike}
						onShare={handleShare}
						onDelete={handleDelete}
						onOwnerClick={handleProfileNavigate}
						showOptions={showOptions}
						onOptionsClick={handleOptionsClick}
						hideNavigation // Add this to prevent navigation when clicking the tweet
					/>

					{/* Comments Section */}
					<div className="bg-white dark:bg-surface-800 rounded-xl p-4">
						<h3 className="font-medium text-surface-800 dark:text-white mb-4">
							Comments ({comments.length})
						</h3>

						<form onSubmit={handleComment} className="flex gap-4 mb-6">
							<input
								type="text"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Add a comment..."
								className="flex-1 px-4 py-2 rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700"
							/>
							<button
								type="submit"
								disabled={!newComment.trim()}
								className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
							>
								<Send className="w-5 h-5" />
							</button>
						</form>

						<div className="space-y-4">
							{comments.map((comment) => (
								<div key={comment._id} className="flex items-start gap-3 p-2">
									<img
										src={
											comment.owner.avatar ||
											`https://ui-avatars.com/api/?name=${comment.owner.fullName}`
										}
										alt={comment.owner.fullName}
										className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
										onClick={() =>
											handleProfileNavigate(comment.owner.username)
										}
									/>
									<div className="flex-1">
										<div
											className="flex items-center gap-2 group cursor-pointer"
											onClick={() =>
												handleProfileNavigate(comment.owner.username)
											}
										>
											<span className="font-medium text-surface-800 dark:text-white group-hover:text-primary-500 transition-colors">
												{comment.owner.fullName}
											</span>
											<span className="text-surface-500 text-sm group-hover:text-primary-400">
												@{comment.owner.username}
											</span>
										</div>
										<p className="text-surface-600 dark:text-surface-300">
											{comment.content}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
