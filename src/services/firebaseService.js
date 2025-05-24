import axios from "axios";
import conf from "../conf/conf";
import { getCookie, setCookie } from "./authService";

const googleLogin = async (idToken = "", email = "", addUserData) => {
	try {
		if (!email) {
			throw new Error("email not received at googleLogin.");
		}

		const response = await axios.post(`${conf.BACKEND_URL}/users/gauth/login`, {
			idToken,
			email,
		});

		const Data = response.data?.data;
		// console.log("Response from backend:", Data);

		if (Data?.data?.message == "User does not exist") {
			return Data?.data;
		}

		if (!Data?.user?.username) {
			throw new Error("No Username in response from backend");
		}

		setCookie("accessToken", `${Data?.accessToken}`, {
			secure: true,
			sameSite: "Strict",
			maxAge: 60 * 60 * 24,
		});

		// console.log("Setting user data:", Data.user);
		await addUserData(Data.user);
		Data.message = "Welcome back!";

		return Data;
	} catch (error) {
		console.error("Detailed error in googleLogin:", error);
		if (error.response.data?.message === "User does not exist")
			return error.response.data;
		return null;
	}
};


const googleSignUp = async (tokenResponse, password) => {
    try {
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const username = `${tokenResponse?.firstName?.toLowerCase().replace(/\s+/g, '')}${randomDigits}`;

        const response = await axios.post(`${conf.BACKEND_URL}/users/gauth/signup`, {
            fullName: tokenResponse?.fullName,
            username: username,
            email: tokenResponse?.email,
            password: password,
            avatar: tokenResponse?.photoUrl,
        });

        const Data = response.data?.data;
		console.log("Data after Google SignUp:", Data);

        if (!Data?.user?.username) {
            throw new Error("No Username in response from backend");
        }

		setCookie("accessToken", `${Data?.accessToken}`, {
			secure: true,
			sameSite: "Strict",
			maxAge: 60 * 60 * 24,
		});

        return Data?.user;
    } catch (error) {
        console.error("Error in googleSignUp:", error);
        return null;
    }
};

export { googleLogin, googleSignUp };