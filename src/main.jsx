import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Videos from "./pages/Videos.jsx";
import Tweets from "./pages/Tweets.jsx";
import { Channel } from "./pages/Channel.jsx";
import { PageNotFound } from "./utils/PageNotFound.jsx";
import { ComingSoon } from "./utils/ComingSoon.jsx";
import AllContextProvider from "./context/AllContextProvider.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Home from "./pages/Home.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import SignUp from "./pages/Signup.jsx";
import { VideoUploadForm } from "./components/VideoUploadForm.jsx";
import Settings from "./pages/Settings.jsx";
import VideoPlayer from "./pages/VideoPlayer.jsx";
import Followings from "./pages/followings.jsx";
import TweetDetails from "./pages/TweetDetails.jsx";
import YourVideos from "./pages/YourVideos.jsx";
import EditVideo from "./pages/EditVideo";
import YourFeeds from "./pages/YourFeeds";
import SearchResults from "./pages/SearchResults";
import CreatePlaylist from "./pages/CreatePlaylist";
import Playlist from "./pages/Playlist";
import EditPlaylist from "./pages/EditPlaylist";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/login",
				element: (
					<AuthLayout>
						<Login />
					</AuthLayout>
				),
			},

			{
				path: "/register",
				element: <SignUp />,
			},

			{
				path: "/uploadVideo",
				element: <VideoUploadForm />,
			},

			{
				path: "/videos",
				element: <Videos />,
			},

			{
				path: "/tweets",
				element: <Tweets />,
			},

			{
				path: "/tweets/:tweetId",
				element: <TweetDetails />,
			},

			{
				path: "/achievements",
				element: <ComingSoon />, // TODO
			},

			{
				path: "/following",
				element: <Followings />, // TODO
			},

			{
				path: "/settings",
				element: <Settings />,
			},

			{
				path: "/videos/:videoId",
				element: <VideoPlayer />,
			},

			{
				path: "/c/:username",
				element: <Channel />,
			},

			{
				path: "/your-videos",
				element: <YourVideos />,
			},
			{
				path: "/videos/:videoId/edit",
				element: <EditVideo />,
			},
			{
				path: "/your-feeds",
				element: <YourFeeds />,
			},
			{
				path: "/search",
				element: <SearchResults />,
			},
			{
				path: "/create-playlist",
				element: <CreatePlaylist />,
			},
			{
				path: "/playlist/:playlistId",
				element: <Playlist />,
			},
			{
				path: "/playlist/:playlistId/edit",
				element: <EditPlaylist />,
			},
			{
				path: "/*",
				element: <PageNotFound />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	//   <React.StrictMode>
	<ThemeProvider>
		<UserContextProvider>
			<RouterProvider router={router} />
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				toastClassName="text-sm font-medium"
				style={{
					"--toastify-color-light": "#18181B",
					"--toastify-color-dark": "#18181B",
					"--toastify-color-info": "#F59E0B",
					"--toastify-color-success": "#22C55E",
					"--toastify-color-warning": "#F59E0B",
					"--toastify-color-error": "#EF4444",
					"--toastify-text-color-light": "#F8FAFC",
					"--toastify-text-color-dark": "#F8FAFC",
				}}
			/>
		</UserContextProvider>
	</ThemeProvider>,
	//</React.StrictMode>
);
