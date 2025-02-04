import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { uploadVideo } from "../services/videoService";
import Loading from "../utils/Loading";
import { toast } from "react-toastify";
import { Upload, FileVideo, Image, X } from "lucide-react";

export function VideoUploadForm() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [videoFile, setVideoFile] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [tagInput, setTagInput] = useState("");
	const [tags, setTags] = useState([]);
	const { userData } = useUserContext();
	const navigate = useNavigate();
	useEffect(() => {
		if (!userData?.username) {
			navigate("/login");
			toast.warn("Please login to access!");
			return;
		}
	}, [userData]);

	const validateForm = () => {
		if (!title.trim()) {
			setError("Title is required");
			toast.error("Title is required");
			return false;
		}
		if (!description.trim()) {
			setError("Description is required");
			toast.error("Description is required");
			return false;
		}
		if (!videoFile) {
			setError("Video file is required");
			toast.error("Video file is required");
			return false;
		}
		if (!thumbnail) {
			setError("Thumbnail is required");
			toast.error("Thumbnail is required");
			return false;
		}
		return true;
	};

	const handleTagInput = (e) => {
		if (e.key === "Enter" && tagInput.trim()) {
			e.preventDefault();
			addTag();
		}
	};

	const addTag = () => {
		const newTag = tagInput.trim().toLowerCase();
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag]);
			setTagInput("");
		}
	};

	const removeTag = (tagToRemove) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleVideoUpload = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setLoading(true);
		setError(null);
		const toastId = toast.loading("Uploading video...");

		try {
			console.log("Frontend videoForm files are: ", videoFile, thumbnail);
			const videoData = {
				title: title.trim(),
				description: description.trim(),
				videoFile,
				thumbnail,
				tags, // Add tags to upload data
			};

			const response = await uploadVideo(videoData);
			if (response?.data) {
				toast.update(toastId, {
					render: "Video uploaded successfully!",
					type: "success",
					isLoading: false,
					autoClose: 3000,
				});
				navigate(`/videos/${response.data._id}`);
			} else {
				toast.update(toastId, {
					render: "Failed to upload video",
					type: "error",
					isLoading: false,
					autoClose: 3000,
				});
				setError("Failed to upload video");
			}
		} catch (error) {
			console.error("Error uploading video:", error);
			toast.update(toastId, {
				render: "An error occurred while uploading",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
			setError("An error occurred while uploading the video");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="pt-20 px-4">
			<div className="max-w-2xl mx-auto p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
				<div className="flex items-center gap-3 mb-6">
					<Upload className="w-6 h-6 text-primary-600 dark:text-primary-400" />
					<h2 className="text-2xl font-bold text-surface-900 dark:text-white">
						Upload Video
					</h2>
				</div>

				{error && (
					<div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
						{error}
					</div>
				)}

				<form onSubmit={handleVideoUpload} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
							Title
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500/30 focus:border-primary-500 dark:focus:border-primary-500 transition-colors"
							placeholder="Enter video title"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows="4"
							className="w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500/30 focus:border-primary-500 dark:focus:border-primary-500 transition-colors"
							placeholder="Enter video description"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
							Video File *
						</label>
						<div className="relative">
							<input
								type="file"
								accept="video/*"
								onChange={(e) => setVideoFile(e.target.files[0])}
								className="hidden"
								id="video-upload"
							/>
							<label
								htmlFor="video-upload"
								className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
									!videoFile
										? "bg-surface-50 dark:bg-surface-700 border-surface-300 dark:border-surface-500"
										: "bg-surface-100 dark:bg-surface-600 border-primary-500"
								}`}
							>
								<FileVideo className="w-5 h-5 text-surface-500 dark:text-surface-400" />
								<span className="text-surface-600 dark:text-surface-300">
									{videoFile ? videoFile.name : "Choose video file *"}
								</span>
							</label>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
							Thumbnail *
						</label>
						<div className="relative">
							<input
								type="file"
								accept="image/*"
								onChange={(e) => setThumbnail(e.target.files[0])}
								className="hidden"
								id="thumbnail-upload"
							/>
							<label
								htmlFor="thumbnail-upload"
								className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
									!thumbnail
										? "bg-surface-50 dark:bg-surface-700 border-surface-300 dark:border-surface-500"
										: "bg-surface-100 dark:bg-surface-600 border-primary-500"
								}`}
							>
								<Image className="w-5 h-5 text-surface-500 dark:text-surface-400" />
								<span className="text-surface-600 dark:text-surface-300">
									{thumbnail ? thumbnail.name : "Choose thumbnail image *"}
								</span>
							</label>
							{!thumbnail && (
								<p className="mt-1 text-xs text-red-500">
									Thumbnail is required for better video preview
								</p>
							)}
						</div>
					</div>

					{/* Tags Input Section */}
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
								Tags
							</label>
							<div className="flex flex-wrap gap-2 p-2 border border-surface-200 dark:border-surface-600 rounded-lg min-h-[2.5rem]">
								{tags.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
									>
										#{tag}
										<button
											type="button"
											onClick={() => removeTag(tag)}
											className="hover:text-red-500 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									</span>
								))}
								<div className="flex-1">
									<input
										type="text"
										value={tagInput}
										onChange={(e) => setTagInput(e.target.value)}
										onKeyDown={handleTagInput}
										placeholder="Add tags (press Enter)"
										className="w-full bg-transparent border-none focus:ring-0 text-surface-800 dark:text-white placeholder-surface-400 outline-none"
									/>
								</div>
							</div>
							<div className="flex items-center gap-2 mt-2">
								<button
									type="button"
									onClick={addTag}
									disabled={!tagInput.trim()}
									className="px-3 py-1 text-sm bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 transition-colors"
								>
									Add Tag
								</button>
							</div>
						</div>
					</div>

					<button
						type="submit"
						disabled={
							isLoading || !title || !description || !videoFile || !thumbnail
						}
						className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<>
								<Loading size="sm" />
								<span>Uploading...</span>
							</>
						) : (
							<>
								<Upload className="w-5 h-5" />
								<span>Upload Video</span>
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
