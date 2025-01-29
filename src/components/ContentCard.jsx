import React from "react";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContentCard({ id, title, username, time, thumbnail }) {
	const navigate = useNavigate();

	const handleClick = () => {
		if (id) {
			navigate(`/video/${id}`);
		}
	};

	return (
		<div className="group cursor-pointer" onClick={handleClick}>
			<div className="relative rounded-xl overflow-hidden aspect-video mb-3">
				<img
					src={thumbnail}
					alt={title}
					className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
				/>
				<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
					<Play className="w-12 h-12 text-white" />
				</div>
			</div>
			<h3 className="font-medium text-surface-800 dark:text-surface-200 line-clamp-2 mb-1 text-sm sm:text-base">
				{title}
			</h3>
			<p className="text-sm text-surface-600 dark:text-surface-400">
				@{username || "unknown"} • {time}
			</p>
		</div>
	);
}
