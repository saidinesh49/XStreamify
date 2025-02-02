import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { getVideoById, updateVideo } from "../services/videoService";
import { toast } from "react-toastify";
import Loading from "../utils/Loading";
import { Save, ArrowLeft, Image } from "lucide-react";

export default function EditVideo() {
	const { videoId } = useParams();
	const navigate = useNavigate();
	const { userData } = useUserContext();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [video, setVideo] = useState(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [newThumbnail, setNewThumbnail] = useState(null);

	useEffect(() => {
		const fetchVideo = async () => {
			try {
				const response = await getVideoById(videoId);
				if (!response?.data) {
					toast.error("Video not found");
					navigate("/your-videos");
					return;
				}

				// Check if user is the owner
				if (response.data.owner !== userData?._id) {
					toast.error("You don't have permission to edit this video");
					navigate("/your-videos");
					return;
				}

				setVideo(response.data);
				setTitle(response.data.title);
				setDescription(response.data.description);
			} catch (error) {
				toast.error("Failed to fetch video details");
				navigate("/your-videos");
			} finally {
				setLoading(false);
			}
		};

		if (!userData?.username) {
			navigate("/login");
			return;
		}

		fetchVideo();
	}, [videoId, userData]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);

		try {
			const response = await updateVideo(videoId, {
				title: title.trim(),
				description: description.trim(),
				thumbnail: newThumbnail,
			});

			if (response?.data) {
				toast.success("Video updated successfully");
				navigate("/your-videos");
			} else {
				throw new Error("Failed to update video");
			}
		} catch (error) {
			toast.error(error.message || "Failed to update video");
		} finally {
			setSaving(false);
		}
	};

	const handleCancel = () => {
		if (
			title !== video?.title ||
			description !== video?.description ||
			newThumbnail
		) {
			if (window.confirm("Are you sure you want to discard your changes?")) {
				navigate("/your-videos");
			}
		} else {
			navigate("/your-videos");
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading />
			</div>
		);
	}

	return (
		<div className="pt-20 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center gap-4 mb-6">
					<button
						onClick={handleCancel}
						className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors"
					>
						<ArrowLeft className="w-6 h-6" />
					</button>
					<h1 className="text-2xl font-bold text-surface-800 dark:text-white">
						Edit Video
					</h1>
				</div>

				<div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Video Preview */}
						<div className="aspect-video rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-900">
							<video
								src={video?.videoUrl}
								poster={video?.thumbnail}
								controls
								className="w-full h-full object-contain"
							/>
						</div>

						{/* Title */}
						<div>
							<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
								Title
							</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500/30 transition-colors"
								required
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
								Description
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows="4"
								className="w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500/30 transition-colors"
								required
							/>
						</div>

						{/* Thumbnail Upload */}
						<div>
							<label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
								Update Thumbnail
							</label>
							<div className="relative">
								<input
									type="file"
									accept="image/*"
									onChange={(e) => setNewThumbnail(e.target.files[0])}
									className="hidden"
									id="thumbnail-upload"
								/>
								<label
									htmlFor="thumbnail-upload"
									className="flex items-center gap-3 px-4 py-3 bg-surface-50 dark:bg-surface-700 border-2 border-dashed border-surface-300 dark:border-surface-500 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
								>
									<Image className="w-5 h-5 text-surface-500 dark:text-surface-400" />
									<span className="text-surface-600 dark:text-surface-300">
										{newThumbnail ? newThumbnail.name : "Choose new thumbnail"}
									</span>
								</label>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center justify-end gap-4">
							<button
								type="button"
								onClick={handleCancel}
								className="px-6 py-2.5 text-white  bg-red-600 hover:bg-red-900 rounded-lg dark:bg-red-600 dark:hover:bg-red-800 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={saving}
								className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
							>
								{saving ? (
									<>
										<Loading size="sm" />
										<span>Saving...</span>
									</>
								) : (
									<>
										<Save className="w-5 h-5" />
										<span>Save Changes</span>
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
