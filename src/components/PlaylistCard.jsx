import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, MoreVertical, Edit, Trash2 } from "lucide-react";
import defaultThumbnail from "../assets/playlist_default_thumbnail.png";

export default function PlaylistCard({ playlist, isOwner, onDelete, onEdit }) {
	const [showOptions, setShowOptions] = useState(false);
	const navigate = useNavigate();

	const handlePlaylistClick = () => {
		navigate(`/playlist/${playlist._id}`);
	};

	const handleDelete = (e) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(playlist._id);
		}
		setShowOptions(false);
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit(playlist);
		}
		setShowOptions(false);
	};

	return (
		<div className="group relative bg-white dark:bg-surface-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
			<div
				className="relative aspect-video cursor-pointer"
				onClick={handlePlaylistClick}
			>
				<div className="relative w-full h-full">
					{playlist.videos.slice(0, 4).map((video, index) => (
						<div
							key={video._id || index}
							className={`absolute w-full h-full transform transition-transform duration-300 ${
								index === 0
									? "scale-100"
									: index === 1
									? "scale-95 translate-x-2 translate-y-2"
									: index === 2
									? "scale-90 translate-x-4 translate-y-4"
									: "scale-85 translate-x-6 translate-y-6"
							}`}
							style={{ zIndex: 4 - index }}
						>
							<img
								src={
									video.thumbnail ||
									defaultThumbnail ||
									`https://placehold.co/480x270/1f2937/ffffff?text=Video+${
										index + 1
									}`
								}
								alt={`Playlist video ${index + 1}`}
								className="w-full h-full object-cover rounded-lg shadow-md"
							/>
						</div>
					))}
					{playlist.videos.length === 0 && (
						<div className="absolute inset-0 bg-surface-100 dark:bg-surface-700 flex items-center justify-center rounded-lg">
							<p className="text-surface-500 dark:text-surface-400">
								No videos
							</p>
						</div>
					)}
				</div>

				<div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300 rounded-lg">
					<Play className="w-12 h-12 text-white" fill="white" />
					<span className="text-white mt-2 font-medium">
						{playlist.videos.length}{" "}
						{playlist.videos.length === 1 ? "video" : "videos"}
					</span>
				</div>

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
							<div className="absolute right-0 mt-1 w-36 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700">
								<button
									onClick={handleEdit}
									className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-surface-100 dark:hover:bg-surface-700 text-sm"
								>
									<Edit className="w-4 h-4" />
									Edit
								</button>
								<button
									onClick={handleDelete}
									className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-surface-100 dark:hover:bg-surface-700 text-red-600 dark:text-red-400 text-sm"
								>
									<Trash2 className="w-4 h-4" />
									Delete
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="p-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<h3 className="font-medium text-surface-800 dark:text-white line-clamp-2">
							{playlist.name}
						</h3>
						<p className="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-1">
							{playlist.description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
