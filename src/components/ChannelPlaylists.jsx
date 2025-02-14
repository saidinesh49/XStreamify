import React, { useState, useEffect } from "react";
import { getUserPlaylists, deletePlaylist } from "../services/playlistService";
import PlaylistCard from "./PlaylistCard";
import Loading from "../utils/Loading";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ChannelPlaylists({ userId, isOwnProfile }) {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const response = await getUserPlaylists(userId);
            console.log("Channel playlists response:", response);
            if (response?.data) {
                // Map through the playlists to ensure proper data structure
                const formattedPlaylists = response.data.map(playlist => ({
                    _id: playlist._id,
                    name: playlist.name,
                    description: playlist.description,
                    owner: playlist.owner,
                    createdAt: playlist.createdAt,
                    updatedAt: playlist.updatedAt,
                    videos: playlist.videos || [] // This will be an array of video IDs
                }));
                setPlaylists(formattedPlaylists);
            } else {
                setPlaylists([]);
            }
        } catch (error) {
            console.error("Error fetching channel playlists:", error);
            toast.error("Failed to load playlists");
            setPlaylists([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchPlaylists();
        }
    }, [userId]);

    const handleDelete = async (playlistId) => {
        if (window.confirm("Are you sure you want to delete this playlist?")) {
            try {
                await deletePlaylist(playlistId);
                toast.success("Playlist deleted successfully");
                fetchPlaylists();
            } catch (error) {
                toast.error("Failed to delete playlist");
            }
        }
    };

    const handleEdit = (playlist) => {
        navigate(`/playlist/${playlist._id}/edit`);
    };

    if (loading) return <Loading />;

    return (
        <div className="mt-8 px-4 sm:px-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-surface-800 dark:text-white">
                    {playlists.length === 0 ? "No Playlists Yet" : "Playlists"}
                </h2>
                {isOwnProfile && (
                    <button
                        onClick={() => navigate("/create-playlist")}
                        className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                    >
                        Create Playlist
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {playlists.map((playlist) => (
                    <PlaylistCard
                        key={playlist._id}
                        playlist={playlist}
                        isOwner={isOwnProfile}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
            </div>
            {playlists.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-surface-500 dark:text-surface-400">
                        {isOwnProfile
                            ? "You haven't created any playlists yet"
                            : "This channel has no playlists yet"}
                    </p>
                </div>
            )}
        </div>
    );
} 