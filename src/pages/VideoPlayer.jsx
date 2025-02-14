import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
	ChevronUp,
	ChevronDown,
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
import { addTagsFromInteraction } from "../services/recommendationService";
import { getPlaylistById } from "../services/playlistService";
import { PageNotFound } from "../utils/PageNotFound";

export default function VideoPlayer() {
	const { videoId } = useParams();
	const location = useLocation();
	const [video, setVideo] = useState(null);
	const [owner, setOwner] = useState(null);
	const [loading, setLoading] = useState(true);
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
	const [showPlaylistDrawer, setShowPlaylistDrawer] = useState(false);
	const [playlistVideos, setPlaylistVideos] = useState([]);
	const { userData } = useUserContext();
	const navigate = useNavigate();
	const playerRef = useRef(null);

	// Extract playlist ID from URL if it exists
	const playlistId = new URLSearchParams(location.search).get('playlist');

	useEffect(() => {
		const fetchVideoAndDetails = async () => {
			try {
				setLoading(true);
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
					if (videoResponse.data.owner) {
						const ownerResponse = await getUserByObjectId(
							videoResponse.data.owner,
						);
						setOwner(ownerResponse.data);
						const isSubbed = await isUserSubcribedToChannel(videoResponse.data.owner);
						setIsSubscribed(isSubbed);
					}

					// Fetch playlist if playlistId exists
					if (playlistId) {
						const playlistResponse = await getPlaylistById(playlistId);
						if (playlistResponse?.data) {
							const playlistVideosDetails = await Promise.all(
								playlistResponse.data.videos.map(async (videoId) => {
									const videoResponse = await getVideoById(videoId);
									return videoResponse?.data;
								})
							);
							setPlaylistVideos(playlistVideosDetails.filter(Boolean));
						}
					}
				} else {
					setError("Video not found");
				}
			} catch (error) {
				console.error("Error fetching video details:", error);
				setError("Failed to load video details");
			} finally {
				setLoading(false);
			}
		};

		fetchVideoAndDetails();
	}, [videoId, playlistId, userData]);

	const handleVideoChange = (newVideoId) => {
		navigate(`/videos/${newVideoId}?playlist=${playlistId}`);
		setShowPlaylistDrawer(false);
	};

	const handleVideoEnd = () => {
		if (playlistVideos.length > 0) {
			const currentIndex = playlistVideos.findIndex(v => v._id === videoId);
			if (currentIndex < playlistVideos.length - 1) {
				const nextVideo = playlistVideos[currentIndex + 1];
				navigate(`/videos/${nextVideo._id}?playlist=${playlistId}`);
			}
		}
	};

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

				// Add tags from interaction
				if (video.tags && video.tags.length > 0) {
					await addTagsFromInteraction(video.tags);
				}
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

	const handleSubscribe = async () => {
		if (!userData) {
			toast.error("Please login to subscribe");
			return;
		}
		try {
			await toggleChannelSubscription(video?.owner);
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
		if (playerRef.current.paused) {
			playerRef.current.play();
			setIsPlaying(true);
		} else {
			playerRef.current.pause();
			setIsPlaying(false);
		}
	};

	const toggleMute = () => {
		playerRef.current.muted = !playerRef.current.muted;
		setIsMuted(!isMuted);
	};

	const handleVolumeChange = (e) => {
		const value = parseFloat(e.target.value);
		setVolume(value);
		playerRef.current.volume = value;
		setIsMuted(value === 0);
	};

	const toggleFullscreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			playerRef.current.requestFullscreen();
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

			// Add tags from interaction
			if (!isLiked && video.tags && video.tags.length > 0) {
				await addTagsFromInteraction(video.tags);
			}
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

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading />
			</div>
		);
	}

	if (error || !video) {
		return <PageNotFound type="Video" />;
	}

	const currentIndex = playlistVideos.findIndex(v => v._id === videoId);

	return (
		<div className="pt-16">
			<div className="flex flex-col md:flex-row">
				{/* Main Video Section */}
				<div className="flex-1">
					<div className="relative aspect-video bg-black">
						<MediaPlayer 
							ref={playerRef}
							title={video?.title} 
							src={video?.videoFile}
							onEnded={handleVideoEnd}
							autoplay
						>
							<MediaProvider />
							<DefaultVideoLayout
								thumbnails={video?.thumbnail}
								icons={defaultLayoutIcons}
							/>
						</MediaPlayer>
					</div>

					{/* Video Info */}
					<div className="p-4">
						<h1 className="text-xl font-bold text-surface-800 dark:text-white mb-2">
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
							{video.tags && video.tags.length > 0 && (
								<div className="mt-4 flex flex-wrap gap-2">
									{video.tags.map((tag) => (
										<span
											key={tag}
											className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
										>
											#{tag}
										</span>
									))}
								</div>
							)}
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
										owner={video?.owner}
										userData={userData}
										handleProfileClick={handleProfileClick}
										handleCommentDelete={handleCommentDelete}
										handleCommentUpdate={handleCommentUpdate}
									/>
								))}
							</div>
						</div>
					</div>

					{/* Mobile Playlist Drawer */}
					{playlistId && playlistVideos.length > 0 && (
						<div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-800/95 backdrop-blur-sm">
							<div 
								className="p-4 flex items-center justify-between cursor-pointer"
								onClick={() => setShowPlaylistDrawer(!showPlaylistDrawer)}
							>
								<div>
									<h3 className="text-white font-medium">Up Next in Playlist</h3>
									<p className="text-surface-400 text-sm">
										{currentIndex + 1} / {playlistVideos.length}
									</p>
								</div>
								{showPlaylistDrawer ? (
									<ChevronDown className="w-6 h-6 text-white" />
								) : (
									<ChevronUp className="w-6 h-6 text-white" />
								)}
							</div>

							{/* Playlist Videos Drawer */}
							{showPlaylistDrawer && (
								<div className="max-h-[60vh] overflow-y-auto">
									{playlistVideos.map((video, index) => (
										<div
											key={video._id}
											className={`flex gap-3 p-4 cursor-pointer ${
												index === currentIndex ? 'bg-surface-700' : ''
											}`}
											onClick={() => handleVideoChange(video._id)}
										>
											<div className="relative w-32 flex-shrink-0">
												<img
													src={video.thumbnail}
													alt={video.title}
													className="w-full aspect-video object-cover rounded"
												/>
												{index === currentIndex + 1 && (
													<div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
														<Play className="w-6 h-6 text-white" fill="white" />
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-white text-sm line-clamp-2">{video.title}</p>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>

				{/* Desktop Playlist Sidebar */}
				{playlistId && playlistVideos.length > 0 && (
					<div className="hidden md:block w-80 bg-surface-800/95 backdrop-blur-sm border-l border-surface-700 overflow-y-auto h-[calc(100vh-4rem)] sticky top-16">
						<div className="p-4">
							<h3 className="text-white font-medium mb-4">Playlist Videos</h3>
							<div className="space-y-3">
								{playlistVideos.map((video, index) => (
									<div
										key={video._id}
										className={`flex gap-3 cursor-pointer hover:bg-surface-700/50 p-2 rounded ${
											index === currentIndex ? 'bg-surface-700' : ''
										}`}
										onClick={() => handleVideoChange(video._id)}
									>
										<div className="relative w-32 flex-shrink-0">
											<img
												src={video.thumbnail}
												alt={video.title}
												className="w-full aspect-video object-cover rounded"
											/>
											{index === currentIndex + 1 && (
												<div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
													<Play className="w-6 h-6 text-white" fill="white" />
												</div>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-white text-sm line-clamp-2">{video.title}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
