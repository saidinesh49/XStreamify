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
		<div className="flex items-center justify-center bg-surface-50 dark:bg-surface-900">
			<div className="w-full max-w-md p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-surface-700 dark:text-surface-300"
						>
							Username or Email
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-premium-500 text-surface-800 dark:text-white transition-all duration-200"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-surface-700 dark:text-surface-300"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-premium-500 text-surface-800 dark:text-white transition-all duration-200"
						/>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<button
						type="submit"
						className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
							isSubmitting
								? "bg-surface-400 cursor-not-allowed"
								: "bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-black"
						}`}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Logging in..." : "Login"}
					</button>
					<button
						type="button"
						onClick={handleGoogleLogin}
						className="w-full py-2 px-4 flex items-center justify-center border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-600 focus:outline-none focus:ring-2 focus:ring-premium-500 transition-all duration-200"
					>
						<FcGoogle className="mr-2" />
						Sign in with Google
					</button>
					<div className="mt-4">
						<a
							href="/register"
							className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-premium-500 dark:hover:text-premium-400 transition-colors"
						>
							Don't have an account? Sign up
						</a>
					</div>
				</form>
			</div>
		</div>
	);
}
