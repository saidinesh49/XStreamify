import React, { useState, useEffect, useRef, Children } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { 
    getChildrenAccounts, 
    linkChildAccount, 
    unlinkChildAccount,
    getChildTags,
    updateChildExcludedTags
} from "../services/parentChildService";
import { getUserNameSuggestions, sendParentRequest } from "../services/notificationService";
import { toast } from "react-toastify";
import Loading from "../utils/Loading";
import { User, X, Plus, Shield, Eye, Edit, Search, RotateCw, AlertTriangle } from "lucide-react";

export default function ManageChildren() {
    const { userData } = useUserContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [children, setChildren] = useState([]);
    const [searchUsername, setSearchUsername] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [selectedChildTags, setSelectedChildTags] = useState({ includeTags: [], excludeTags: [] });
    const [excludeTagInput, setExcludeTagInput] = useState("");
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const [error, setError] = useState("");
    const searchInputRef = useRef(null);
    const suggestionRef = useRef(null);
    const debounceTimerRef = useRef(null);
    
    // Fetch all children accounts
    useEffect(() => {
        if (!userData?.username) {
            navigate("/login");
            return;
        }
        
        const fetchChildren = async () => {
            try {
                setLoading(true);
                const response = await getChildrenAccounts();
                if (response?.data) {
                    setChildren(response?.data);
                }
            } catch (error) {
                toast.error("Failed to load children accounts");
            } finally {
                setLoading(false);
            }
        };
        
        fetchChildren();
    }, [userData, navigate]);

    // Handle username search and suggestions
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchUsername(value);
        setError("");
        
        // Show suggestions if input is not empty and at least 2 characters
        const shouldShowSuggestions = value.trim().length >= 2;
        setShowSuggestions(shouldShowSuggestions);
        
        // Clear any existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        if (shouldShowSuggestions) {
            setIsSearching(true);
            
            // Debounce API call
            debounceTimerRef.current = setTimeout(() => {
                fetchSuggestions(value);
            }, 300);
        } else {
            setSuggestions([]);
            if (value.trim().length === 1) {
                setError("Please enter at least 2 characters");
            }
        }
    };

    // Fetch username suggestions
    const fetchSuggestions = async (searchTerm) => {
        try {
            const response = await getUserNameSuggestions(searchTerm.trim());
            
            if (response?.data?.data) {
                // Filter out invalid suggestions
                const filteredSuggestions = response.data.data.filter(user => {
                    if (user.hasParent) {
                        setError("Some users are not shown because they already have parent accounts.");
                        return false;
                    }
                    return true;
                });
                setSuggestions(filteredSuggestions);
            }
        } catch (error) {
            setError("Failed to fetch user suggestions");
            setSuggestions([]);
        } finally {
            setIsSearching(false);
        }
    };
    
    // Handle sending parent request
    const handleSendRequest = async (childId) => {
        try {
            const response = await sendParentRequest(childId);
            if (response) {
                toast.success("Parent request sent successfully");
                setSearchUsername("");
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to send parent request";
            toast.error(errorMessage);
        }
    };
    
    // Handle unlinking a child account
    const handleUnlinkChild = async (childId) => {
        if (window.confirm("Are you sure you want to unlink this child account?")) {
            try {
                await unlinkChildAccount(childId);
                toast.success("Child account unlinked successfully");
                setChildren(children.filter((child) => child._id !== childId));
                if (selectedChild?._id === childId) {
                    setSelectedChild(null);
                    setSelectedChildTags({ includeTags: [], excludeTags: [] });
                }
            } catch (error) {
                toast.error("Failed to unlink child account");
            }
        }
    };
    
    // Handle selecting a child to manage tags
    const handleSelectChild = async (child) => {
        setSelectedChild(child);
        setIsLoadingTags(true);
        
        try {
            const response = await getChildTags(child._id);
            if (response?.data) {
                setSelectedChildTags({
                    includeTags: response.data.tags || [],
                    excludeTags: response.data.excludedTags || [],
                    hasParent: response.data.hasParent
                });
            }
        } catch (error) {
            toast.error("Failed to load child's tags");
        } finally {
            setIsLoadingTags(false);
        }
    };
    
    // Handle adding an excluded tag for the child
    const handleAddExcludedTag = async () => {
        console.log("selectedChild is: ",selectedChild);
        if (!excludeTagInput.trim() || !selectedChild) return;
        
        try {
            const response = await updateChildExcludedTags({
                childUserId: selectedChild._id,
                tag: excludeTagInput.trim().toLowerCase(),
                action: "add"
            }
            );

            console.log("parent excluding res: ",response);
            
            if (response?.data) {
                setSelectedChildTags({
                    ...selectedChildTags,
                    excludeTags: response.data.excludedTags || []
                });
                setExcludeTagInput("");
                toast.success("Tag added to child's excluded list");
            }
        } catch (error) {
            console.log("Error:",error);
            toast.error("Failed to add tag to child's excluded list");
        }
    };
    
    // Handle removing an excluded tag from the child
    const handleRemoveExcludedTag = async (tag) => {
        if (!selectedChild) return;
        
        try {
            const response = await updateChildExcludedTags({
                childUserId: selectedChild._id,
                tag: tag,
                action: "remove"
            }
            );
            
            if (response?.data) {
                setSelectedChildTags({
                    ...selectedChildTags,
                    excludeTags: response.data.excludedTags || []
                });
                toast.success("Tag removed from child's excluded list");
            }
        } catch (error) {
            toast.error("Failed to remove tag from child's excluded list");
        }
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loading />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-surface-800 dark:text-white mb-6">
                        Manage Content for Your Chicks
                    </h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left sidebar - Children list and search */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Search box */}
                            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-premium-500" />
                                    Find Children
                                </h2>
                                
                                <div className="relative">
                                    <div className="relative">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchUsername}
                                            onChange={handleSearchChange}
                                            onFocus={() => setShowSuggestions(searchUsername.trim().length >= 2)}
                                            onBlur={(e) => {
                                                if (suggestionRef.current && !suggestionRef.current.contains(e.relatedTarget)) {
                                                    setTimeout(() => setShowSuggestions(false), 200);
                                                }
                                            }}
                                            placeholder="Search username to add..."
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-500 dark:bg-surface-700 dark:border-surface-600 dark:text-white transition-shadow duration-300"
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <RotateCw className="w-4 h-4 text-surface-400 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {error && (
                                        <div className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span>{error}</span>
                                        </div>
                                    )}
                                    
                                    {/* Username suggestions dropdown */}
                                    {showSuggestions && (
                                        <div 
                                            ref={suggestionRef}
                                            className="absolute w-full mt-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg overflow-hidden z-10"
                                        >
                                            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-300 dark:scrollbar-thumb-surface-600">
                                                {suggestions.length === 0 ? (
                                                    <div className="px-4 py-3 text-surface-500 dark:text-surface-400 flex items-center gap-2">
                                                        <Search className="w-4 h-4" />
                                                        <span>No users found</span>
                                                    </div>
                                                ) : (
                                                    suggestions.map((user) => (
                                                        <div
                                                            key={user._id}
                                                            className="px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-700 flex items-center justify-between group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-premium-400 to-premium-600 flex items-center justify-center text-black">
                                                                    {user.avatar ? (
                                                                        <img 
                                                                            src={user.avatar} 
                                                                            alt={user.username}
                                                                            className="w-full h-full object-cover rounded-full"
                                                                        />
                                                                    ) : (
                                                                        <User className="w-6 h-6" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-medium text-surface-800 dark:text-white">
                                                                        {user.fullName || user.username}
                                                                    </h3>
                                                                    <p className="text-sm text-surface-500">
                                                                        @{user.username}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleSendRequest(user._id)}
                                                                className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-gradient-to-r from-premium-500 to-premium-600 text-black rounded-full hover:from-premium-600 hover:to-premium-700 transition-all duration-300 text-sm flex items-center gap-1.5"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Add
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Children list */}
                            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-premium-500" />
                                    Your Chicks
                                </h2>
                                
                                {children.length > 0 ? (
                                    <div className="space-y-3">
                                        {children.map((child) => (
                                            
                                            <div
                                                key={child.user._id}
                                                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                                                    selectedChild?._id === child.user._id
                                                        ? "bg-premium-50 dark:bg-premium-900/30 border border-premium-500"
                                                        : "hover:bg-surface-50 dark:hover:bg-surface-700 border border-transparent"
                                                }`}
                                                onClick={() => handleSelectChild(child.user)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-premium-400 to-premium-600 flex items-center justify-center text-black">
                                                        {child.user.avatar ? (
                                                            <img 
                                                                src={child.user.avatar} 
                                                                alt={child.user.username}
                                                                className="w-full h-full object-cover rounded-full"
                                                            />
                                                        ) : (
                                                            <User className="w-6 h-6" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-surface-800 dark:text-white">
                                                            {child.user.fullName}
                                                        </h3>
                                                        <p className="text-sm text-surface-500">
                                                            @{child.user.username}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUnlinkChild(child.user._id);
                                                    }}
                                                    className="p-2 hover:bg-red-500/10 rounded-full transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-red-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Shield className="w-16 h-16 mx-auto mb-4 text-surface-400" />
                                        <h3 className="font-medium text-surface-800 dark:text-white mb-2">
                                            No Children Yet
                                        </h3>
                                        <p className="text-surface-500">
                                            Search for users above to send parent requests.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Right content - Tag Management */}
                        <div className="lg:col-span-2">
                            {selectedChild ? (
                                <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-surface-800 dark:text-white mb-6">
                                        Managing content for {selectedChild.fullName}
                                    </h2>
                                    
                                    {isLoadingTags ? (
                                        <div className="flex justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-premium-500"></div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {/* View child's included tags (read-only) */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <h3 className="text-lg font-medium text-surface-800 dark:text-white">
                                                        Favorite recommendations
                                                    </h3>
                                                    <Eye className="w-4 h-4 text-premium-500" />
                                                    <span className="text-xs bg-premium-500/10 text-premium-500 px-2 py-0.5 rounded-full">
                                                        View only
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 p-4 bg-surface-50 dark:bg-surface-700/50 rounded-lg min-h-[4rem]">
                                                    {selectedChildTags.includeTags.length > 0 ? (
                                                        selectedChildTags.includeTags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="inline-flex items-center px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="w-full text-center text-surface-500 dark:text-surface-400 py-2">
                                                            No favorite tags added by {selectedChild.fullName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Manage child's excluded tags (editable) */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <h3 className="text-lg font-medium text-surface-800 dark:text-white">
                                                        Content to exclude
                                                    </h3>
                                                    <Edit className="w-4 h-4 text-premium-500" />
                                                    <span className="text-xs bg-premium-500/10 text-premium-500 px-2 py-0.5 rounded-full">
                                                        You control
                                                    </span>
                                                </div>
                                                <div className="p-4 border border-red-200 dark:border-red-800/30 rounded-lg bg-red-50/50 dark:bg-red-900/10">
                                                    <div className="flex flex-wrap gap-2 min-h-[4rem] mb-4">
                                                        {selectedChildTags.excludeTags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm group"
                                                            >
                                                                #{tag}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveExcludedTag(tag)}
                                                                    className="hover:bg-red-200 dark:hover:bg-red-800/30 p-0.5 rounded-full transition-colors"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                        <input
                                                            type="text"
                                                            value={excludeTagInput}
                                                            onChange={(e) => setExcludeTagInput(e.target.value)}
                                                            onKeyDown={(e) => e.key === "Enter" && handleAddExcludedTag()}
                                                            placeholder="Type a tag to exclude and press Enter"
                                                            className="flex-1 min-w-[200px] bg-transparent border-none focus:ring-0 text-red-700 dark:text-red-400 placeholder-red-400/60 dark:placeholder-red-500/40 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={(e)=>{handleAddExcludedTag(e)}}
                                                            disabled={!excludeTagInput.trim()}
                                                            className="px-4 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            Add Tag
                                                        </button>
                                                        <p className="text-sm text-red-600/80 dark:text-red-400/80">
                                                            Content with these tags won't appear in {selectedChild.fullName}'s feed
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-8 text-center">
                                    <Shield className="w-16 h-16 mx-auto mb-4 text-premium-500 opacity-50" />
                                    <h3 className="text-xl font-semibold text-surface-800 dark:text-white mb-2">
                                        Select a child to manage
                                    </h3>
                                    <p className="text-surface-500 dark:text-surface-400">
                                        Click on a child account from the list to manage their content filters.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
