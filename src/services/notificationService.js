import axios from "axios";
import { getAuthConfig } from "../utils/auth";
import conf from "../conf/conf";
import { getCookie } from "./authService";

// Get all notifications for the logged-in user
export const getNotifications = async () => {
    try {
        const config = getAuthConfig();
        const response = await axios.get(`${conf.BACKEND_URL}/notifications`, config);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get count of unread notifications
export const getNotificationCount = async () => {
    try {
        const config = getAuthConfig();
        const response = await axios.get(`${conf.BACKEND_URL}/notifications/count`, config);
        return response;
    } catch (error) {
        throw error;
    }
};

// Send a parent request notification to another user
export const sendParentRequest = async (childUserId) => {
    try {
        const config = getAuthConfig();
        
        const response = await axios.post(
            `${conf.BACKEND_URL}/notifications/parent-request`,
            { childUserId },
            config
        );
        return response;
    } catch (error) {
        throw error;
    }
};

// Respond to a parent request (accept or reject)
export const respondToParentRequest = async (notificationId, accept) => {
    try {
        const config = getAuthConfig();
        const response = await axios.post(
            `${conf.BACKEND_URL}/notifications/parent-request/${notificationId}/respond`,
            { accept },
            config
        );
        
    // Update local notification status immediately
    if (response?.data?.data) {
        const updatedNotification = response.data.data;
        // Emit a custom event for real-time notification update
        const event = new CustomEvent('notificationUpdated', {
            detail: {
                notificationId,
                status: accept ? 'ACCEPTED' : 'REJECTED',
                message: accept 
                    ? "Parent access has been granted. They can now manage content recommendations for your account." 
                    : "Parent request has been declined."
            }
        });
        window.dispatchEvent(event);
        
        // Refresh notifications to ensure proper state
        return {
            ...response,
            data: {
                ...response.data,
                data: {
                    ...response.data.data,
                    status: accept ? 'ACCEPTED' : 'REJECTED'
                }
            }
        };
    }
        
        return response;
    } catch (error) {
        throw error;
    }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
    try {
        const config = getAuthConfig();
        const response = await axios.put(
            `${conf.BACKEND_URL}/notifications/${notificationId}/read`,
            {},
            config
        );
        return response;
    } catch (error) {
        throw error;
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
    try {
        const config = getAuthConfig();
        const response = await axios.put(
            `${conf.BACKEND_URL}/notifications/read-all`,
            {},
            config
        );
        return response;
    } catch (error) {
        throw error;
    }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
    try {
        const config = getAuthConfig();
        const response = await axios.delete(
            `${conf.BACKEND_URL}/notifications/${notificationId}`,
            config
        );
        return response;
    } catch (error) {
        throw error;
    }
}; 

// Get username suggestions for parent request with filtering
export const getUserNameSuggestions = async(query) => {
    try {

        console.log("Entered getUserNameSuggestions");
        if(!query || query.trim().length < 2) {
            return { data: [] };
        }

        console.log("started for fetching at frontend");
        
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return { data: [] };
        }
        
        const response = await axios.get(
            `${conf.BACKEND_URL}/notifications/username-suggestions?query=${encodeURIComponent(query)}&includeParentInfo=true`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        // Process the response to filter out invalid suggestions
        console.log("Response from username suggestions:", response);
        if (response?.data?.data) {
            const filteredData = response.data.data.map(user => ({
                ...user,
                hasParent: user.hasParent || false // Ensure the flag exists
            }));

            return {
                ...response,
                data: {
                    ...response.data,
                    data: filteredData
                }
            };
        }
        
        return response;
    } catch (error) {
        console.error("Error fetching username suggestions:", error);
        throw error;
    }
};
