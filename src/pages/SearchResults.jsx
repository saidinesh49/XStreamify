import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSearchResults } from "../services/searchService";
import Loading from "../utils/Loading";
import VideoCard from "../components/VideoCard";
import { toast } from "react-toastify";

export default function SearchResults() {
	const location = useLocation();
	const query = new URLSearchParams(location.search).get("query");
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const response = await getSearchResults(query);
				if (response?.data) {
					setVideos(response.data || []);
				} else {
					toast.error("Failed to load search results");
				}
			} catch (error) {
				toast.error("Error: Failed to load search results", error);
			} finally {
				setLoading(false);
			}
		};

		if (query) {
			fetchVideos();
		}
	}, [query]);

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
					Search Results for "{query}"
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{videos.length > 0 ? (
						videos.map((video) => (
							<VideoCard key={video._id} video={video} isOwner={false} />
						))
					) : (
						<div className="text-center py-12">
							<p className="text-surface-500 dark:text-surface-400">
								No videos found for your search query
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
