import React, { useState } from "react";

const CommentCard = ({
	comment,
	owner,
	userData,
	handleProfileClick,
	handleCommentDelete,
	handleCommentUpdate,
}) => {
	const [editingComment, setEditingComment] = useState(null);
	const [editingContent, setEditingContent] = useState("");

	return (
		<div className="flex gap-4 p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
			<img
				src={
					comment.owner?.avatar ||
					`https://ui-avatars.com/api/?name=${comment.owner?.fullName}`
				}
				alt=""
				className="w-10 h-10 rounded-full"
			/>
			<div className="flex-1">
				<div className="flex items-center justify-between">
					<div
						className="flex items-center gap-4 cursor-pointer"
						onClick={(e) => {
							handleProfileClick({
								e,
								username: comment?.owner?.username,
							});
						}}
					>
						{comment.owner?.username === owner?.username ? (
							<p className="px-2 text-surface-900 bg-surface-200 dark:bg-surface-600 dark:text-surface-50 rounded-lg">
								author
							</p>
						) : (
							<p className="font-medium">@{comment.owner?.username}</p>
						)}
						<p className="text-sm text-surface-500">
							{new Date(comment.createdAt).toLocaleDateString()}
						</p>
					</div>
					{userData?._id === comment.owner?._id && (
						<div className="flex gap-2">
							{editingComment?._id !== comment._id ? (
								<>
									<button
										onClick={() => {
											setEditingComment(comment);
											setEditingContent(comment.content);
										}}
										className="md:ml-3 ml-auto px-2.5 rounded bg-surface-200 text-surface-600 dark:text-surface-900 dark:bg-surface-400"
									>
										<i className="fas fa-pencil-alt"></i> {/* Edit icon */}
									</button>
									<button
										onClick={() => handleCommentDelete(comment._id)}
										className="px-2.5 text-red-600 rounded bg-surface-200 dark:bg-surface-400"
									>
										<i className="fas fa-trash"></i> {/* Delete icon */}
									</button>
								</>
							) : (
								<div className="ml-1 mt-2 flex gap-2">
									<button
										onClick={() => {
											const isEditingCompleted = handleCommentUpdate(
												comment._id,
												editingContent,
											);
											if (isEditingCompleted) {
												setEditingComment(null);
											}
										}}
										className="px-2 py-0.5 bg-primary-600 text-white rounded"
									>
										<i className="fas fa-save"></i> {/* Save icon */}
									</button>
									<button
										onClick={() => setEditingComment(null)}
										className="px-2 py-0.5 bg-surface-600 text-surface-200 rounded"
									>
										<i className="fas fa-times"></i> {/* Cancel icon */}
									</button>
								</div>
							)}
						</div>
					)}
				</div>
				{editingComment?._id === comment._id ? (
					<div className="mt-2 flex gap-2 mr-auto">
						<input
							type="text"
							value={editingContent}
							onChange={(e) => setEditingContent(e.target.value)}
							className="flex-1 px-3 py-1 rounded outline-none dark:text-surface-200 dark:bg-surface-600"
						/>
					</div>
				) : (
					<p className="mt-2">{comment.content}</p>
				)}
			</div>
		</div>
	);
};

export default CommentCard;
