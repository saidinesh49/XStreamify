import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFollowings } from "../services/channelService";
import { useUserContext } from "../context/UserContext";
import Loading from "../utils/Loading";
import { LoginToAccess } from "../utils/LoginToAccess";
import { toast } from "react-toastify";

export default function Followings() {
	const [followings, setFollowings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const { userData } = useUserContext();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFollowings = async () => {
			try {
				if (!userData?.username) {
					navigate("/login");
					toast.warn("Please login!");
					return;
				}
				setIsLoading(true);
				const response = await getUserFollowings(userData?._id);
				if (response?.data) {
					setFollowings(response.data);
				}
			} catch (error) {
				console.error("Error fetching followings:", error);
				setError("Failed to load followings");
			} finally {
				setIsLoading(false);
			}
		};

		fetchFollowings();
	}, [userData]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading />
			</div>
		);
	}

	if (error) {
		return <div className="pt-20 text-center text-red-500">{error}</div>;
	}

	return (
		<div className="max-w-4xl mx-auto pt-20 px-4">
			<h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
				Channels You Follow
			</h1>

			<div className="bg-white dark:bg-surface-800 rounded-lg shadow">
				{followings.length === 0 ? (
					<div className="p-8 text-center">
						<div className="w-16 h-16 mx-auto mb-4 text-surface-400 dark:text-surface-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<p className="text-surface-600 dark:text-surface-400">
							You're not following any channels yet
						</p>
						<button
							onClick={() => navigate("/")}
							className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
						>
							Explore
						</button>
					</div>
				) : (
					<div className="divide-y divide-surface-200 dark:divide-surface-700">
						{followings.map((following) => (
							<div
								key={following._id}
								onClick={() => navigate(`/c/${following.username}`)}
								className="flex items-center gap-4 p-4 rounded-md hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer transition-colors"
							>
								<img
									src={
										following.avatar ||
										`https://ui-avatars.com/api/?name=${following.fullName}`
									}
									alt={following.fullName}
									className="w-12 h-12 rounded-full object-cover"
								/>
								<div className="flex-1 min-w-0">
									<h3 className="text-surface-900 dark:text-white font-medium truncate">
										{following.fullName}
									</h3>
									<p className="text-surface-500 dark:text-surface-400 text-sm truncate">
										@{following.username}
									</p>
								</div>
								<button
									className="px-4 py-1 text-sm border border-surface-200 dark:border-surface-600 rounded-full hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
									onClick={(e) => {
										e.stopPropagation();
										// Add unfollow functionality here
									}}
								>
									Following
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
