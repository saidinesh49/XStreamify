import { getCookie } from "../services/authService";

export const getAuthConfig = () => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
        console.log("No access token found");
        return null;
    }

    return {
        headers: { 
            Authorization: `Bearer ${accessToken}` 
        },
        withCredentials: true
    };
}; 