import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";
import { uploadToCloudinary } from "./cloudinaryService";

export const changePassword = async (oldPassword, newPassword) => {
	try {
		const accessToken = getCookie("accessToken");
		const response = await axios.post(
			`${conf.BACKEND_URL}/users/change-password`,
			{ oldPassword, newPassword },
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error changing password:", error);
		throw error;
	}
};

export const updateAvatar = async (avatarFile) => {
	try {
		// const formData = new FormData();
		const avatar = await uploadToCloudinary(avatarFile, "AVATAR");
		if (!avatar?.secure_url) {
			throw new Error("Error uploading avatar to Cloudinary");
		}

		const avatarUrl = avatar?.secure_url;

		const response = await axios.patch(
			`${conf.BACKEND_URL}/users/update-avatar`,
			{
				avatarUrl,
			},
			{
				headers: {
					Authorization: `Bearer ${getCookie("accessToken")}`,
					"Content-Type": "application/json",
				},
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error updating avatar:", error);
		throw error;
	}
};

export const updateCoverImage = async (coverImageFile) => {
	try {
		// const formData = new FormData();
		const coverImage = await uploadToCloudinary(coverImageFile, "COVERIMAGE");
		if (!coverImage?.secure_url) {
			throw new Error("Error uploading cover image to Cloudinary");
		}
		// formData.append("coverImageUrl", coverImage?.secure_url);

		const response = await axios.patch(
			`${conf.BACKEND_URL}/users/update-coverimage`,
			{
				coverImageUrl: coverImage?.secure_url,
			},
			{
				headers: {
					Authorization: `Bearer ${getCookie("accessToken")}`,
					"Content-Type": "application/json",
				},
				withCredentials: true,
			},
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
					Authorization: `Bearer ${getCookie("accessToken")}`,
				},
				withCredentials: true,
			},
		);
		console.log("updated data", response?.data);
		return response.data;
	} catch (error) {
		console.error("Error updating account details:", error);
		throw error;
	}
};
