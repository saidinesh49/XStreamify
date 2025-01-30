import React, { useState, useEffect } from "react";
import ContentCard from "../components/ContentCard";
import { getAllVideos } from "../services/videoService";
import Loading from "../utils/Loading";
import { useUserContext } from "../context/UserContext";
import { LoginToAccess } from "../utils/LoginToAccess";

export default function Videos() {
	const [videos, setVideos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const { userData, addUserData } = useUserContext();

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				setIsLoading(true);
				const response = await getAllVideos({
					page: 1,
					limit: 20,
					sortBy: "createdAt",
					sortType: "desc",
				});

				if (response?.data?.videos) {
					setVideos(response.data.videos);
				}
			} catch (error) {
				console.error("Error fetching videos:", error);
				setError("Failed to load videos");
			} finally {
				setIsLoading(false);
			}
		};

		fetchVideos();
	}, []);

	if (isLoading)
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading />
			</div>
		);
	if (error)
		return <div className="text-center text-red-500 pt-20">{error}</div>;

	return (
		<div className="pt-20 px-4">
			<h2 className="text-xl sm:text-2xl font-semibold text-surface-800 dark:text-white mb-6">
				Latest Videos
			</h2>
			{!(userData && userData?.username) ? (
				<LoginToAccess />
			) : videos.length === 0 ? (
				<p className="text-center text-gray-500 dark:text-gray-400">
					No videos found
				</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{videos.map((video) => (
						<ContentCard
							key={video._id}
							id={video._id}
							title={video.title}
							username={video.username}
							time={new Date(video.createdAt).toLocaleDateString()}
							thumbnail={video.thumbnail}
						/>
					))}
				</div>
			)}
		</div>
	);
}
