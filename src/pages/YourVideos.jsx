import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Play } from "lucide-react";
import { useUserContext } from "../context/UserContext";
import { LoginToAccess } from "../utils/LoginToAccess";
import { getAllVideos } from "../services/videoService";
import { toast } from "react-toastify";
import Loading from "../utils/Loading";

export default function YourVideos() {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { userData } = useUserContext();

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				setLoading(true);
				const response = await getAllVideos({ userId: userData?._id });
				setVideos(response?.data?.videos || []);
			} catch (error) {
				toast.error("Failed to load videos");
			} finally {
				setLoading(false);
			}
		};

		if (userData?._id) {
			fetchVideos();
		}
	}, [userData]);

	if (!userData?.username) {
		return <LoginToAccess />;
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading />
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto pt-20">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-surface-800 dark:text-white">
						Your Videos
					</h1>
					<button
						onClick={() => navigate("/uploadVideo")}
						className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
					>
						<Upload className="w-5 h-5" />
						Upload New Video
					</button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{videos.map((video) => (
						<div
							key={video._id}
							className="group relative cursor-pointer"
							onClick={() => navigate(`/video/${video._id}`)}
						>
							<div className="aspect-video rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-800 relative">
								<img
									src={
										video.thumbnail ||
										`https://placehold.co/480x270/1f2937/ffffff?text=${encodeURIComponent(
											video.title,
										)}`
									}
									alt={video.title}
									className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
								/>
								<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
									<Play className="w-12 h-12 text-white" fill="white" />
								</div>
							</div>
							<div className="mt-2">
								<h3 className="font-medium text-surface-800 dark:text-white truncate">
									{video.title}
								</h3>
								<div className="flex items-center gap-2 text-sm text-surface-500">
									<span>{video.views || 0} views</span>
									<span>•</span>
									<span>{new Date(video.createdAt).toLocaleDateString()}</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{videos.length === 0 && (
					<div className="text-center py-12">
						<p className="text-surface-500 dark:text-surface-400">
							You haven't uploaded any videos yet
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
