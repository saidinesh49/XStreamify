import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getCookie } from "../../services/authService";
import { useUserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";
import { googleLogin } from "../../services/firebaseService";
import { FcGoogle } from "react-icons/fc"; // Import Google icon

export function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { userData, addUserData } = useUserContext(); // Get addUserData from context

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (userData?.username) {
			navigate("/");
		}
	}, [userData]);

	const handleGoogleLogin = async (e) => {
		e.preventDefault();
		try {
			const result = await signInWithPopup(auth, googleProvider);
			// const token = await result?.user?.getIdToken();
			const token = await result?.user?.getIdToken();
			const response = await googleLogin(
				token,
				result?._tokenResponse?.email,
				addUserData,
			);

			if (response?.message === "User does not exist") {
				toast.warn("User doen't exist! Please Signup", {
					className: "dark-toast",
					bodyClassName: "dark-toast-body",
					progressClassName: "dark-toast-progress",
				});
				navigate("/register");
				return;
			}

			if (!response?.username) {
				toast.error("Google login failed", {
					className: "dark-toast",
					bodyClassName: "dark-toast-body",
					progressClassName: "dark-toast-progress",
				});
				return;
			}

			toast.success("🎉 Welcome back!", {
				className: "dark-toast",
				bodyClassName: "dark-toast-body",
				progressClassName: "dark-toast-progress",
			});
		} catch (error) {
			console.error("Error during google login:", error);
			toast.error("Something went wrong with Google login", {
				className: "dark-toast",
				bodyClassName: "dark-toast-body",
				progressClassName: "dark-toast-progress",
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const response = await loginUser(username, password, addUserData);

		if (response?.username) {
			toast.success("🎉 Welcome back!", {
				className: "dark-toast",
				bodyClassName: "dark-toast-body",
				progressClassName: "dark-toast-progress",
			});
			navigate("/");
		} else {
			toast.error("🔐 Invalid credentials", {
				className: "dark-toast",
				bodyClassName: "dark-toast-body",
				progressClassName: "dark-toast-progress",
			});
			setError("Invalid login credentials. Please try again.");
		}

		setIsSubmitting(false);
	};

	return (
		<div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900">
			<div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
					Login
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4 mt-6">
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Username or Email
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
						/>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}{" "}
					{/* Display error message */}
					<button
						type="submit"
						className={`w-full py-2 px-4 mt-4 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 ${
							isSubmitting
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700 text-white"
						}`}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Logging in..." : "Login"}
					</button>
					<button
						type="button"
						onClick={handleGoogleLogin}
						className="w-full py-2 px-4 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<FcGoogle className="mr-2" />
						Sign in with Google
					</button>
					<div className="my-4">
						<a
							href="/register"
							className="underline text-md font-semibold decoration-auto decoration-sky-800 hover:decoration-2 hover:decoration-sky-300"
						>
							Don't have an account?
						</a>
					</div>
				</form>
			</div>
		</div>
	);
}
