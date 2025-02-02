import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Play } from "lucide-react";
import { useUserContext } from "../context/UserContext";
import { LoginToAccess } from "../utils/LoginToAccess";
import {
	getAllVideos,
	deleteVideo,
	updateVideo,
} from "../services/videoService";
import { toast } from "react-toastify";
import Loading from "../utils/Loading";
import VideoCard from "../components/VideoCard";

export default function YourVideos() {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { userData } = useUserContext();

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

	useEffect(() => {
		if (userData?._id) {
			fetchVideos();
		} else {
			navigate("/login");
			toast.warn("Please login to access!");
			return;
		}
	}, [userData]);

	const handleDelete = async (videoId) => {
		try {
			await deleteVideo(videoId);
			toast.success("Video deleted successfully");
			fetchVideos();
		} catch (error) {
			toast.error("Failed to delete video");
		}
	};

	const handleEdit = async (video) => {
		try {
			// For now, navigate to edit page with video data
			// Later we can implement inline editing or a modal
			navigate(`/uploadVideo`, {
				state: {
					isEditing: true,
					videoData: video,
				},
			});
		} catch (error) {
			toast.error("Failed to edit video");
			console.error("Error editing video:", error);
		}
	};

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
						<VideoCard
							key={video._id}
							video={video}
							isOwner={true}
							onDelete={() => {
								handleDelete(video?._id);
							}}
							onEdit={() => {
								handleEdit(video);
							}}
						/>
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
