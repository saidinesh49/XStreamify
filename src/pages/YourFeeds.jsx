import React, { useState, useEffect } from "react";
import {
	getUserTags,
	addCustomTag,
	removeTag,
} from "../services/recommendationService";
import Loading from "../utils/Loading";
import { toast } from "react-toastify";
import { X } from "lucide-react";

export default function YourFeeds() {
	const [includeTags, setIncludeTags] = useState([]);
	const [excludeTags, setExcludeTags] = useState([]);
	const [includeTagInput, setIncludeTagInput] = useState("");
	const [excludeTagInput, setExcludeTagInput] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const response = await getUserTags("include");
				if (response?.data) {
					setIncludeTags(response.data.tags);
				} else {
					toast.error("Failed to load include tags");
				}
				const excludeResponse = await getUserTags("exclude");
				if (excludeResponse?.data) {
					setExcludeTags(excludeResponse.data.excludedTags);
				} else {
					toast.error("Failed to load exclude tags");
				}
			} catch (error) {
				toast.error("Failed to load tags");
			} finally {
				setLoading(false);
			}
		};

		fetchTags();
	}, []);

	const handleAddTag = async (type) => {
		const tagInput = type === "include" ? includeTagInput : excludeTagInput;
		if (!tagInput.trim()) return;
		try {
			const response = await addCustomTag({
				tag: tagInput.trim().toLowerCase(),
				type,
			});
			if (response?.data) {
				if (type === "include") {
					setIncludeTags(response.data.tags);
					setIncludeTagInput("");
				} else {
					setExcludeTags(response.data.excludedTags);
					setExcludeTagInput("");
				}
				toast.success("Tag added successfully");
			} else {
				toast.error("Failed to add tag");
			}
		} catch (error) {
			toast.error("Failed to add tag");
		}
	};

	const handleRemoveTag = async (tag, type) => {
		try {
			const response = await removeTag({ tag, type });
			if (response?.data) {
				if (type === "include") {
					setIncludeTags(response.data.tags);
				} else {
					setExcludeTags(response.data.excludedTags);
				}
				toast.success("Tag removed successfully");
			} else {
				toast.error("Failed to remove tag");
			}
		} catch (error) {
			toast.error("Failed to remove tag");
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
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-surface-800 dark:text-white">
						Your Feeds
					</h1>
				</div>

				<div className="mb-6 space-y-4">
					<h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-2">
						Customize your recommendations
					</h2>
					<div className="space-y-10">
						{/* Include Tags Section */}
						<div>
							<h3 className="text-md font-semibold text-surface-800 dark:text-white mb-2">
								Favorite recommendations
							</h3>
							<div className="flex flex-wrap gap-2 p-2 border border-surface-200 dark:border-surface-600 rounded-lg min-h-[2.5rem]">
								{includeTags.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
									>
										#{tag}
										<button
											type="button"
											onClick={() => handleRemoveTag(tag, "include")}
											className="hover:text-red-500 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									</span>
								))}
								<div className="flex-1">
									<input
										type="text"
										value={includeTagInput}
										onChange={(e) => setIncludeTagInput(e.target.value)}
										onKeyDown={(e) =>
											e.key === "Enter" && handleAddTag("include")
										}
										placeholder="Add tags (press Enter)"
										className="w-full bg-transparent border-none focus:ring-0 text-surface-800 dark:text-white placeholder-surface-400 outline-none"
									/>
								</div>
							</div>
							<div className="flex items-center gap-2 mt-2">
								<button
									type="button"
									onClick={() => handleAddTag("include")}
									disabled={!includeTagInput.trim()}
									className="px-4 py-2 text-sm bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 transition-colors"
								>
									Add Tag
								</button>
							</div>
						</div>

						{/* Exclude Tags Section */}
						<div>
							<h3 className="text-md font-semibold text-surface-800 dark:text-white mb-2">
								Exclude from recommendations
							</h3>
							<div className="flex flex-wrap gap-2 p-2 border border-red-200 dark:border-red-600 rounded-lg min-h-[2.5rem]">
								{excludeTags.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm"
									>
										#{tag}
										<button
											type="button"
											onClick={() => handleRemoveTag(tag, "exclude")}
											className="hover:text-red-500 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									</span>
								))}
								<div className="flex-1">
									<input
										type="text"
										value={excludeTagInput}
										onChange={(e) => setExcludeTagInput(e.target.value)}
										onKeyDown={(e) =>
											e.key === "Enter" && handleAddTag("exclude")
										}
										placeholder="Add tags (press Enter)"
										className="w-full bg-transparent border-none focus:ring-0 text-surface-800 dark:text-white placeholder-surface-400 outline-none"
									/>
								</div>
							</div>
							<div className="flex items-center gap-2 mt-2">
								<button
									type="button"
									onClick={() => handleAddTag("exclude")}
									disabled={!excludeTagInput.trim()}
									className="px-4 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 transition-colors"
								>
									Add Tag
								</button>
							</div>
							<p className="mt-2 text-sm text-red-500">
								Tags added here will exclude videos with these tags from your
								recommendations, even if they consist of your favorite tags.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
