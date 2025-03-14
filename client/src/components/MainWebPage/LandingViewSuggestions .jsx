import React, { useEffect, useState } from "react";
import { Heart, User, Calendar, Filter, ArrowUpDown, Clock, ChevronDown, X, Tag } from "lucide-react";
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

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [suggestions, selectedCategory, sortOrder, timeFilter, showMySuggestions]);

  const safeSuggestions = Array.isArray(suggestions) ? suggestions : Object.values(suggestions || {});

  // Get unique categories from suggestions
  const getCategories = () => {
    const categories = new Set(safeSuggestions.map(suggestion => suggestion.category));
    return ["all", ...Array.from(categories)];
  };

  // Apply all filters and sorting
  const applyFilters = () => {
    let result = [...safeSuggestions];

    // My suggestions filter
    if (showMySuggestions && authUser?.data?.user?._id) {
      result = result.filter(suggestion => suggestion.user=== authUser.data.user._id);
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
      toast.error("You need to be logged in to like");
      return;
    }

    try {
      await likeSuggestion(id);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
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
  };

  if (!safeSuggestions || safeSuggestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <div className="bg-gradient-to-br from-[#1E1F21] to-[#31333A] p-6 rounded-xl shadow-lg">
          <div className="text-[#FFF6E0] text-lg font-semibold mb-2">No Suggestions Found</div>
          <p className="text-[#D8D9DA]">Be the first to add a suggestion!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Filter Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleFilters}
              className="flex items-center gap-2 text-[#FFF6E0] bg-gradient-to-r from-[#31333A] to-[#272829] hover:from-[#31333A] hover:to-[#31333A] px-4 py-2 rounded-lg transition shadow-md"
            >
              <Filter size={16} />
              <span className="font-medium">{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
            
            <button 
              onClick={() => setShowMySuggestions(!showMySuggestions)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition shadow-md ${
                showMySuggestions 
                  ? "bg-[#FFF6E0] text-[#272829]" 
                  : "bg-gradient-to-r from-[#31333A] to-[#272829] text-[#FFF6E0] hover:from-[#31333A] hover:to-[#31333A]"
              }`}
            >
              <User size={16} />
              <span className="font-medium">My Suggestions</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-[#FFF6E0]">
            <span className="text-sm text-[#61677A]">
              {filteredSuggestions.length} {filteredSuggestions.length === 1 ? "suggestion" : "suggestions"}
            </span>
            
            {(selectedCategory !== "all" || timeFilter !== "all" || sortOrder !== "newest" || showMySuggestions) && (
              <button 
                onClick={resetFilters}
                className="flex items-center gap-1 text-sm text-[#D8D9DA] hover:text-[#FFF6E0] ml-2"
              >
                <X size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 bg-gradient-to-br from-[#1E1F21] to-[#31333A] p-4 rounded-xl shadow-lg border border-[#31333A]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter - Custom Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#D8D9DA] mb-2">
                  <span className="flex items-center gap-1">
                    <Tag size={14} />
                    Category
                  </span>
                </label>
                <button
                  onClick={() => toggleDropdown('category')}
                  className="w-full flex items-center justify-between bg-[#272829] text-[#D8D9DA] rounded-lg p-2 border border-[#31333A] hover:border-[#61677A] focus:outline-none transition"
                >
                  <span>{selectedCategory === "all" ? "All Categories" : selectedCategory}</span>
                  <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'category' && (
                  <div className="absolute z-10 mt-1 w-full bg-[#272829] border border-[#31333A] rounded-lg shadow-lg py-1 max-h-56 overflow-auto">
                    {getCategories().map(category => (
                      <button
                        key={category}
                        className={`w-full text-left px-4 py-2 hover:bg-[#31333A] ${selectedCategory === category ? 'bg-[#31333A] text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
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
              
              {/* Sort Order - Custom Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#D8D9DA] mb-2">
                  <span className="flex items-center gap-1">
                    <ArrowUpDown size={14} />
                    Sort By
                  </span>
                </label>
                <button
                  onClick={() => toggleDropdown('sort')}
                  className="w-full flex items-center justify-between bg-[#272829] text-[#D8D9DA] rounded-lg p-2 border border-[#31333A] hover:border-[#61677A] focus:outline-none transition"
                >
                  <span>
                    {sortOrder === "newest" ? "Newest First" : 
                     sortOrder === "oldest" ? "Oldest First" : 
                     sortOrder === "mostLiked" ? "Most Liked" : "Least Liked"}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'sort' && (
                  <div className="absolute z-10 mt-1 w-full bg-[#272829] border border-[#31333A] rounded-lg shadow-lg py-1">
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-[#31333A] ${sortOrder === "newest" ? 'bg-[#31333A] text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                      onClick={() => {
                        setSortOrder("newest");
                        setActiveDropdown(null);
                      }}
                    >
                      Newest First
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-[#31333A] ${sortOrder === "oldest" ? 'bg-[#31333A] text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                      onClick={() => {
                        setSortOrder("oldest");
                        setActiveDropdown(null);
                      }}
                    >
                      Oldest First
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-[#31333A] ${sortOrder === "mostLiked" ? 'bg-[#31333A] text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                      onClick={() => {
                        setSortOrder("mostLiked");
                        setActiveDropdown(null);
                      }}
                    >
                      Most Liked
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-[#31333A] ${sortOrder === "leastLiked" ? 'bg-[#31333A] text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
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
              
              {/* Time Filter - Custom Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#D8D9DA] mb-2">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    Time Period
                  </span>
                </label>
                <button
                  onClick={() => toggleDropdown('time')}
                  className="w-full flex items-center justify-between bg-[#272829] text-[#D8D9DA] rounded-lg p-2 border border-[#31333A] hover:border-[#61677A] focus:outline-none transition"
                >
                  <span>
                    {timeFilter === "all" ? "All Time" : 
                     timeFilter === "today" ? "Today" : 
                     timeFilter === "week" ? "This Week" : "This Month"}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'time' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'time' && (
                  <div className="absolute z-10 mt-1 w-full bg-[#272829] border border-[#31333A] rounded-lg shadow-lg py-1">
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-[#31333A] ${timeFilter === "all" ? 'bg-[#31333A] text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                      onClick={() => {
                        setTimeFilter("all");
                        setActiveDropdown(null);
                      }}
                    >
                      All Time
                    </button>
                    
                    <button
    className={`w-full text-left px-4 py-2 hover:bg-[#31333A] ${timeFilter === "today" ? 'bg-[#31333A] text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
    onClick={() => {
      setTimeFilter("today");
      setActiveDropdown(null);
    }}
  >
    Today
  </button>
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-[#31333A] ${timeFilter === "week" ? 'bg-[#31333A] text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                      onClick={() => {
                        setTimeFilter("week");
                        setActiveDropdown(null);
                      }}
                    >
                      This Week
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-[#31333A] ${timeFilter === "month" ? 'bg-[#31333A] text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
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
            
            {/* Active Filters Display */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory !== "all" && (
                <div className="bg-[#31333A] text-[#D8D9DA] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <span>Category: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-[#FFF6E0]">
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {timeFilter !== "all" && (
                <div className="bg-[#31333A] text-[#D8D9DA] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <span>
                    Time: {timeFilter === "today" ? "Today" : timeFilter === "week" ? "This Week" : "This Month"}
                  </span>
                  <button onClick={() => setTimeFilter("all")} className="ml-1 hover:text-[#FFF6E0]">
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {sortOrder !== "newest" && (
                <div className="bg-[#31333A] text-[#D8D9DA] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <span>
                    Sort: {
                      sortOrder === "oldest" ? "Oldest First" : 
                      sortOrder === "mostLiked" ? "Most Liked" : "Least Liked"
                    }
                  </span>
                  <button onClick={() => setSortOrder("newest")} className="ml-1 hover:text-[#FFF6E0]">
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {showMySuggestions && (
                <div className="bg-[#31333A] text-[#D8D9DA] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <span>My Suggestions</span>
                  <button onClick={() => setShowMySuggestions(false)} className="ml-1 hover:text-[#FFF6E0]">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <div className="bg-gradient-to-br from-[#1E1F21] to-[#31333A] p-6 rounded-xl text-center shadow-md border border-[#31333A]">
            <div className="text-[#FFF6E0] font-semibold mb-2">No Matching Suggestions</div>
            <p className="text-[#D8D9DA] text-sm">Try changing your filters</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => {
            const userLiked = hasUserLiked(suggestion);

            return (
              <div
                key={suggestion._id}
                className="bg-gradient-to-br from-[#1E1F21] to-[#31333A] p-4 rounded-lg shadow-md border border-[#31333A] hover:border-[#61677A] transition-all"
              >
                <div className="flex gap-4">
                  {/* Vote column */}
                  <div className="flex flex-col items-center justify-center">
                    <button
                      onClick={() => handleLike(suggestion._id)}
                      className={`p-2 rounded-full transition ${
                        userLiked
                          ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                          : "text-[#D8D9DA] hover:bg-[#31333A]"
                      }`}
                    >
                      <Heart 
                        size={20} 
                        fill={userLiked ? "currentColor" : "none"} 
                        strokeWidth={2}
                      />
                    </button>
                    <span className="mt-1 font-medium text-[#FFF6E0]">
                      {suggestion.likes || 0}
                    </span>
                  </div>

                  {/* Content column */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#31333A] text-[#FFF6E0]">
                        {suggestion.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-1 text-[#FFF6E0]">
                      {suggestion.title}
                    </h3>

                    <p className="text-[#D8D9DA] text-sm leading-relaxed line-clamp-2">{suggestion.description}</p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-[#61677A]">
                      <div className="flex items-center">
                        <User size={12} className="mr-1" />
                        <span>{suggestion.user?.username || "User"}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        <span>
                          {new Date(suggestion.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LandingViewSuggestions;