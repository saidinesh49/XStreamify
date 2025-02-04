import React from "react";
import { MessageCircle, Heart, Share2, MoreVertical } from "lucide-react";

export default function TweetCard({
	tweet,
	userData,
	onLike,
	onShare,
	onDelete,
	onOwnerClick,
	onClick,
	showOptions,
	onOptionsClick,
	hideNavigation, // Add this prop
}) {
	return (
		<div
			onClick={hideNavigation ? undefined : onClick}
			className={`bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm ${
				!hideNavigation &&
				"cursor-pointer hover:bg-blue-50 dark:hover:bg-surface-700/50"
			} transition-colors`}
		>
			<div className="flex items-start gap-3">
				<img
					src={
						tweet.owner.avatar ||
						`https://ui-avatars.com/api/?name=${tweet.owner.fullName}`
					}
					alt={tweet.owner.fullName}
					className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
					onClick={(e) => {
						e.stopPropagation();
						onOwnerClick(tweet.owner.username);
					}}
				/>
				<div className="flex-1">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div
								className="group cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									onOwnerClick(tweet.owner.username);
								}}
							>
								<span className="font-semibold text-surface-800 dark:text-white group-hover:text-primary-500 transition-colors">
									{tweet.owner.fullName}
								</span>
								<span className="text-surface-500 text-sm group-hover:text-primary-400 ml-2">
									@{tweet.owner.username}
								</span>
							</div>
						</div>
						{userData?._id === tweet.owner._id && (
							<div className="relative">
								<button
									onClick={(e) => {
										e.stopPropagation();
										onOptionsClick(hideNavigation ? null : tweet._id);
									}}
									className="p-1.5 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-full transition-colors"
								>
									<MoreVertical className="w-5 h-5 text-surface-600 dark:text-surface-300" />
								</button>
								{(showOptions === tweet._id ||
									(hideNavigation && showOptions)) && (
									<div className="absolute right-0 mt-1 w-48 bg-white dark:bg-surface-900 rounded-lg shadow-lg z-10">
										<button
											onClick={(e) => {
												e.stopPropagation();
												onDelete(tweet._id);
											}}
											className="w-full px-4 py-2 text-left text-red-600 hover:bg-surface-100 dark:hover:bg-surface-800"
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
					<div className="flex items-center gap-6 mt-3">
						<button
							className="flex items-center gap-2 text-surface-500 hover:text-primary-500 transition-colors"
							onClick={(e) => e.stopPropagation()}
						>
							<MessageCircle
								className="w-4 h-4"
								onClick={hideNavigation ? undefined : onClick}
							/>
							<span className="text-sm">{tweet.commentsCount || 0}</span>
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onLike(e, tweet._id);
							}}
							className={`flex items-center gap-2 ${
								tweet.isLiked
									? "text-pink-500"
									: "text-surface-500 hover:text-pink-500"
							} transition-colors`}
						>
							<Heart
								className={`w-4 h-4 ${tweet.isLiked ? "fill-current" : ""}`}
							/>
							<span className="text-sm">{tweet.likesCount || 0}</span>
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onShare(e, tweet);
							}}
							className="flex items-center gap-2 text-surface-500 hover:text-primary-500 transition-colors"
						>
							<Share2 className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
