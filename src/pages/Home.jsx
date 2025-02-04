import React, { useState, useEffect } from "react";
import { getUserFeed } from "../services/recommendationService";
import Loading from "../utils/Loading";
import VideoCard from "../components/VideoCard";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const { userData } = useUserContext();
	const navigate = useNavigate();
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFeed = async () => {
			try {
				const response = await getUserFeed();
				if (response?.data) {
					setVideos(response.data.videos);
				} else {
					toast.error("Failed to load feed");
				}
			} catch (error) {
				toast.error("Error: Failed to load feed", error);
			} finally {
				setLoading(false);
			}
		};
		if (!userData?.username) {
			navigate("/login");
			return;
		}
		fetchFeed();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading />
			</div>
		);
	}

	return (
		<div className="pt-20 px-4">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-2xl font-bold text-surface-800 dark:text-white mb-6">
					Recommended Videos
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{videos.map((video) => (
						<VideoCard key={video._id} video={video} isOwner={false} />
					))}
				</div>
				{videos.length === 0 && (
					<div className="text-center py-12">
						<p className="text-surface-500 dark:text-surface-400">
							No videos found for your tags
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
