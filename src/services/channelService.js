import axios from "axios";
import conf from "../conf/conf";
import { getCookie } from "./authService";

const getUserByObjectId = async(objectid)=>{
	try {
		if(!objectid){
			console.log("Object Id is needed");
			return;
		}
        const accessToken=getCookie("accessToken");
		if(!accessToken) {
			console.log("No access token found");
			return null;
		   }
		
		const data=await axios.get(`${conf.BACKEND_URL}/users/${objectid}`,{
			headers: { Authorization: `Bearer ${accessToken}` },
			withCredentials: true,
		})
		.then((res)=>{
			console.log(res);
			return res.data;
		});

		if(!data){
			console.log("No details found or invalid Object Id");
		}

		return data;

	} catch (error) {
		console.log("Error: ",error);
		return null;
	}
}

const getChannelInfo = async (username) => {
	try {
		if (!username) return null;
		const accessToken = getCookie("accessToken");
		if (!accessToken) {
			console.log("No access token found");
			return null;
		}
		const channelInfo = await axios
			.get(`${conf.BACKEND_URL}/users/c/${username}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			})
			.then((res) => res.data);
		if (!channelInfo?.data) {
			console.log("Problem occured while getting channel info");
			return null;
		}
		console.log("Received channel info at frontend is: ", channelInfo);
		return {
			data: channelInfo?.data,
		};
	} catch (error) {
		console.log("Error: while fetching channel info ", error);
		return null;
	}
};

const getCurrentUserInfo = async () => {
	try {
		const currentUser = await axios.get(
			`${conf.BACKEND_URL}/users/current-user`,
		);
		if (!currentUser?.data) {
			return null;
		}
		return {
			data: currentUser.data,
		};
	} catch (error) {
		console.log("Error: while getting current user ", error);
		return null;
	}
};

const toggleChannelSubscription = async (channelId) => {
	try {
		if (!channelId) {
			console.log("Channel Id is required");
			return null;
		}
		const accessToken = getCookie("accessToken");
		const Data = await axios.post(
			`${conf.BACKEND_URL}/subscriptions/c/${channelId}`,
			{},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				withCredentials: true,
			},
		);

		if (!Data) {
			console.log("Error while toggling subcription", Data);
			return null;
		}
		return Data?.data;
	} catch (error) {
		console.log("500 Internal server error", error);
	}
};

const getUserFollowings = async (userChannelId) => {
	try {
		if(!userChannelId) {
			throw new Error("User channel is not forwarded to channel service at frontend");
		}
		const accessToken = getCookie("accessToken");
		const Data = await axios.get(`${conf.BACKEND_URL}/subscriptions/c/${userChannelId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			withCredentials: true,
		});
		if (!Data?.data) {
			console.log("Problem occured while getting followers");
			return null;
		}
		return Data?.data;
	} catch (error) {
		console.log("Error: while getting user followers ", error);
		return null;
	}
};

export { getUserFollowings, 
    getChannelInfo, getCurrentUserInfo, toggleChannelSubscription,
 getUserByObjectId };
