import React, { useState, useEffect, useRef } from "react";
import { 
    getNotifications, 
    markNotificationAsRead, 
    deleteNotification,
    respondToParentRequest
} from "../services/notificationService";
import { useUserContext } from "../context/UserContext";
import { 
    Bell, 
    X,
    UserPlus, 
    Check, 
    MessageSquare, 
    Info,
    ThumbsUp,
    AlertTriangle,
    Trash2,
    RotateCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

export default function NotificationsDropdown({ isOpen, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [responding, setResponding] = useState(null);
    const { userData } = useUserContext();
    const dropdownRef = useRef(null);

    // Fetch notifications when the dropdown opens and listen for updates
    useEffect(() => {
        if (isOpen && userData?.username) {
            fetchNotifications();
        }

        // Listen for notification updates
        const handleNotificationUpdate = (event) => {
            const { notificationId, status, message } = event.detail;
            setNotifications(prevNotifications => 
                prevNotifications.map(notification => 
                    notification._id === notificationId
                        ? { 
                            ...notification, 
                            status,
                            message,
                            read: true
                        }
                        : notification
                )
            );
            
            // Show toast message
            if (status === 'ACCEPTED') {
                toast.success("Parent request accepted! You can now manage content preferences.");
            } else {
                toast.info("Parent request declined");
            }
        };

        window.addEventListener('notificationUpdated', handleNotificationUpdate);
        return () => {
            window.removeEventListener('notificationUpdated', handleNotificationUpdate);
        };
    }, [isOpen, userData]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Fetch all notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await getNotifications();
            if (response?.data?.data) {
                setNotifications(response.data.data);
                
                // Mark all as read when opened
                response.data.data.forEach(notification => {
                    if (!notification.read) {
                        markNotificationAsRead(notification._id);
                    }
                });
            } else {
                setNotifications([]);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    // Delete a notification
    const handleDeleteNotification = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            setNotifications(notifications.filter(n => n._id !== notificationId));
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    // Respond to a parent request
    const handleParentRequestResponse = async (notificationId, accept) => {
        try {
            setResponding(notificationId);
            const response = await respondToParentRequest(notificationId, accept);
            
            if (response?.data) {
                toast.success(accept 
                    ? "Parent request accepted successfully" 
                    : "Parent request rejected");
                
                // Update notification in the list
                setNotifications(notifications.map(n => 
                    n._id === notificationId 
                        ? { ...n, status: accept ? 'ACCEPTED' : 'REJECTED' } 
                        : n
                ));
            }
        } catch (error) {
            toast.error("Failed to respond to parent request");
        } finally {
            setResponding(null);
        }
    };

    // Get appropriate icon for notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case "PARENT_REQUEST":
                return <UserPlus className="w-5 h-5 text-premium-500" />;
            case "COMMENT":
                return <MessageSquare className="w-5 h-5 text-blue-500" />;
            case "LIKE":
                return <ThumbsUp className="w-5 h-5 text-green-500" />;
            case "SYSTEM":
                return <Info className="w-5 h-5 text-purple-500" />;
            default:
                return <Bell className="w-5 h-5 text-yellow-500" />;
        }
    };

    // Format notification time
    const formatTime = (date) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true });
        } catch (error) {
            return "recently";
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-surface-800 rounded-lg shadow-lg py-2 z-50 border border-surface-200 dark:border-surface-700 max-h-[80vh] overflow-y-auto"
        >
            <div className="flex items-center justify-between px-4 py-2 border-b border-surface-200 dark:border-surface-700">
                <h3 className="font-medium text-surface-800 dark:text-white">Notifications</h3>
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                >
                    <X className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-premium-500"></div>
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-8 px-4">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-surface-400" />
                    <p className="text-surface-600 dark:text-surface-400">No notifications yet</p>
                </div>
            ) : (
                <div className="divide-y divide-surface-200 dark:divide-surface-700">
                    {notifications.map((notification) => (
                        <div 
                            key={notification._id} 
                            className={`p-4 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors ${
                                notification.read ? '' : 'bg-surface-50 dark:bg-surface-800'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <p className={`text-sm font-medium ${
                            notification.type === "PARENT_REQUEST"
                                ? "text-premium-600 dark:text-premium-400"
                                : "text-surface-800 dark:text-white"
                        }`}>
                            {notification.title}
                        </p>
                        <div className="flex items-center">
                            <span className="text-xs text-surface-500 mr-2">
                                {formatTime(notification.createdAt)}
                            </span>
                            <button 
                                onClick={() => handleDeleteNotification(notification._id)}
                                className="p-1 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-full"
                            >
                                <Trash2 className="w-3.5 h-3.5 text-surface-500 hover:text-red-500" />
                            </button>
                        </div>
                    </div>
                    <p className={`text-sm mt-1 ${
                        notification.type === "PARENT_REQUEST"
                            ? "text-surface-700 dark:text-surface-300 font-medium"
                            : "text-surface-600 dark:text-surface-300"
                    }`}>
                                        {notification.message}
                                    </p>
                                    
                                    {/* Parent request actions */}
                                    {notification.type === "PARENT_REQUEST" && (
                                        <>
                                            {(!notification.status || notification.status === "PENDING") ? (
                                                <div className="mt-3">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <button
                                                            onClick={() => handleParentRequestResponse(notification._id, true)}
                                                            disabled={responding === notification._id}
                                            className="min-w-[100px] px-4 py-2 text-sm bg-gradient-to-r from-premium-500 to-premium-600 text-black rounded-full hover:from-premium-600 hover:to-premium-700 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleParentRequestResponse(notification._id, false)}
                                                            disabled={responding === notification._id}
                                            className="min-w-[100px] px-4 py-2 text-sm bg-white dark:bg-surface-700 text-surface-700 dark:text-white border border-surface-300 dark:border-surface-600 rounded-full hover:bg-surface-100 dark:hover:bg-surface-600 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            Decline
                                                        </button>
                                                        
                                                        {responding === notification._id && (
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-4 h-4 animate-spin">
                                                                    <RotateCw className="w-full h-full text-premium-500" />
                                                                </div>
                                                                <span className="text-xs text-premium-500">Processing...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="mt-2 text-xs text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-700/50 p-2 rounded-lg">
                                                        By accepting, this parent will be able to manage content recommendations for your account
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className={`mt-3 p-3 rounded-lg ${
                                                    notification.status === "ACCEPTED" 
                                                        ? "bg-green-50 dark:bg-green-900/20" 
                                                        : "bg-red-50 dark:bg-red-900/20"
                                                }`}>
                                                    <span className={`text-sm ${
                                                        notification.status === "ACCEPTED"
                                                            ? "text-green-700 dark:text-green-400"
                                                            : "text-red-700 dark:text-red-400"
                                                    }`}>
                                                        {notification.status === "ACCEPTED" ? (
                                                            <div className="flex items-center gap-2">
                                                                <Check className="w-4 h-4" />
                                                                <span>Request accepted - Parent access granted</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <X className="w-4 h-4" />
                                                                <span>Request declined</span>
                                                            </div>
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
