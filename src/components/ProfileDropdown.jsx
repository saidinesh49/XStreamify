import React, { useEffect } from "react";
import { toast } from 'react-toastify';
import {
	User,
	Video,
	Settings,
	Upload,
	BarChart3,
	LogOut,
	PlusCircle,
} from "lucide-react";
import conf from "../conf/conf";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { logoutUser } from "../services/authService";

export default function ProfileDropdown({ isOpen, onClose }) {
	if (!isOpen) return null;
	const navigate = useNavigate();
	const { userData, removeUserData } = useUserContext();

	useEffect(() => {
		console.log("just for re-rendering if userData changes");
	}, [userData]);

	const handleClickYourChannel = async () => {
		try {
			if (!userData?.username) {
				navigate("/login");
				return;
			}
			navigate(`/c/${userData.username}`);
		} catch (error) {
			console.log("Error: while fetching channel profile", error);
			return null;
		}
	};

	const handleLogOut = async () => {
		try {
			const res = await logoutUser(removeUserData);
			toast.success('Logged out successfully. See you soon!', {
				icon: '👋'
			});
			navigate("login");
		} catch (error) {
			toast.error('Error logging out. Please try again.', {
				icon: '⚠️'
			});
			console.log("Error: while logout client, ", error);
		}
	};

	const menuItems = [
		{
			icon: User,
			label: "Your Channel",
			action: () => {
				onClose();
				handleClickYourChannel();
			},
		},
		{ icon: Video, label: "Your Videos", action: () => {} },
		{ icon: BarChart3, label: "Analytics", action: () => {} },
		{
			icon: Upload,
			label: "Upload Video",
			action: () => {
				onClose();
				navigate("/uploadVideo");
			},
		},
		{ icon: PlusCircle, label: "Create Post", action: () => {} },
		{ 
			icon: Settings, 
			label: "Settings", 
			action: () => {
				onClose(); // Close the dropdown
				navigate("/settings");
			}
		},
		{
			icon: LogOut,
			label: "Sign Out",
			action: async() => {
				handleLogOut();
			},
		},
	];

	return (
		<>
			<div className="fixed inset-0 z-40" onClick={onClose} />
			<div className="absolute right-0 top-full mt-2 w-64 rounded-lg bg-white dark:bg-surface-800 shadow-lg ring-1 ring-surface-200 dark:ring-surface-700 z-50">
				<div className="p-4 border-b border-surface-200 dark:border-surface-700">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
							{userData?.fullName ? userData.fullName[0] : "G"}
						</div>
						<div>
							<h3
								onClick={handleClickYourChannel}
								className="font-medium text-surface-800 dark:text-surface-100"
							>
								{userData?.fullName ? userData.fullName : "Guest"}
							</h3>
							<p className="text-sm text-surface-500 dark:text-surface-400">
								@{userData?.username ? userData.username : "guest"}
							</p>
						</div>
					</div>
				</div>
				<div className="py-2">
					{menuItems.map((item, index) => (
						<button
							key={index}
							onClick={item.action}
							className="w-full px-4 py-2 flex items-center gap-3 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
						>
							<item.icon className="w-5 h-5" />
							<span>{item.label}</span>
						</button>
					))}
				</div>
			</div>
		</>
	);
}
