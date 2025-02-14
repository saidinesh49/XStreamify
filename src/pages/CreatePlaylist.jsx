import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPlaylist, addVideoToPlaylist } from "../services/playlistService";
import { getAllVideos } from "../services/videoService";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { LoginToAccess } from "../utils/LoginToAccess";
import Loading from "../utils/Loading";
import { X } from "lucide-react";

export default function CreatePlaylist() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [availableVideos, setAvailableVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showVideoDropdown, setShowVideoDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { userData } = useUserContext();

    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                const response = await getAllVideos({ userId: userData?._id });
                setAvailableVideos(response?.data?.videos || []);
            } catch (error) {
                console.error("Error fetching videos:", error);
                toast.error("Failed to load videos");
            } finally {
                setIsLoading(false);
            }
        };

        if (userData?._id) {
            fetchUserVideos();
        }
    }, [userData?._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        if (selectedVideos.length === 0) {
            toast.error("Please select at least one video");
            return;
        }

        try {
            setIsSubmitting(true);
            // First create the playlist
            const response = await createPlaylist(name.trim(), description.trim());
            if (!response?.data?._id) {
                throw new Error("Failed to create playlist");
            }

            const playlistId = response.data._id;

            // Add videos one by one
            for (const video of selectedVideos) {
                try {
                    console.log("Video id and playlist id forwarding for add video: ",video._id, " and ",playlistId);
                    await addVideoToPlaylist(video._id, playlistId);
                } catch (error) {
                    console.error(`Failed to add video ${video._id} to playlist:`, error);
                    toast.error(`Failed to add video "${video.title}" to playlist`);
                }
            }

            toast.success("Playlist created successfully");
            navigate(`/playlist/${playlistId}`);
        } catch (error) {
            toast.error("Failed to create playlist");
            console.error("Error creating playlist:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVideoSelect = (video) => {
        setSelectedVideos([...selectedVideos, video]);
        setAvailableVideos(availableVideos.filter(v => v._id !== video._id));
        setShowVideoDropdown(false);
    };

    const handleVideoRemove = (videoId) => {
        const removedVideo = selectedVideos.find(v => v._id === videoId);
        setSelectedVideos(selectedVideos.filter(v => v._id !== videoId));
        if (removedVideo) {
            setAvailableVideos([...availableVideos, removedVideo]);
        }
    };

    const filteredVideos = availableVideos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!userData?.username) {
        return <LoginToAccess />;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="pt-20 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-surface-800 dark:text-white mb-6">
                    Create New Playlist
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
                        >
                            Playlist Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter playlist name"
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter playlist description"
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label
                            htmlFor="videos"
                            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
                        >
                            Videos
                        </label>
                        <input
                            type="text"
                            placeholder="Search your videos"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowVideoDropdown(true);
                            }}
                            onFocus={() => setShowVideoDropdown(true)}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {showVideoDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredVideos.length === 0 ? (
                                    <div className="p-4 text-center text-surface-500 dark:text-surface-400">
                                        No videos found
                                    </div>
                                ) : (
                                    filteredVideos.map(video => (
                                        <div
                                            key={video._id}
                                            onClick={() => handleVideoSelect(video)}
                                            className="flex items-center gap-3 p-2 hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer"
                                        >
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-20 h-12 object-cover rounded"
                                            />
                                            <span className="text-surface-800 dark:text-white">
                                                {video.title}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                            Selected Videos ({selectedVideos.length})
                        </label>
                        <div className="space-y-2">
                            {selectedVideos.map(video => (
                                <div
                                    key={video._id}
                                    className="flex items-center justify-between gap-3 p-2 bg-surface-50 dark:bg-surface-800 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-20 h-12 object-cover rounded"
                                        />
                                        <span className="text-surface-800 dark:text-white">
                                            {video.title}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleVideoRemove(video._id)}
                                        className="p-1 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-full"
                                    >
                                        <X className="w-5 h-5 text-surface-500 dark:text-surface-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 rounded-full font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isSubmitting ? "Creating..." : "Create Playlist"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 rounded-full font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 