import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function PlaylistVideoPlayer({ playlist, currentVideoId, onVideoChange }) {
    const [isMinimized, setIsMinimized] = useState(false);
    const navigate = useNavigate();

    // Find current video index
    const currentIndex = playlist.findIndex(video => video._id === currentVideoId);

    const handleVideoClick = (videoId) => {
        if (onVideoChange) {
            onVideoChange(videoId);
        } else {
            navigate(`/videos/${videoId}`);
        }
    };

    // Toggle minimized state based on screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMinimized(window.innerWidth < 768);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMinimized) {
        // Bottom bar for mobile
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-surface-800/95 backdrop-blur-sm border-t border-surface-700 z-50">
                <div className="p-4">
                    <h3 className="text-white text-sm font-medium mb-2">Up Next in Playlist</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {playlist.map((video, index) => (
                            <div
                                key={video._id}
                                className={`flex-shrink-0 w-48 cursor-pointer ${index === currentIndex ? 'opacity-50' : ''}`}
                                onClick={() => index !== currentIndex && handleVideoClick(video._id)}
                            >
                                <div className="relative aspect-video mb-1">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover rounded"
                                    />
                                    {index === currentIndex + 1 && (
                                        <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                                            <Play className="w-8 h-8 text-white" fill="white" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-white text-xs line-clamp-2">{video.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Sidebar for desktop
    return (
        <div className="w-80 bg-surface-800/95 backdrop-blur-sm border-l border-surface-700 overflow-y-auto h-[calc(100vh-5rem)] sticky top-20">
            <div className="p-4">
                <h3 className="text-white font-medium mb-4">Playlist Videos</h3>
                <div className="space-y-3">
                    {playlist.map((video, index) => (
                        <div
                            key={video._id}
                            className={`flex gap-3 cursor-pointer hover:bg-surface-700/50 p-2 rounded ${
                                index === currentIndex ? 'bg-surface-700' : ''
                            }`}
                            onClick={() => index !== currentIndex && handleVideoClick(video._id)}
                        >
                            <div className="relative w-32 flex-shrink-0">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full aspect-video object-cover rounded"
                                />
                                {index === currentIndex + 1 && (
                                    <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                                        <Play className="w-6 h-6 text-white" fill="white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm line-clamp-2">{video.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 