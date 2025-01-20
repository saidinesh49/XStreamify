import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageNotFound } from '../utils/PageNotFound';
import { useUserContext } from '../context/UserContext';
import Loading from '../components/Loading';
import { getChannelInfo, toggleChannelSubscription, getUserFollowings } from '../services/channelService';

const DEFAULT_COVER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&h=400&fit=crop&auto=format";
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=random&name=User";

export function Channel() {
    const { username } = useParams();
    const [channelData, setChannelData] = useState(null);
    const { userData } = useUserContext();
    const navigate = useNavigate();
    const [isloading, setLoading]=useState(true);
    const [error, setError] = useState(null);
    const [followings, setFollowings] = useState([]);
    const [showFollowings, setShowFollowings] = useState(false);

    const channelProfileDetails = async () => {
        setLoading(true);
        try {
            const Data=await getChannelInfo(username);
            if (!Data?.data.username) {
                console.log('Invalid user channel',Data);
                setError('Invalid user channel');
            }
            setChannelData(Data?.data);
        } catch (error) {
            console.log("Error: while setting the channel data", error);
            setError('An error occurred while fetching channel data');

        }
        setLoading(false);
    };

    const toggleChannelSubcription=async()=>{
        try {
            const Data=await toggleChannelSubscription(channelData?._id);
            if(!Data){
                setError('An error occurred while toggling channel subscription');
            }
            setChannelData((prev) => ({
                ...prev,
                isSubscribed:!prev.isSubscribed,
                subscribersCount: prev.isSubscribed? prev.subscribersCount - 1 : prev.subscribersCount + 1,
            }));            
        } catch (error) {
            console.log("Error at frontend page",error);
        }
    };

    const fetchFollowings = async () => {
        try {
            const response = await getUserFollowings(channelData?._id);
            console.log("followings:",response);
            setFollowings(response?.data || []);
        } catch (error) {
            console.log("Error fetching followings:", error);
        }
    };

    const handleFollowingsClick = () => {
        setShowFollowings(true);
        fetchFollowings();
    };

    useEffect(() => {
        channelProfileDetails();
    }, [username]);

    return isloading === true ? <Loading /> : (
        <div className="pt-16">
            {error && <div className="error-message">{error}</div>}
            {!channelData || !channelData.username ? <PageNotFound type='Channel' /> : (
                <div className="flex flex-col w-full">
                    {/* Cover Image Section */}
                    <div className="relative w-full h-[140px] sm:h-[200px] bg-gradient-to-r from-gray-100 to-gray-200">
                        <img 
                            src={channelData.coverImage || DEFAULT_COVER}
                            className="w-full h-full object-cover"
                            alt="channel_cover"
                            onError={(e) => {
                                e.target.src = "https://placehold.co/1920x400/e2e8f0/64748b?text=Cover+Image";
                            }}
                        />
                        
                        {/* Profile Section */}
                        <div className="absolute -bottom-16 left-4 sm:left-8 flex items-end gap-3 sm:gap-4">
                            <div className="relative">
                                <img 
                                    src={channelData.avatar || `https://ui-avatars.com/api/?background=random&name=${channelData.fullName}`}
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-gray-50"
                                    alt="channel_avatar"
                                    onError={(e) => {
                                        e.target.src = DEFAULT_AVATAR;
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
                                    {channelData.fullName}
                                </h1>
                                <h3 className="text-base sm:text-lg text-gray-700 dark:text-gray-200 drop-shadow-lg">
                                    @{channelData.username}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Channel Info Section */}
                    <div className="mt-20 px-4 sm:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                            <div className="flex items-center gap-4">
                                <div className="text-base sm:text-lg">
                                    <span className="font-semibold">{channelData.subscribersCount}</span>
                                    <span className="ml-1 text-gray-600 dark:text-gray-400">subscribers</span>
                                </div>
                                <button 
                                    onClick={handleFollowingsClick}
                                    className="text-base sm:text-lg hover:text-primary-500 transition-colors"
                                >
                                    <span className="font-semibold">{channelData.channelSubscribedToCount}</span>
                                    <span className="ml-1 text-gray-600 dark:text-gray-400">following</span>
                                </button>
                            </div>
                            
                            {userData?.username !== channelData?.username && (
                                <button 
                                    onClick={toggleChannelSubcription}
                                    className={`
                                        w-full sm:w-auto px-6 py-2.5 rounded-full font-medium
                                        transition duration-300 ease-in-out
                                        ${channelData?.isSubscribed 
                                            ? "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100" 
                                            : "bg-red-600 text-white hover:bg-red-700"
                                        }
                                    `}
                                >
                                    {userData && userData.username 
                                        ? (channelData?.isSubscribed ? "Unsubscribe" : "Subscribe") 
                                        : "Please Log in to Subscribe"
                                    }
                                </button>
                            )}
                        </div>

                        {/* Followings Modal */}
                        {showFollowings && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white dark:bg-surface-800 rounded-lg w-full max-w-md mx-4">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Following
                                        </h2>
                                        <button 
                                            onClick={() => setShowFollowings(false)}
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                                        {followings.length === 0 ? (
                                            <p className="text-center text-gray-500 dark:text-gray-400">
                                                Not following any channels yet
                                            </p>
                                        ) : (
                                            followings.map((following) => (
                                                <div 
                                                    key={following._id}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-surface-700 rounded-lg cursor-pointer"
                                                    onClick={() => {
                                                        navigate(`/c/${following.username}`);
                                                        setShowFollowings(false);
                                                    }}
                                                >
                                                    <img 
                                                        src={following.avatar || `https://ui-avatars.com/api/?name=${following.fullName}`}
                                                        alt={following.fullName}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                                            {following.fullName}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            @{following.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}