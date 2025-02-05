import React, { useState, useEffect } from "react";
import { getSearchSuggestions, addSearchTerm } from "../services/searchService";
import { Search, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../utils/Loading";

export default function SearchBar() {
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (query.trim()) {
			const fetchSuggestions = async () => {
				setLoading(true);
				const response = await getSearchSuggestions(query.trim());
				if (response?.data) {
					setSuggestions(response.data);
				}
				setLoading(false);
			};
			fetchSuggestions();
		} else {
			setSuggestions([]);
		}
	}, [query]);

	const handleSearch = async (term) => {
		if (term.trim()) {
			await addSearchTerm(term.trim());
			navigate(`/search?query=${term.trim()}`);
			setShowSuggestions(false);
		}
	};

	const handleInputChange = (e) => {
		setQuery(e.target.value);
		setShowSuggestions(true);
	};

	const handleSuggestionClick = (suggestion) => {
		handleSearch(suggestion.term);
	};

	return (
		<div className="relative">
			<div className="relative group">
				<Search className="absolute left-3 top-2.5 w-5 h-5 text-surface-400 dark:text-surface-500 transition-colors duration-300 group-hover:text-primary-500" />
				<input
					type="text"
					value={query}
					onChange={handleInputChange}
					placeholder="Search..."
					className="w-full px-4 py-2 pl-10 bg-surface-50 dark:bg-surface-800 rounded-full border border-surface-200 dark:border-surface-700 focus:outline-none focus:border-primary-300 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20 transition-all duration-300 group-hover:bg-surface-100 dark:group-hover:bg-surface-700"
				/>
			</div>

			{loading && (
				<div className="absolute top-full left-0 right-0 bg-white dark:bg-surface-800 shadow-lg rounded-lg mt-2 z-50">
					<Loading />
				</div>
			)}
			{showSuggestions && suggestions.length > 0 && (
				<div className="absolute top-full left-0 right-0 bg-white dark:bg-surface-800 shadow-lg rounded-lg mt-2 z-50">
					<ul className="max-h-60 overflow-y-auto">
						{suggestions.map((suggestion) => (
							<li
								key={suggestion.term}
								className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-surface-700 cursor-pointer"
								onClick={() => handleSuggestionClick(suggestion)}
							>
								<TrendingUp className="w-4 h-4 text-primary-500" />
								<span className="text-gray-800 dark:text-white">
									{suggestion.term}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
