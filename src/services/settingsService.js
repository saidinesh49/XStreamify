import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

export const changePassword = async (oldPassword, newPassword) => {
	try {
		const response = await axios.post(
			`${conf.BACKEND_URL}/users/change-password`,
			{ oldPassword, newPassword },
			{
				headers: { 
					Authorization: `Bearer ${getCookie('accessToken')}`,
				},
				withCredentials: true
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error changing password:", error);
		throw error;
	}
};

export const updateAvatar = async (avatarFile) => {
	try {
		const formData = new FormData();
		formData.append('avatar', avatarFile);

		const response = await axios.patch(
			`${conf.BACKEND_URL}/users/update-avatar`,
			formData,
			{
				headers: { 
					Authorization: `Bearer ${getCookie('accessToken')}`,
					'Content-Type': 'multipart/form-data'
				},
				withCredentials: true
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error updating avatar:", error);
		throw error;
	}
};

export const updateCoverImage = async (coverImageFile) => {
	try {
		const formData = new FormData();
		formData.append('coverImage', coverImageFile);

		const response = await axios.patch(
			`${conf.BACKEND_URL}/users/update-coverimage`,
			formData,
			{
				headers: { 
					Authorization: `Bearer ${getCookie('accessToken')}`,
					'Content-Type': 'multipart/form-data'
				},
				withCredentials: true
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error updating cover image:", error);
		throw error;
	}
};

export const updateAccountDetails = async (fullName, email) => {
    try {
        const response = await axios.patch(
            `${conf.BACKEND_URL}/users/update-account`,
            { fullName, email },
            {
                headers: { 
                    Authorization: `Bearer ${getCookie('accessToken')}`,
                },
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating account details:", error);
        throw error;
    }
};