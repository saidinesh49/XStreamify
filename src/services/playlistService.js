import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

export const createPlaylist = async (name, description) => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.post(
            `${conf.BACKEND_URL}/playlists`,
            { name, description },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error creating playlist:", error);
        throw error;
    }
};

export const getUserPlaylists = async (userId) => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.get(
            `${conf.BACKEND_URL}/playlists/user/${userId}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );
        console.log(response);

        return response.data;
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        throw error;
    }
};

export const getPlaylistById = async (playlistId) => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.get(
            `${conf.BACKEND_URL}/playlists/${playlistId}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );
        console.log("get Playlist by id response:", response);

        return response.data;
    } catch (error) {
        console.error("Error fetching playlist:", error);
        throw error;
    }
};

export const addVideoToPlaylist = async (videoId, playlistId) => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.patch(
            `${conf.BACKEND_URL}/playlists/add/${videoId}/${playlistId}`,
            {},
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error adding video to playlist:", error);
        throw error;
    }
};

export const removeVideoFromPlaylist = async (videoId, playlistId) => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.patch(
            `${conf.BACKEND_URL}/playlists/remove/${videoId}/${playlistId}`,
            {},
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error removing video from playlist:", error);
        throw error;
    }
};

export const deletePlaylist = async (playlistId) => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.delete(
            `${conf.BACKEND_URL}/playlists/${playlistId}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error deleting playlist:", error);
        throw error;
    }
};

export const updatePlaylist = async (playlistId, name, description) => {
    try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            console.log("No access token found");
            return null;
        }

        const response = await axios.patch(
            `${conf.BACKEND_URL}/playlists/${playlistId}`,
            { name, description },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating playlist:", error);
        throw error;
    }
}; 