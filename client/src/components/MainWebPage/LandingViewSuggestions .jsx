import React, { useEffect, useState } from "react";
import { Heart, User, Calendar, Filter, ArrowUpDown, Clock, ChevronDown, X, Tag, Search, SlidersHorizontal, BookmarkPlus, MessageSquare, Sparkles } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore.js";
import toast from "react-hot-toast";

const LandingViewSuggestions = () => {
  const {
    authUser,
    suggestions,
    fetchSuggestions,
    likeSuggestion,
  } = useAuthStore();

  // Filter states
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [timeFilter, setTimeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showMySuggestions, setShowMySuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDescription, setExpandedDescription] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [suggestions, selectedCategory, sortOrder, timeFilter, showMySuggestions, searchQuery]);

  const safeSuggestions = Array.isArray(suggestions) ? suggestions : Object.values(suggestions || {});

  // Get unique categories from suggestions
  const getCategories = () => {
    const categories = new Set(safeSuggestions.map(suggestion => suggestion.category));
    return ["all", ...Array.from(categories)];
  };

  // Apply all filters and sorting
  const applyFilters = () => {
    let result = [...safeSuggestions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(suggestion => 
        suggestion.title.toLowerCase().includes(query) || 
        suggestion.description.toLowerCase().includes(query) ||
        suggestion.category.toLowerCase().includes(query)
      );
    }

    // My suggestions filter
    if (showMySuggestions && authUser?.data?.user?._id) {
      result = result.filter(suggestion => suggestion.user === authUser.data.user._id);
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(suggestion => suggestion.category === selectedCategory);
    }

    // Time filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    if (timeFilter === "today") {
      result = result.filter(suggestion => new Date(suggestion.createdAt) >= today);
    } else if (timeFilter === "week") {
      result = result.filter(suggestion => new Date(suggestion.createdAt) >= weekAgo);
    } else if (timeFilter === "month") {
      result = result.filter(suggestion => new Date(suggestion.createdAt) >= monthAgo);
    }

    // Sort order
    if (sortOrder === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOrder === "mostLiked") {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortOrder === "leastLiked") {
      result.sort((a, b) => (a.likes || 0) - (b.likes || 0));
    }

    setFilteredSuggestions(result);
  };

  // Handle like toggle
  const handleLike = async (id) => {
    if (!authUser) {
      toast.error("You need to be logged in to like suggestions", {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
        icon: '❗',
      });
      return;
    }

    try {
      await likeSuggestion(id);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  // Toggle description expansion
  const toggleDescription = (id) => {
    setExpandedDescription(expandedDescription === id ? null : id);
  };

  // Check if the current user has liked a suggestion
  const hasUserLiked = (suggestion) => {
    if (!authUser?.data?.user?._id || !suggestion?.likedBy) return false;
    return suggestion.likedBy.includes(authUser.data.user._id);
  };

  // Filter toggle button
  const toggleFilters = () => setShowFilters(!showFilters);
  
  // Custom dropdown toggle
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSortOrder("newest");
    setTimeFilter("all");
    setShowMySuggestions(false);
    setSearchQuery("");
  };
  
  // Format date to relative time
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    // Default to formatted date for older content
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render empty state
  if (!safeSuggestions || safeSuggestions.length === 0) {
    return (
      <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#1E1F21] to-[#31333A] border border-[#FFF6E0]/5">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#31333A]/70 mb-6">
            <MessageSquare size={28} className="text-[#D8D9DA]" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No Suggestions Yet</h3>
          <p className="text-[#D8D9DA] mb-8 max-w-md mx-auto">
            Be the first to suggest an idea and help shape the future of our platform!
          </p>
          <button 
            onClick={() => window.location.href = "#write"}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-6 py-3 rounded-full font-medium transition-all"
          >
            <Sparkles size={16} />
            <span>Share Your Idea</span>
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Search and filter bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-[#61677A]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search suggestions..."
              className="w-full bg-[#1E1F21] border border-[#31333A] rounded-lg pl-10 pr-4 py-3 text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#61677A] hover:text-[#FFF6E0]"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex gap-3">
            <button 
              onClick={toggleFilters}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                showFilters 
                  ? "bg-[#FFF6E0] text-[#272829]"
                  : "bg-[#1E1F21] text-[#D8D9DA] border border-[#31333A] hover:bg-[#31333A]/30"
              }`}
            >
              <SlidersHorizontal size={18} />
              <span className="font-medium">{showFilters ? "Hide Filters" : "Filters"}</span>
            </button>
            
            <button 
              onClick={() => setShowMySuggestions(!showMySuggestions)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                showMySuggestions 
                  ? "bg-[#FFF6E0] text-[#272829]"
                  : "bg-[#1E1F21] text-[#D8D9DA] border border-[#31333A] hover:bg-[#31333A]/30"
              }`}
              disabled={!authUser}
            >
              <User size={18} />
              <span className="font-medium">My Ideas</span>
            </button>
          </div>
        </div>
        
        {/* Expanded filters */}
        {showFilters && (
          <div className="bg-[#1E1F21] rounded-xl border border-[#31333A] p-4 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#D8D9DA] flex items-center gap-1.5">
                  <Tag size={14} />
                  Category
                </label>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('category')}
                    className="w-full flex items-center justify-between bg-[#272829] text-[#D8D9DA] rounded-lg p-2.5 border border-[#31333A] hover:border-[#61677A] focus:outline-none transition"
                  >
                    <span>{selectedCategory === "all" ? "All Categories" : selectedCategory}</span>
                    <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === 'category' && (
                    <div className="absolute z-10 mt-1 w-full bg-[#272829] border border-[#31333A] rounded-lg shadow-xl py-1 max-h-56 overflow-auto">
                      {getCategories().map(category => (
                        <button
                          key={category}
                          className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${selectedCategory === category ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                          onClick={() => {
                            setSelectedCategory(category);
                            setActiveDropdown(null);
                          }}
                        >
                          {category === "all" ? "All Categories" : category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sort Order */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#D8D9DA] flex items-center gap-1.5">
                  <ArrowUpDown size={14} />
                  Sort By
                </label>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('sort')}
                    className="w-full flex items-center justify-between bg-[#272829] text-[#D8D9DA] rounded-lg p-2.5 border border-[#31333A] hover:border-[#61677A] focus:outline-none transition"
                  >
                    <span>
                      {sortOrder === "newest" ? "Newest First" : 
                       sortOrder === "oldest" ? "Oldest First" : 
                       sortOrder === "mostLiked" ? "Most Liked" : "Least Liked"}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === 'sort' && (
                    <div className="absolute z-10 mt-1 w-full bg-[#272829] border border-[#31333A] rounded-lg shadow-xl py-1">
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${sortOrder === "newest" ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                        onClick={() => {
                          setSortOrder("newest");
                          setActiveDropdown(null);
                        }}
                      >
                        Newest First
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${sortOrder === "oldest" ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                        onClick={() => {
                          setSortOrder("oldest");
                          setActiveDropdown(null);
                        }}
                      >
                        Oldest First
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${sortOrder === "mostLiked" ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                        onClick={() => {
                          setSortOrder("mostLiked");
                          setActiveDropdown(null);
                        }}
                      >
                        Most Liked
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${sortOrder === "leastLiked" ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                        onClick={() => {
                          setSortOrder("leastLiked");
                          setActiveDropdown(null);
                        }}
                      >
                        Least Liked
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Time Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#D8D9DA] flex items-center gap-1.5">
                  <Clock size={14} />
                  Time Period
                </label>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('time')}
                    className="w-full flex items-center justify-between bg-[#272829] text-[#D8D9DA] rounded-lg p-2.5 border border-[#31333A] hover:border-[#61677A] focus:outline-none transition"
                  >
                    <span>
                      {timeFilter === "all" ? "All Time" : 
                       timeFilter === "today" ? "Today" : 
                       timeFilter === "week" ? "This Week" : "This Month"}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'time' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === 'time' && (
                    <div className="absolute z-10 mt-1 w-full bg-[#272829] border border-[#31333A] rounded-lg shadow-xl py-1">
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${timeFilter === "all" ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                        onClick={() => {
                          setTimeFilter("all");
                          setActiveDropdown(null);
                        }}
                      >
                        All Time
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${timeFilter === "today" ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                        onClick={() => {
                          setTimeFilter("today");
                          setActiveDropdown(null);
                        }}
                      >
                        Today
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${timeFilter === "week" ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                        onClick={() => {
                          setTimeFilter("week");
                          setActiveDropdown(null);
                        }}
                      >
                        This Week
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${timeFilter === "month" ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                        onClick={() => {
                          setTimeFilter("month");
                          setActiveDropdown(null);
                        }}
                      >
                        This Month
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Active filters display */}
            {(selectedCategory !== "all" || timeFilter !== "all" || sortOrder !== "newest" || showMySuggestions || searchQuery) && (
              <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-[#31333A]">
                <span className="text-sm text-[#61677A] self-center mr-1">Active filters:</span>
                
                {searchQuery && (
                  <div className="inline-flex items-center gap-1.5 bg-[#31333A]/70 text-[#D8D9DA] px-3 py-1.5 rounded-full text-sm">
                    <Search size={12} />
                    <span>"{searchQuery}"</span>
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-[#FFF6E0]">
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {selectedCategory !== "all" && (
                  <div className="inline-flex items-center gap-1.5 bg-[#31333A]/70 text-[#D8D9DA] px-3 py-1.5 rounded-full text-sm">
                    <Tag size={12} />
                    <span>{selectedCategory}</span>
                    <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-[#FFF6E0]">
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {timeFilter !== "all" && (
                  <div className="inline-flex items-center gap-1.5 bg-[#31333A]/70 text-[#D8D9DA] px-3 py-1.5 rounded-full text-sm">
                    <Clock size={12} />
                    <span>
                      {timeFilter === "today" ? "Today" : timeFilter === "week" ? "This Week" : "This Month"}
                    </span>
                    <button onClick={() => setTimeFilter("all")} className="ml-1 hover:text-[#FFF6E0]">
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {sortOrder !== "newest" && (
                  <div className="inline-flex items-center gap-1.5 bg-[#31333A]/70 text-[#D8D9DA] px-3 py-1.5 rounded-full text-sm">
                    <ArrowUpDown size={12} />
                    <span>
                      {sortOrder === "oldest" ? "Oldest First" : 
                      sortOrder === "mostLiked" ? "Most Liked" : "Least Liked"}
                    </span>
                    <button onClick={() => setSortOrder("newest")} className="ml-1 hover:text-[#FFF6E0]">
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {showMySuggestions && (
                  <div className="inline-flex items-center gap-1.5 bg-[#31333A]/70 text-[#D8D9DA] px-3 py-1.5 rounded-full text-sm">
                    <User size={12} />
                    <span>My Suggestions</span>
                    <button onClick={() => setShowMySuggestions(false)} className="ml-1 hover:text-[#FFF6E0]">
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={resetFilters}
                  className="text-[#D8D9DA] hover:text-[#FFF6E0] text-sm underline ml-auto"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suggestion count */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="relative">
            <MessageSquare size={20} className="text-[#FFF6E0]" />
            <span className="absolute -top-1 -right-1 bg-[#FFF6E0] text-[#272829] text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {filteredSuggestions.length}
            </span>
          </span>
          <span>Community Suggestions</span>
        </h2>
        <span className="text-sm text-[#61677A]">
          {filteredSuggestions.length} {filteredSuggestions.length === 1 ? "idea" : "ideas"} found
        </span>
      </div>

      {/* Suggestions list with masonry-like grid */}
      {filteredSuggestions.length === 0 ? (
        <div className="bg-gradient-to-br from-[#1E1F21] to-[#31333A] p-8 rounded-xl text-center shadow-md border border-[#31333A]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#31333A]/70 mb-6">
            <Search size={24} className="text-[#D8D9DA]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Matching Suggestions</h3>
          <p className="text-[#D8D9DA] mb-6">We couldn't find any suggestions matching your filters.</p>
          <button 
            onClick={resetFilters}
            className="inline-flex items-center gap-2 bg-[#31333A] hover:bg-[#31333A]/80 text-[#FFF6E0] px-4 py-2 rounded-lg transition-colors"
          >
            <X size={16} />
            <span>Clear Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSuggestions.map((suggestion) => {
            const userLiked = hasUserLiked(suggestion);
            const isExpanded = expandedDescription === suggestion._id;

            return (
              <div
                key={suggestion._id}
                className="bg-gradient-to-br from-[#1E1F21] to-[#31333A] rounded-xl overflow-hidden shadow-md border border-[#31333A] hover:border-[#61677A] transition-all group"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Vote column with animated effect */}
                    <div className="flex flex-col items-center pt-1">
                      <button
                        onClick={() => handleLike(suggestion._id)}
                        className={`p-2 rounded-lg transition-all ${
                          userLiked
                            ? "bg-gradient-to-br from-pink-500/20 to-red-500/20 text-red-400"
                            : "text-[#D8D9DA] hover:bg-[#31333A]"
                        }`}
                        aria-label={userLiked ? "Unlike" : "Like"}
                      >
                        <Heart 
                          size={20} 
                          fill={userLiked ? "currentColor" : "none"} 
                          className={userLiked ? "animate-pulse" : ""}
                          strokeWidth={2}
                        />
                      </button>
                      <span className="mt-1 font-medium text-[#FFF6E0]">
                        {suggestion.likes || 0}
                      </span>
                    </div>

                    {/* Content column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#31333A]/80 text-[#FFF6E0] backdrop-blur-sm">
                            <Tag size={10} strokeWidth={2.5} />
                            {suggestion.category}
                          </span>
                          
                          {/* Creator info - conditionally show if it exists */}
                          {suggestion.user?.username && (
                            <span className="inline-flex items-center gap-1 text-xs text-[#61677A]">
                              <User size={10} strokeWidth={2} />
                              <span>{suggestion.user.username}</span>
                            </span>
                          )}
                        </div>
                        
                        <span className="text-xs text-[#61677A] flex items-center">
                          <Calendar size={10} className="mr-1" />
                          {formatRelativeDate(suggestion.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 text-[#FFF6E0] leading-tight">
                        {suggestion.title}
                      </h3>

                      <div className="relative">
                        <p className={`text-[#D8D9DA] text-sm leading-relaxed ${
                          isExpanded ? '' : 'line-clamp-2'
                        }`}>
                          {suggestion.description}
                        </p>
                        
                        {suggestion.description.length > 120 && (
                          <button
                            onClick={() => toggleDescription(suggestion._id)}
                            className="text-xs text-[#FFF6E0]/70 hover:text-[#FFF6E0] mt-1 flex items-center gap-1 font-medium"
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                            <ChevronDown 
                              size={14} 
                              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom action bar with gradient */}
                <div className="bg-gradient-to-r from-[#272829]/50 to-[#31333A]/50 px-5 py-3 flex justify-between items-center">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleLike(suggestion._id)}
                      className="text-xs text-[#D8D9DA] hover:text-[#FFF6E0] flex items-center gap-1.5 transition-colors"
                    >
                      <Heart size={14} fill={userLiked ? "currentColor" : "none"} />
                      <span>{userLiked ? 'Liked' : 'Like'}</span>
                    </button>
                    
                  </div>
                  
                  <div className="text-xs text-[#61677A]">
                    ID: {suggestion._id.substring(0, 8)}...
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LandingViewSuggestions;