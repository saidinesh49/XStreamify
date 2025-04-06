import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";
import { toast } from "react-toastify";

// Link a child account to the parent
export const linkChildAccount = async (childUsername) => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.post(
            `${conf.BACKEND_URL}/feeds/parent/link-child`,
            { childUsername },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error linking child account:", error);
        throw error;
    }
};

// Unlink a child account from the parent
export const unlinkChildAccount = async (childUserId) => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.delete(
            `${conf.BACKEND_URL}/feeds/parent/unlink-child/${childUserId}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error unlinking child account:", error);
        throw error;
    }
};

// Get all children accounts
export const getChildrenAccounts = async () => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.get(
            `${conf.BACKEND_URL}/feeds/parent/children`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        console.log("childrens are: ",response.data);

        return response.data;
    } catch (error) {
        console.error("Error fetching children accounts:", error);
        throw error;
    }
};

// Get a child's tags
export const getChildTags = async (childUserId) => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.get(
            `${conf.BACKEND_URL}/feeds/parent/child/${childUserId}/tags`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching child tags:", error);
        throw error;
    }
};

// Update a child's excluded tags
export const updateChildExcludedTags = async (Data) => {
    const {childUserId, tag, action} = Data;
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            throw new error("Access Token Required");
            return null;
        }

        console.log("updating child excluded tags: ", { tag, action });

        const response = await axios.post(
            `${conf.BACKEND_URL}/feeds/parent/child/${childUserId}/excluded-tags`,
            { tag:tag, action: action },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        console.log("excluding tags response: ", response);

        return response.data;
    } catch (error) {
        console.error("Error updating child excluded tags:", error);
        throw error;
    }
}; 