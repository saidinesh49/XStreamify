import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylistById, deletePlaylist } from "../services/playlistService";
import { useUserContext } from "../context/UserContext";
import Loading from "../utils/Loading";
import { PageNotFound } from "../utils/PageNotFound";
import { toast } from "react-toastify";
import VideoCard from "../components/VideoCard";
import { Play, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "../services/authService";

export default function Playlist() {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [videoDetails, setVideoDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userData } = useUserContext();
    const navigate = useNavigate();

    const fetchVideoDetails = async (videoIds) => {
        try {
            const accessToken = getCookie("accessToken");
            if (!accessToken) return [];

            const promises = videoIds.map(videoId =>
                axios.get(`${conf.BACKEND_URL}/videos/${videoId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                })
            );

            const responses = await Promise.all(promises);
            return responses.map(response => response.data.data).filter(Boolean);
        } catch (error) {
            console.error("Error fetching video details:", error);
            return [];
        }
    };

    const fetchPlaylist = async () => {
        try {
            const response = await getPlaylistById(playlistId);
            console.log("API Response:", response);
            
            if (response?.data) {
                const playlistData = {
                    _id: response.data._id,
                    name: response.data.name,
                    description: response.data.description,
                    owner: response.data.owner,
                    createdAt: response.data.createdAt,
                    updatedAt: response.data.updatedAt,
                    videos: response.data.videos || []
                };
                setPlaylist(playlistData);

                // Fetch video details
                const details = await fetchVideoDetails(playlistData.videos);
                setVideoDetails(details);
            } else {
                setError("Playlist not found");
            }
        } catch (error) {
            console.error("Error fetching playlist:", error);
            setError("Failed to load playlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (playlistId) {
            fetchPlaylist();
        }
    }, [playlistId]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this playlist?")) {
            try {
                await deletePlaylist(playlistId);
                toast.success("Playlist deleted successfully");
                navigate(-1);
            } catch (error) {
                toast.error("Failed to delete playlist");
            }
        }
    };

    const handleEdit = () => {
        navigate(`/playlist/${playlistId}/edit`);
    };

    const handlePlayAll = () => {
        if (videoDetails.length > 0) {
            navigate(`/videos/${videoDetails[0]._id}?playlist=${playlist._id}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }

    if (error || !playlist) {
        return <PageNotFound type="Playlist" />;
    }

    const isOwner = userData?._id === playlist.owner;

    return (
        <div className="pt-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Playlist Header */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    {/* Playlist Thumbnail Grid */}
                    <div className="w-full md:w-80 aspect-video bg-surface-100 dark:bg-surface-800 rounded-lg overflow-hidden relative">
                        {videoDetails.length > 0 ? (
                            <div className="relative w-full h-full">
                                {/* Main thumbnail */}
                                <div className="absolute inset-0 z-20">
                                    <img
                                        src={videoDetails[0].thumbnail}
                                        alt={videoDetails[0].title}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    {/* Overlay with play count */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="text-white text-center">
                                            <Play className="w-12 h-12 mx-auto mb-2" />
                                            <p className="font-medium">{videoDetails.length} videos</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Stacked thumbnails effect */}
                                {videoDetails.slice(1, 3).map((video, index) => (
                                    <div
                                        key={video._id}
                                        className={`absolute inset-0 transform
                                            ${index === 0 ? 'translate-x-4 translate-y-4' : 'translate-x-8 translate-y-8'}
                                            ${index === 0 ? 'z-10' : 'z-0'}`}
                                    >
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover rounded-lg shadow-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-surface-500 dark:text-surface-400">No videos</p>
                            </div>
                        )}
                    </div>

                    {/* Playlist Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-surface-800 dark:text-white mb-2">
                            {playlist.name}
                        </h1>
                        <p className="text-surface-600 dark:text-surface-400 mb-4">
                            {playlist.description}
                        </p>
                        <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
                            {videoDetails.length} {videoDetails.length === 1 ? 'video' : 'videos'}
                        </p>
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {videoDetails.length > 0 && (
                                <button
                                    onClick={handlePlayAll}
                                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors min-w-[120px]"
                                >
                                    <Play className="w-4 h-4" />
                                    <span>Play All</span>
                                </button>
                            )}
                            {isOwner && (
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-white rounded-full hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors min-w-[100px]"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors min-w-[100px]"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videoDetails.map((video) => (
                        <VideoCard
                            key={video._id}
                            video={video}
                            isOwner={false}
                            playlistId={playlist._id}
                        />
                    ))}
                </div>
                {videoDetails.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-surface-500 dark:text-surface-400">
                            This playlist has no videos yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 