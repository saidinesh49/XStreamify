import React, { useState, useEffect, useRef } from "react";
import {
	Bell,
	Menu,
	Video as VideoIcon,
	User as UserIcon,
	Settings,
	LogOut,
	Search,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";
import NotificationsDropdown from "./NotificationsDropdown";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { getNotificationCount } from "../services/notificationService";

export default function Header({ onMenuClick }) {
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [notificationCount, setNotificationCount] = useState(0);
	const { userData } = useUserContext();
	const navigate = useNavigate();
	const profileRef = useRef(null);
	const notificationsRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				profileRef.current &&
				!profileRef.current.contains(event.target) &&
				isProfileOpen
			) {
				setIsProfileOpen(false);
			}
			if (
				notificationsRef.current &&
				!notificationsRef.current.contains(event.target) &&
				isNotificationsOpen
			) {
				setIsNotificationsOpen(false);
			}
		};

		if (isProfileOpen || isNotificationsOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isProfileOpen, isNotificationsOpen]);

	useEffect(() => {
		if (userData?._id) {
			fetchNotificationCount();
			// Periodically refresh notification count
			const interval = setInterval(fetchNotificationCount, 60000); // every minute
			return () => clearInterval(interval);
		}
	}, [userData]);

	const fetchNotificationCount = async () => {
		try {
			const response = await getNotificationCount();
			if (response?.data) {
				setNotificationCount(response.data.count);
			}
		} catch (error) {
			console.error("Error fetching notification count:", error);
		}
	};

	const handleClickProfileIcon = () => {
		try {
			console.log("Icon clicked", userData);
			if (!userData?.username) {
				navigate("/login");
			}
			setIsProfileOpen(!isProfileOpen);
		} catch (error) {
			console.log("Error: inside handleProfileIcon", error);
		}
	};

	const handleClickNotificationIcon = () => {
		if (!userData?.username) {
			navigate("/login");
			return;
		}
		setIsNotificationsOpen(!isNotificationsOpen);
	};

	const handleLogout = () => {
		// Implement logout functionality
	};

	const profileMenuItems = [
		{
			label: "Profile",
			icon: UserIcon,
			href: `/c/${userData?.username}`,
		},
		{
			label: "Your Videos",
			icon: VideoIcon,
			href: "/your-videos",
		},
		{
			label: "Settings",
			icon: Settings,
			href: "/settings",
		},
		{
			label: "Logout",
			icon: LogOut,
			onClick: handleLogout,
		},
	];

	return (
		<header className="fixed top-0 right-0 left-0 h-16 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md z-50 px-2 sm:px-4 flex items-center justify-between border-b border-surface-200 dark:border-surface-700 shadow-sm">
			<div className="flex items-center gap-2">
				<button
					onClick={onMenuClick}
					className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-all duration-300 hover:rotate-180"
				>
					<Menu className="w-6 h-6 text-surface-600 dark:text-surface-300" />
				</button>
			</div>

			<div className="flex-1 max-w-2xl mx-2 sm:mx-4">
				<SearchBar />
			</div>

			<div className="flex items-center gap-3">
				<ThemeToggle />
				
				{/* Notification Bell */}
				<div ref={notificationsRef} className="relative">
					<button
						onClick={handleClickNotificationIcon}
						className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors relative"
					>
						<Bell className="w-6 h-6 text-surface-600 dark:text-surface-300" />
						{notificationCount > 0 && (
							<span className="absolute top-0 right-0 bg-premium-500 text-black text-xs font-medium rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
								{notificationCount > 9 ? "9+" : notificationCount}
							</span>
						)}
					</button>
					<NotificationsDropdown 
						isOpen={isNotificationsOpen} 
						onClose={() => setIsNotificationsOpen(false)} 
						refreshCount={fetchNotificationCount}
					/>
				</div>
				
				<div ref={profileRef}>
					{userData?.username ? (
						<button
							onClick={() => {
								handleClickProfileIcon();
							}}
							className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium hover:shadow-lg hover:ring-2 ring-primary-200 dark:ring-primary-500/20 transition-all"
						>
							{userData?.avatar ? (
								<img
									src={userData.avatar} // Assuming avatar is a URL to the image
									alt="User Avatar"
									className="w-full h-full object-cover rounded-full"
								/>
							) : userData?.fullName ? (
								userData.fullName[0]
							) : (
								"."
							)}
						</button>
					) : (
						<button
							onClick={handleClickProfileIcon} // You can adjust this based on your need, maybe show a login modal or redirect
							className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-medium hover:shadow-lg hover:ring-2 ring-primary-200 dark:ring-primary-500/20 transition-all"
						>
							<FaUser className="text-white text-xl" />{" "}
							{/* Default user icon */}
						</button>
					)}
					{userData?.username ? (
						<ProfileDropdown
							isOpen={isProfileOpen}
							onClose={() => setIsProfileOpen(false)}
							menuItems={profileMenuItems}
						/>
					) : null}
				</div>
			</div>
		</header>
	);
}
