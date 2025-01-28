import React, { useState } from "react";
import { MessageCircle, Heart, Share2, Send, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function TweetDetail({
	tweet,
	comments,
	userData,
	onLike,
	onDelete,
	onComment,
	onShare,
	onOwnerClick,
}) {
	const [newComment, setNewComment] = useState("");
	const [showOptions, setShowOptions] = useState(false);
	const navigate = useNavigate();

	const handleCommentSubmit = (e) => {
		e.preventDefault();
		onComment(newComment);
		setNewComment("");
	};

	const LikeButton = () => (
		<button
			onClick={(e) => {
				e.stopPropagation();
				onLike(e, tweet._id);
			}}
			className={`flex items-center gap-2 ${
				tweet.isLiked ? "text-pink-500" : "text-surface-500 hover:text-pink-500"
			} transition-colors`}
		>
			<Heart className={`w-4 h-4 ${tweet.isLiked ? "fill-current" : ""}`} />
			<span className="text-sm">{tweet.likesCount || 0}</span>
		</button>
	);

	return (
		<div className="space-y-6">
			{/* Tweet Content */}
			<div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm">
				<div className="flex items-start gap-3">
					<img
						src={
							tweet.owner.avatar ||
							`https://ui-avatars.com/api/?name=${tweet.owner.fullName}`
						}
						alt={tweet.owner.fullName}
						className="w-10 h-10 rounded-full cursor-pointer"
						onClick={() => onOwnerClick(tweet.owner.username)}
					/>
					<div className="flex-1">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span
									className="font-semibold text-surface-800 dark:text-white cursor-pointer hover:text-primary-500"
									onClick={() => onOwnerClick(tweet.owner.username)}
								>
									{tweet.owner.fullName}
								</span>
								<span
									className="text-surface-500 text-sm cursor-pointer hover:text-primary-500"
									onClick={() => onOwnerClick(tweet.owner.username)}
								>
									@{tweet.owner.username}
								</span>
							</div>
							{userData?._id === tweet.owner._id && (
								<div className="relative">
									<button
										onClick={() => setShowOptions(!showOptions)}
										className="p-1.5 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-full transition-colors"
									>
										<MoreVertical className="w-5 h-5 text-surface-600 dark:text-surface-300" />
									</button>
									{showOptions && (
										<div className="absolute right-0 mt-1 w-48 bg-white dark:bg-surface-900 rounded-lg shadow-lg border border-surface-200 dark:border-surface-600">
											<button
												onClick={() => onDelete(tweet._id)}
												className="w-full px-4 py-2 text-left text-red-600 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg"
											>
												Delete Tweet
											</button>
										</div>
									)}
								</div>
							)}
						</div>
						<p className="mt-2 text-surface-600 dark:text-surface-300">
							{tweet.content}
						</p>
						<div className="flex items-center gap-6 mt-4">
							<button className="flex items-center gap-2 text-surface-500">
								<MessageCircle className="w-4 h-4" />
								<span className="text-sm">{comments.length}</span>
							</button>
							<LikeButton />
							<button
								onClick={() => onShare(tweet)}
								className="flex items-center gap-2 text-surface-500 hover:text-primary-500"
							>
								<Share2 className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Comments Section */}
			<div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm">
				<h3 className="font-medium text-surface-800 dark:text-white mb-4">
					Comments
				</h3>
				<form onSubmit={handleCommentSubmit} className="flex gap-4 mb-6">
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
								className="w-8 h-8 rounded-full cursor-pointer"
								onClick={() => onOwnerClick(comment.owner.username)}
							/>
							<div>
								<div className="flex items-center gap-2">
									<span
										className="font-medium text-surface-800 dark:text-white cursor-pointer hover:text-primary-500"
										onClick={() => onOwnerClick(comment.owner.username)}
									>
										{comment.owner.fullName}
									</span>
									<span className="text-surface-500 text-sm">
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
	);
}
