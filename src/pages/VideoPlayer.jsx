import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVideoById, getVideoLikesCount } from "../services/videoService";
import {
	getUserByObjectId,
	isUserSubcribedToChannel,
	toggleChannelSubscription,
} from "../services/channelService";
import { useUserContext } from "../context/UserContext";
import Loading from "../utils/Loading";
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	Settings,
	Maximize,
	ThumbsUp,
	Share2,
	Heart,
	MessageSquare,
	Send,
	MoreVertical,
} from "lucide-react";
import { toggleVideoLike, isVideoLiked } from "../services/likeService";
import {
	getVideoComments,
	addComment,
	deleteComment,
	updateComment,
} from "../services/commentService";
import { toast } from "react-toastify";
import { LoginToAccess } from "../utils/LoginToAccess";
import "@fortawesome/fontawesome-free/css/all.min.css";
import CommentCard from "../components/CommentCard";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Captions } from "@vidstack/react";
import {
	defaultLayoutIcons,
	DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

export default function VideoPlayer() {
	const { videoId } = useParams();
	const [video, setVideo] = useState(null);
	const [owner, setOwner] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [showShareModal, setShowShareModal] = useState(false);
	const [showSponsorModal, setShowSponsorModal] = useState(false);
	const [comments, setComments] = useState([]);
	const [totalComments, setTotalComments] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [newComment, setNewComment] = useState("");
	const [editingComment, setEditingComment] = useState(null);

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		if (!userData) {
			toast.error("Please login to comment");
			return;
		}
		if (!newComment.trim()) return;

		try {
			const response = await addComment(videoId, newComment.trim());
			if (response?.data) {
				setComments([response.data, ...comments]);
				setTotalComments((prev) => prev + 1);
				setNewComment("");
				toast.success("Comment added successfully");
			}
		} catch (error) {
			toast.error("Failed to add comment");
		}
	};

	const handleCommentDelete = async (commentId) => {
		try {
			await deleteComment(commentId);
			setComments(comments.filter((c) => c._id !== commentId));
			setTotalComments((prev) => prev - 1);
			toast.success("Comment deleted successfully");
		} catch (error) {
			toast.error("Failed to delete comment");
		}
	};

	const handleCommentUpdate = async (commentId, content) => {
		try {
			const response = await updateComment(commentId, content);
			if (response?.data) {
				setComments(
					comments.map((c) =>
						c._id === commentId ? { ...c, content: response.data?.content } : c,
					),
				);
				setEditingComment(null);
				toast.success("Comment updated successfully");
				return true;
			}
		} catch (error) {
			toast.error("Failed to update comment");
			return false;
		}
	};
	const videoRef = useRef(null);
	const { userData } = useUserContext();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchVideoAndDetails = async () => {
			try {
				setIsLoading(true);
				const videoResponse = await getVideoById(videoId);
				console.log(videoResponse);
				if (videoResponse?.data) {
					setVideo(videoResponse.data);

					// Fetch like status and count
					const [likeStatus, likesResponse] = await Promise.all([
						isVideoLiked(videoId),
						getVideoLikesCount(videoId),
					]);
					setIsLiked(likeStatus);
					if (likesResponse?.data) {
						setLikesCount(likesResponse.data.numberOfLikes);
					}

					// Fetch comments
					const commentsResponse = await getVideoComments(videoId, 1, 10);
					if (commentsResponse?.data) {
						setComments(commentsResponse.data.comments);
						setTotalComments(commentsResponse.data.totalComments);
					}

					// Fetch owner details
					if (videoResponse?.data?.owner) {
						const ownerResponse = await getUserByObjectId(
							videoResponse.data.owner,
						);
						setOwner(ownerResponse.data);
						setIsSubscribed(isUserSubcribedToChannel(videoResponse.data.owner));
					}
				} else {
					setError("Video not found");
				}
			} catch (error) {
				console.error("Error fetching video details:", error);
				setError("Failed to load video details");
			} finally {
				setIsLoading(false);
			}
		};

		fetchVideoAndDetails();
	}, [videoId, userData]);

	const handleSubscribe = async () => {
		if (!userData) {
			toast.error("Please login to subscribe");
			return;
		}
		try {
			await toggleChannelSubscription(owner?._id);
			setIsSubscribed(!isSubscribed);
			toast.success(
				isSubscribed ? "Unsubscribed successfully" : "Subscribed successfully",
			);
		} catch (error) {
			toast.error("Failed to update subscription");
			console.error("Subscription error:", error);
		}
	};

	const togglePlay = () => {
		if (videoRef.current.paused) {
			videoRef.current.play();
			setIsPlaying(true);
		} else {
			videoRef.current.pause();
			setIsPlaying(false);
		}
	};

	const toggleMute = () => {
		videoRef.current.muted = !videoRef.current.muted;
		setIsMuted(!isMuted);
	};

	const handleVolumeChange = (e) => {
		const value = parseFloat(e.target.value);
		setVolume(value);
		videoRef.current.volume = value;
		setIsMuted(value === 0);
	};

	const toggleFullscreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			videoRef.current.requestFullscreen();
		}
	};

	const handleLike = async () => {
		if (!userData) {
			toast.error("Please login to like the video");
			return;
		}
		try {
			const response = await toggleVideoLike(videoId);
			setIsLiked(!isLiked);
			setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
			toast.success(isLiked ? "Like removed" : "Video liked");
		} catch (error) {
			toast.error("Failed to update like");
			console.error("Like error:", error);
		}
	};

	const handleShare = () => {
		setShowShareModal(true);
	};

	const copyVideoLink = () => {
		const videoUrl = `${window.location.origin}/videos/${videoId}`;
		navigator.clipboard.writeText(videoUrl);
		toast.success("Link copied to clipboard!");
		setShowShareModal(false);
	};

	const handleProfileClick = (props) => {
		props.e.stopPropagation(); // Prevent video play/pause
		if (props?.username) {
			navigate(`/c/${props.username}`);
		}
	};

	if (isLoading)
		return (
			<div className="flex items-center justify-center h-screen">
				<Loading />
			</div>
		);
	if (!userData?.username)
		return (
			<div className="pt-20">
				<LoginToAccess />
			</div>
		);
	if (error)
		return <div className="text-center text-red-500 pt-20">{error}</div>;
	if (!video) return null;

	return (
		<div className="pt-20 px-4 max-w-7xl mx-auto">
			<div className="relative aspect-video bg-black rounded-xl overflow-hidden">
				{/* <video
					ref={videoRef}
					src={video?.videoFile}
					className="w-full h-full"
					poster={video?.thumbnail}
					onClick={togglePlay}
				/> */}
				{/* Video Controls
				<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
					<div className="flex items-center gap-4">
						<button
							onClick={togglePlay}
							className="text-white hover:text-primary-400"
						>
							{isPlaying ? (
								<Pause className="w-6 h-6" />
							) : (
								<Play className="w-6 h-6" />
							)}
						</button>

						<div className="flex items-center gap-2">
							<button
								onClick={toggleMute}
								className="text-white hover:text-primary-400"
							>
								{isMuted ? (
									<VolumeX className="w-6 h-6" />
								) : (
									<Volume2 className="w-6 h-6" />
								)}
							</button>
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={volume}
								onChange={handleVolumeChange}
								className="w-24"
							/>
						</div>
						<button
							onClick={toggleFullscreen}
							className="text-white hover:text-primary-400 ml-auto"
						>
							<Maximize className="w-6 h-6" />
						</button>
					</div>
				</div> */}

				<MediaPlayer title={video?.title} src={video?.videoFile}>
					<MediaProvider />
					<DefaultVideoLayout
						thumbnails={video?.thumbnail}
						icons={defaultLayoutIcons}
					/>
				</MediaPlayer>
			</div>

			<div className="mt-4">
				<h1 className="text-2xl font-bold text-surface-900 dark:text-white">
					{video.title}
				</h1>
				{/* New interaction section */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
					{/* Channel info and subscribe button */}
					<div className="flex items-center gap-4 w-full sm:w-auto">
						<div
							className="flex items-center gap-4 cursor-pointer"
							onClick={(e) => {
								handleProfileClick({ e, username: owner?.username });
							}}
						>
							<img
								src={
									owner?.avatar ||
									`https://ui-avatars.com/api/?name=${owner?.fullName}`
								}
								alt={owner?.fullName}
								className="w-10 h-10 rounded-full"
							/>
							<div>
								<h3 className="font-medium text-surface-800 dark:text-white">
									{owner?.fullName}
								</h3>
								<p className="text-sm text-surface-600 dark:text-surface-400">
									@{owner?.username}
								</p>
							</div>
						</div>

						{userData?._id !== owner?._id && (
							<button
								onClick={handleSubscribe}
								className={`px-6 py-2 rounded-full font-medium transition-all ${
									isSubscribed
										? "bg-surface-200 dark:bg-surface-700"
										: "bg-primary-600 text-white hover:bg-primary-700"
								}`}
							>
								{isSubscribed ? "Subscribed" : "Subscribe"}
							</button>
						)}
					</div>

					{/* Like and Share buttons */}
					<div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
						<button
							onClick={handleLike}
							className={`flex items-center gap-2 px-4 py-2 rounded-full ${
								isLiked
									? "bg-primary-100/10 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
									: "hover:bg-surface-100 dark:hover:bg-surface-800"
							}`}
						>
							<ThumbsUp
								className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
							/>
							<span>{likesCount}</span>
						</button>

						<button
							onClick={handleShare}
							className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800"
						>
							<Share2 className="w-5 h-5" />
							<span>Share</span>
						</button>

						<button
							onClick={() => setShowSponsorModal(true)}
							className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800"
						>
							<Heart className="w-5 h-5" />
							<span>Sponsor</span>
						</button>
					</div>
				</div>

				{/* Share Modal */}
				{showShareModal && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
						<div className="bg-white dark:bg-surface-800 rounded-lg p-6 w-full max-w-md mx-4">
							<h3 className="text-lg font-semibold mb-4">Share Video</h3>
							<div className="flex items-center gap-2">
								<input
									type="text"
									readOnly
									value={`${window.location.origin}/videos/${videoId}`}
									className="flex-1 p-2 bg-surface-50 dark:bg-surface-700 rounded border border-surface-200 dark:border-surface-600"
								/>
								<button
									onClick={copyVideoLink}
									className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
								>
									Copy
								</button>
							</div>
							<button
								onClick={() => setShowShareModal(false)}
								className="mt-4 w-full px-4 py-2 border border-surface-200 dark:border-surface-600 rounded hover:bg-surface-50 dark:hover:bg-surface-700"
							>
								Close
							</button>
						</div>
					</div>
				)}

				{/* Sponsor Modal */}
				{showSponsorModal && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
						<div className="bg-white dark:bg-surface-800 rounded-lg p-6 w-full max-w-md mx-4">
							<div className="text-center">
								<Heart className="w-12 h-12 text-primary-500 mx-auto mb-4" />
								<h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
								<p className="text-surface-600 dark:text-surface-400 mb-4">
									Channel sponsorship feature is under development. Stay tuned!
								</p>
								<button
									onClick={() => setShowSponsorModal(false)}
									className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
								>
									Got it
								</button>
							</div>
						</div>
					</div>
				)}

				<div className="mt-6 p-4 bg-surface-200 dark:bg-surface-800 rounded-lg">
					<p className="text-surface-700 dark:text-surface-300 whitespace-pre-line">
						{video?.description}
					</p>
				</div>

				{/* Comments Section */}
				<div className="mt-6">
					<h3 className="text-lg font-semibold mb-4">
						Comments ({totalComments})
					</h3>

					{/* Comment Form */}
					<form onSubmit={handleCommentSubmit} className="flex gap-4 mb-6">
						<input
							type="text"
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Add a comment..."
							className="flex-1 px-4 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 focus:ring-2 focus:ring-primary-500"
						/>
						<button
							type="submit"
							disabled={!newComment.trim()}
							className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
						>
							<Send className="w-5 h-5" />
						</button>
					</form>

					{/* Comments List */}
					<div className="space-y-4">
						{comments.map((comment) => (
							<CommentCard
								key={comment._id}
								comment={comment}
								owner={owner}
								userData={userData}
								handleProfileClick={handleProfileClick}
								handleCommentDelete={handleCommentDelete}
								handleCommentUpdate={handleCommentUpdate}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
