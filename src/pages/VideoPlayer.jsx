import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVideoById } from '../services/videoService';
import { getUserByObjectId, toggleChannelSubscription } from '../services/channelService';
import { useUserContext } from '../context/UserContext';
import Loading from '../components/Loading';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize } from 'lucide-react';
import { toast } from 'react-toastify';
import { LoginToAccess } from '../utils/LoginToAccess'

export default function VideoPlayer() {
	const { videoId } = useParams();
	const [video, setVideo] = useState(null);
	const [owner, setOwner] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const videoRef = useRef(null);
	const { userData } = useUserContext();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchVideoAndOwner = async () => {
			try {
				setIsLoading(true);
				const videoResponse = await getVideoById(videoId);
				if (videoResponse?.data) {
					setVideo(videoResponse.data);
					// Fetch owner details
					const ownerResponse = await getUserByObjectId(videoResponse.data.owner);
					if (ownerResponse?.data) {
						setOwner(ownerResponse.data);
						setIsSubscribed(ownerResponse.data.isSubscribed);
					}
				} else {
					setError("Video not found");
				}
			} catch (error) {
				console.error("Error fetching video:", error);
				setError("Failed to load video");
			} finally {
				setIsLoading(false);
			}
		};

		fetchVideoAndOwner();
	}, [videoId,userData]);




	const handleSubscribe = async () => {
		if (!userData) {
			toast.error('Please login to subscribe');
			return;
		}
		try {
			await toggleChannelSubscription(owner._id);
			setIsSubscribed(!isSubscribed);
			toast.success(isSubscribed ? 'Unsubscribed successfully' : 'Subscribed successfully');
		} catch (error) {
			toast.error('Failed to update subscription');
			console.error('Subscription error:', error);
		}
	};

	const togglePlay = () => {
		if (videoRef.current.paused) {
			videoRef.current.play();
			setIsPlaying(true);
		} else {
			videoRef.current.pause();
			setIsPlaying(false);
		}
	};

	const toggleMute = () => {
		videoRef.current.muted = !videoRef.current.muted;
		setIsMuted(!isMuted);
	};

	const handleVolumeChange = (e) => {
		const value = parseFloat(e.target.value);
		setVolume(value);
		videoRef.current.volume = value;
		setIsMuted(value === 0);
	};

	const toggleFullscreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			videoRef.current.requestFullscreen();
		}
	};

	const handleOwnerClick = (e) => {
		e.stopPropagation(); // Prevent video play/pause
		if (owner?.username) {
			navigate(`/c/${owner.username}`);
		}
	};

	if (isLoading) return <Loading />;
	if(!userData?.username) return <div className='pt-20'><LoginToAccess/></div>;
	if (error) return <div className="text-center text-red-500 pt-20">{error}</div>;
	if (!video) return null;

	return (
		<div className="pt-20 px-4 max-w-7xl mx-auto">
			<div className="relative aspect-video bg-black rounded-xl overflow-hidden">
				<video
					ref={videoRef}
					src={video?.videoFile}
					className="w-full h-full"
					poster={video?.thumbnail}
					onClick={togglePlay}
				/>
				
				{/* Video Controls */}
				<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
					<div className="flex items-center gap-4">
						<button onClick={togglePlay} className="text-white hover:text-primary-400">
							{isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
						</button>
						
						<div className="flex items-center gap-2">
							<button onClick={toggleMute} className="text-white hover:text-primary-400">
								{isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
							</button>
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={volume}
								onChange={handleVolumeChange}
								className="w-24"
							/>
						</div>
						<button onClick={toggleFullscreen} className="text-white hover:text-primary-400 ml-auto">
							<Maximize className="w-6 h-6" />
						</button>
					</div>
				</div>
			</div>

			<div className="mt-4">
				<h1 className="text-2xl font-bold text-surface-900 dark:text-white">
					{video.title}
				</h1>
				{owner && (
					<div className="flex items-center justify-between mt-4">
						<div 
							className="flex items-center gap-4 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 p-2 rounded-lg transition-colors"
							onClick={handleOwnerClick}
						>
							<img
								src={owner.avatar || `https://ui-avatars.com/api/?name=${owner.fullName}`}
								alt={owner.fullName}
								className="w-12 h-12 rounded-full object-cover"
							/>
							<div>
								<h3 className="font-medium text-surface-800 dark:text-white">
									{owner.fullName}
								</h3>
								<p className="text-sm text-surface-600 dark:text-surface-400">
									@{owner.username}
								</p>
							</div>
						</div>
						
						{userData?._id !== owner._id && (
							<button
								onClick={handleSubscribe}
								className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
									isSubscribed
										? 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-200'
										: 'bg-primary-600 text-white hover:bg-primary-700'
								}`}
							>
								{isSubscribed ? 'Subscribed' : 'Subscribe'}
							</button>
						)}
					</div>
				)}
				<div className="mt-6 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
					<p className="text-surface-700 dark:text-surface-300 whitespace-pre-line">
						{video?.description}
					</p>
				</div>
			</div>
		</div>
	);
}
