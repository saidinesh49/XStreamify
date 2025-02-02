import React, { useState } from "react";
import { Play, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function VideoCard({ video, isOwner, onDelete, onEdit }) {
	const [showOptions, setShowOptions] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const navigate = useNavigate();

	const formatDuration = (seconds) => {
		if (!seconds) return "0:00";
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const handleDelete = (e) => {
		e.stopPropagation();
		setShowDeleteModal(true);
		setShowOptions(false);
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		navigate(`/videos/${video._id}/edit`);
		setShowOptions(false);
	};

	return (
		<>
			<div className="group relative bg-white dark:bg-surface-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
				{/* Video Thumbnail Section */}
				<div
					className="relative aspect-video cursor-pointer"
					onClick={() => navigate(`/videos/${video._id}`)}
				>
					{/* Thumbnail */}
					<img
						src={
							video.thumbnail ||
							`https://placehold.co/480x270/1f2937/ffffff?text=${encodeURIComponent(
								video.title,
							)}`
						}
						alt={video.title}
						className="w-full h-full object-cover"
					/>

					{/* Play Button Overlay */}
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
						<Play className="w-12 h-12 text-white" fill="white" />
					</div>

					{/* Duration Badge */}
					<div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
						{formatDuration(video.duration)}
					</div>

					{/* Options Menu (Only for owner) */}
					{isOwner && (
						<div className="absolute top-2 right-2 z-10">
							<button
								onClick={(e) => {
									e.stopPropagation();
									setShowOptions(!showOptions);
								}}
								className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
							>
								<MoreVertical className="w-5 h-5 text-white" />
							</button>

							{showOptions && (
								<div className="absolute right-0 mt-1 w-48 bg-white dark:bg-surface-900 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700">
									<button
										onClick={handleEdit}
										className="w-full px-4 py-2 text-left hover:bg-surface-100 dark:hover:bg-surface-800 flex items-center gap-2"
									>
										<Edit className="w-4 h-4" />
										Edit Video
									</button>
									<button
										onClick={handleDelete}
										className="w-full px-4 py-2 text-left text-red-600 hover:bg-surface-100 dark:hover:bg-surface-800 flex items-center gap-2 border-t border-surface-200 dark:border-surface-700"
									>
										<Trash2 className="w-4 h-4" />
										Delete Video
									</button>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Video Info Section */}
				<div className="p-3">
					<h3 className="font-medium text-surface-800 dark:text-white truncate hover:text-primary-500 transition-colors">
						{video.title}
					</h3>
					<div className="flex items-center gap-2 mt-1 text-sm text-surface-500">
						<span>{video.views || 0} views</span>
						<span>•</span>
						<span>{new Date(video.createdAt).toLocaleDateString()}</span>
					</div>
				</div>
			</div>

			<DeleteConfirmationModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={() => onDelete(video._id)}
				title="Delete Video"
				message={`Are you sure you want to delete "${video.title}" video? This action cannot be undone.`}
			/>
		</>
	);
}
