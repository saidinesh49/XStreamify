import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Home,
    PlaySquare,
    MessageSquare,
    Settings,
    Heart,
    Users,
    Shield,
    Baby,
    UserPlus,
    X,
    ChevronRight,
    History,
    Clock,
    FolderHeart,
    Video,
    User,
    Search
} from "lucide-react";
import { useUserContext } from "../context/UserContext";
import { getChildrenAccounts } from "../services/parentChildService";
import { toast } from "react-toastify";

export default function Sidebar({ isOpen, onClose }) {
    const { userData } = useUserContext();
    const location = useLocation();
    const [menuItems, setMenuItems] = useState([]);
    const [hasChildren, setHasChildren] = useState(false);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && window.innerWidth < 1024 && event.target.closest('.sidebar') === null) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Check if user has children
    useEffect(() => {
        if (userData?._id) {
            const checkForChildren = async () => {
                try {
                    const response = await getChildrenAccounts();
                    setHasChildren(response?.data && response.data.length > 0);
                } catch (error) {
                    console.error("Error checking for children:", error);
                }
            };
            checkForChildren();
        }
    }, [userData]);

    // Update menu items when userData or hasChildren changes
    useEffect(() => {
        setMenuItems(createDefaultMenuItems());
    }, [userData, hasChildren, location.pathname]);

    const createDefaultMenuItems = () => {
        const items = [
            {
                name: "Home",
                icon: Home,
                path: "/",
            },
            {
                name: "Latest Videos",
                icon: Video,
                path: "/videos",
            },
            {
                name: "Tweets",
                icon: MessageSquare,
                path: "/tweets",
            },
            {
                name: "Your Feeds",
                icon: FolderHeart,
                path: "/your-feeds",
            },
            {
                name: "Parent-Access",
                icon: UserPlus,
                path: "/manage-children",
            },
            {
                name: "Settings",
                icon: Settings,
                path: "/settings",
            },
        ];

        return items;
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-white dark:bg-surface-900 shadow-lg dark:shadow-surface-900/50 transition-all duration-300 z-40 ${
                isOpen ? "w-64" : "w-20"
            } ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
        >
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-surface-100 dark:border-surface-800">
                    <h1
                        className={`font-semibold text-surface-800 dark:text-white ${
                            isOpen ? "text-xl" : "text-center text-sm"
                        }`}
                    >
                        {isOpen ? "XStreamify" : "XS"}
                    </h1>
                </div>
                <nav className="flex-1 pt-4 overflow-y-auto scrollbar-hide">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={item.onClick}
                            className={({ isActive }) => `
                                flex items-center px-4 py-3 
                                hover:bg-surface-50 dark:hover:bg-surface-800 
                                hover:text-primary-600 dark:hover:text-primary-400 
                                transition-colors relative group
                                ${
                                    item.path && isActive
                                        ? "text-primary-600 dark:text-primary-400 bg-surface-50 dark:bg-surface-800"
                                        : "text-surface-600 dark:text-surface-300"
                                }
                            `}
                        >
                            <item.icon
                                className={`w-6 h-6 shrink-0 ${isOpen ? "" : "mx-auto"}`}
                            />
                            {isOpen && <span className="ml-4 truncate">{item.name}</span>}
                            <div
                                className={`absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full transition-opacity duration-300 ${({ isActive }) => (isActive ? "opacity-100" : "opacity-0")}`}
                            />
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
