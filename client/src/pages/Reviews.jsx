import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore.js';
import { Star, Filter, Search, Calendar, ThumbsUp, CheckCircle, Edit2, Award, MessageSquare, BarChart2, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import ReviewForm from '../components/ReviewForm';
import ReviewItem from '../components/ReviewItem';
import UserReviews from '../components/UserReviews';

const Reviews = () => {
  const { 
    authUser, 
    reviews, 
    fetchReviews, 
    isLoadingReviews,
    fetchReviewStats,
    reviewStats,
    isLoadingReviewStats
  } = useAuthStore();
  
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [starFilter, setStarFilter] = useState(0); // 0 means no filter
  const [totalStats, setTotalStats] = useState({
    likes: 0,
    helpful: 0
  });
  const [allReviews, setAllReviews] = useState([]); // Store all reviews for filtering
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStars, setFilterStars] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Initial load of reviews and stats
  const loadReviews = async (page = 1, replace = true) => {
    if (page === 1) {
      setLoadingReviews(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      setError(null);
      
      // Fetch review stats (only once on initial load)
      if (page === 1 && !reviewStats) {
        fetchReviewStats();
      }
      
      // Fetch paginated reviews with filters
      const response = await fetchReviews(page, 5, filterStars, sortOption, searchQuery);
      
      if (response) {
        setPagination(response.pagination);
        setHasMore(page < response.pagination.pages);
        
        // Update displayed reviews
        if (replace) {
          setDisplayedReviews(response.data);
          setCurrentPage(1);
        } else {
          setDisplayedReviews(prev => [...prev, ...response.data]);
          setCurrentPage(page);
        }
        
        // Store all reviews for local filtering
        if (page === 1) {
          setAllReviews(response.data);
        } else {
          setAllReviews(prev => [...prev, ...response.data]);
        }
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoadingReviews(false);
      setIsLoadingMore(false);
    }
  };

  // Load reviews on mount
  useEffect(() => {
    loadReviews(1, true);
  }, [filterStars, sortOption, searchQuery]);

  // Handle loading more reviews
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadReviews(currentPage + 1, false);
    }
  };

  const handleReviewSubmitted = () => {
    loadReviews(1, true); // Refresh the reviews list
    fetchReviewStats(); // Refresh stats when a new review is submitted
    setActiveTab('all'); // Switch to all reviews tab after submitting
  };

  const handleStarFilter = (stars) => {
    // Clear existing reviews and load with new filter
    setFilterStars(stars === filterStars ? null : stars);
  };

  const getRatingDistribution = () => {
    if (reviewStats && reviewStats.ratingDistribution) {
      return reviewStats.ratingDistribution;
    }
    return [0, 0, 0, 0, 0]; // Default empty distribution
  };

  const getAverageRating = () => {
    if (reviewStats && reviewStats.averageRating) {
      return reviewStats.averageRating;
    }
    return '0.0';
  };

  const getTotalReviews = () => {
    if (reviewStats && reviewStats.totalReviews) {
      return reviewStats.totalReviews;
    }
    return 0;
  };

  const getTotalLikes = () => {
    if (reviewStats && reviewStats.totalLikes) {
      return reviewStats.totalLikes;
    }
    return 0;
  };

  const getTotalHelpful = () => {
    if (reviewStats && reviewStats.totalHelpful) {
      return reviewStats.totalHelpful;
    }
    return 0;
  };

  const ratingDistribution = getRatingDistribution();
  
  const handleReviewAdded = () => {
    loadReviews(1, true);
    fetchReviewStats(); // Refresh stats when a new review is added
    setActiveTab('all');
  };

  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0]">
      {/* Circular animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 right-20 w-[30vw] h-[30vw] rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-[120px] animate-pulse" style={{animationDuration: '15s'}}></div>
        <div className="absolute -bottom-20 -left-20 w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-pink-500/5 to-blue-500/5 blur-[150px] animate-pulse" style={{animationDuration: '20s'}}></div>
      </div>
      
      {/* Add the style tag for shimmer effect */}
      <style jsx="true">{`
        .shimmer-effect {
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
      
      {/* Page content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header section */}
        <div className="mb-10">
          <div className="mb-2 text-sm uppercase tracking-wider text-[#FFF6E0]/60">Community Insights</div>
          <h1 className="text-5xl font-bold mb-3 flex items-center">
            <span className="mr-3">User Reviews</span> 
            <span className="text-lg px-3 py-1 rounded-full bg-[#31333A] text-[#FFF6E0]/80 flex items-center gap-1.5">
              <MessageSquare size={16} className="text-yellow-400" />
              {reviewStats ? reviewStats.totalReviews : pagination.total} Reviews
            </span>
          </h1>
          <p className="text-[#D8D9DA] max-w-2xl">
            Discover authentic experiences from our community members and share your own feedback to help others.
          </p>
        </div>
        
        {/* Tabs + Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          {/* Tabs */}
          {authUser && (
            <div className="flex items-center bg-[#31333A] rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'all'
                    ? 'bg-[#FFF6E0] text-[#272829]'
                    : 'text-[#D8D9DA] hover:bg-[#FFF6E0]/10'
                }`}
              >
                All Reviews
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'my'
                    ? 'bg-[#FFF6E0] text-[#272829]'
                    : 'text-[#D8D9DA] hover:bg-[#FFF6E0]/10'
                }`}
              >
                My Reviews
              </button>
            </div>
          )}
          
          {/* Search + Filter */}
          {activeTab === 'all' && (
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#61677A]" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reviews..."
                  className="pl-10 pr-4 py-2 bg-[#31333A] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#FFF6E0]/30 w-full md:w-64 text-[#FFF6E0]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#61677A] hover:text-[#FFF6E0]"
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    showFilters || sortBy !== 'recent' || starFilter > 0
                      ? 'bg-[#FFF6E0] text-[#272829]'
                      : 'bg-[#31333A] text-[#D8D9DA]'
                  }`}
                >
                  <Filter size={16} />
                  <span>Sort & Filter</span>
                  {(sortBy !== 'recent' || starFilter > 0) && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#31333A] text-[#FFF6E0] text-xs">
                      {(sortBy !== 'recent' ? 1 : 0) + (starFilter > 0 ? 1 : 0)}
                    </span>
                  )}
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 mt-2 bg-[#31333A] rounded-lg shadow-xl min-w-[250px] z-20 overflow-hidden">
                    <div className="p-3 border-b border-[#FFF6E0]/10">
                      <div className="text-sm font-medium mb-3">Sort by</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => {setSortOption('newest');}}
                          className={`text-left px-3 py-2 rounded text-sm ${sortOption === 'newest' ? 'bg-[#FFF6E0] text-[#272829]' : 'hover:bg-[#FFF6E0]/10'}`}
                        >
                          Most Recent
                        </button>
                        <button 
                          onClick={() => {setSortOption('oldest');}}
                          className={`text-left px-3 py-2 rounded text-sm ${sortOption === 'oldest' ? 'bg-[#FFF6E0] text-[#272829]' : 'hover:bg-[#FFF6E0]/10'}`}
                        >
                          Oldest First
                        </button>
                        <button 
                          onClick={() => {setSortOption('highest');}}
                          className={`text-left px-3 py-2 rounded text-sm ${sortOption === 'highest' ? 'bg-[#FFF6E0] text-[#272829]' : 'hover:bg-[#FFF6E0]/10'}`}
                        >
                          Highest Rated
                        </button>
                        <button 
                          onClick={() => {setSortOption('lowest');}}
                          className={`text-left px-3 py-2 rounded text-sm ${sortOption === 'lowest' ? 'bg-[#FFF6E0] text-[#272829]' : 'hover:bg-[#FFF6E0]/10'}`}
                        >
                          Lowest Rated
                        </button>
                        <button 
                          onClick={() => {setSortOption('mostLiked');}}
                          className={`text-left px-3 py-2 rounded text-sm ${sortOption === 'mostLiked' ? 'bg-[#FFF6E0] text-[#272829]' : 'hover:bg-[#FFF6E0]/10'}`}
                        >
                          Most Liked
                        </button>
                        <button 
                          onClick={() => {setSortOption('mostHelpful');}}
                          className={`text-left px-3 py-2 rounded text-sm ${sortOption === 'mostHelpful' ? 'bg-[#FFF6E0] text-[#272829]' : 'hover:bg-[#FFF6E0]/10'}`}
                        >
                          Most Helpful
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="text-sm font-medium mb-3">Filter by stars</div>
                      <div className="flex flex-wrap gap-2">
                        {[5, 4, 3, 2, 1].map(stars => (
                          <button
                            key={stars}
                            onClick={() => handleStarFilter(stars)}
                            className={`flex items-center px-3 py-1.5 rounded text-sm ${
                              filterStars === stars 
                                ? 'bg-[#FFF6E0] text-[#272829]' 
                                : 'bg-[#272829] hover:bg-[#FFF6E0]/10'
                            }`}
                          >
                            <span className="mr-1">{stars}</span>
                            <Star size={14} fill={filterStars === stars ? "#272829" : "#FFC107"} className="text-yellow-400" />
                          </button>
                        ))}
                      </div>
                      
                      {(filterStars || sortOption !== 'newest') && (
                        <button
                          onClick={() => {setFilterStars(null); setSortOption('newest');}}
                          className="w-full mt-3 py-2 text-sm text-center bg-[#272829] hover:bg-[#FFF6E0]/10 rounded"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {activeTab === 'all' ? (
          <>
            {/* Rating summary card - only shown in "all" tab */}
            {(!isLoadingReviewStats && reviewStats) && (
              <div className="bg-[#31333A] rounded-2xl overflow-hidden mb-12 relative">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-80"></div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-blue-500/10 blur-[80px]"></div>
                
                <div className="relative z-10 p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Total rating */}
                    <div className="flex flex-col items-center md:items-start">
                      <div className="text-sm text-[#D8D9DA]/70 mb-1">Overall Rating</div>
                      <div className="flex items-baseline">
                        <span className="text-6xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                          {getAverageRating()}
                        </span>
                        <span className="text-xl ml-1 text-[#D8D9DA]/80">/5</span>
                      </div>
                      
                      <div className="flex mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            size={22}
                            fill={star <= Math.round(getAverageRating()) ? "#FFC107" : "none"}
                            className={`${
                              star <= Math.round(getAverageRating())
                                ? 'text-yellow-400'
                                : 'text-gray-600'
                            }`} 
                          />
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="flex items-center text-sm px-3 py-1 rounded-full bg-[#272829]/50">
                          <MessageSquare size={14} className="mr-1.5 text-[#D8D9DA]/70" />
                          <span>{getTotalReviews()} {getTotalReviews() === 1 ? 'review' : 'reviews'}</span>
                        </div>
                        <div className="flex items-center text-sm px-3 py-1 rounded-full bg-[#272829]/50">
                          <ThumbsUp size={14} className="mr-1.5 text-blue-400" />
                          <span>{getTotalLikes()} likes</span>
                        </div>
                        <div className="flex items-center text-sm px-3 py-1 rounded-full bg-[#272829]/50">
                          <CheckCircle size={14} className="mr-1.5 text-green-400" />
                          <span>{getTotalHelpful()} helpful</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rating distribution */}
                    <div className="md:col-span-2">
                      <div className="text-sm text-[#D8D9DA]/70 mb-3 flex items-center">
                        <BarChart2 size={16} className="mr-1.5" />
                        <span>Rating Distribution</span>
                      </div>
                      
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center mb-3">
                          <button 
                            onClick={() => handleStarFilter(star)}
                            className={`flex items-center w-16 mr-3 ${
                              filterStars === star ? 'text-yellow-400' : 'text-[#D8D9DA]'
                            }`}
                          >
                            <span className="text-sm font-medium mr-1">{star}</span>
                            <Star size={14} fill={filterStars === star ? "#FFF6E0" : "#FFC107"} className="text-yellow-400" />
                          </button>
                          
                          <div className="flex-1 h-4 bg-[#272829] rounded-full overflow-hidden border border-[#393B40] relative">
                            <div 
                              className={`h-full rounded-full flex items-center relative overflow-hidden ${
                                star === 5 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                star === 4 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                star === 3 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                                star === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                                'bg-gradient-to-r from-red-400 to-red-500'
                              }`}
                              style={{ 
                                width: `${getTotalReviews() > 0 ? (ratingDistribution[star - 1] / getTotalReviews()) * 100 : 0}%` 
                              }}
                            >
                              {/* Shimmer effect */}
                              <div className="absolute inset-0 w-full h-full shimmer-effect"></div>
                              
                              {getTotalReviews() > 0 && (ratingDistribution[star - 1] / getTotalReviews()) * 100  && (
                                <span className="text-xs text-white font-medium ml-3 drop-shadow-md relative z-10">
                                  {Math.round((ratingDistribution[star - 1] / getTotalReviews()) * 100)}%
                                </span>
                              )}
                            </div>
                            
                            {/* Zero percentage indicator */}
                            {getTotalReviews() > 0 && (ratingDistribution[star - 1] === 0) && (
                              <div className="absolute inset-0 flex items-center pl-3">
                                <span className="text-xs text-[#61677A]">0%</span>
                              </div>
                            )}
                          </div>
                          
                          <span className="ml-3 min-w-[40px] text-center text-sm font-medium">
                            {ratingDistribution[star - 1]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading state for stats */}
            {isLoadingReviewStats && !reviewStats && (
              <div className="bg-[#31333A] rounded-2xl overflow-hidden mb-12 relative p-16">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-[3px] border-[#FFF6E0]/20 border-t-[#FFF6E0] animate-spin mb-4"></div>
                  <p className="text-[#D8D9DA]">Loading review statistics...</p>
                </div>
              </div>
            )}
            
            {/* Search and filter toolbar */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D8D9DA]/70" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#31333A] border-none pl-10 pr-4 py-2.5 rounded-lg text-[#FFF6E0] placeholder-[#D8D9DA]/50 focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20"
                />
              </div>
              
              <div className="flex gap-2">
                {/* Sort dropdown only - removed star filter dropdown */}
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none bg-[#31333A] px-9 py-2.5 rounded-lg text-[#D8D9DA] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20 pr-8"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    <option value="mostLiked">Most Liked</option>
                    <option value="mostHelpful">Most Helpful</option>
                  </select>
                  <ArrowUpDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D8D9DA]/70" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#D8D9DA]">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Star filters - moved outside */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-[#D8D9DA]">Filter by:</span>
              <button
                onClick={() => setFilterStars(null)}
                className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${filterStars === null 
                    ? 'bg-[#FFF6E0] text-[#272829]' 
                    : 'bg-[#31333A] text-[#D8D9DA] hover:bg-[#31333A]/80'
                  }`}
              >
                All Stars
              </button>
              
              {[5, 4, 3, 2, 1].map(stars => (
                <button
                  key={stars}
                  onClick={() => setFilterStars(stars === filterStars ? null : stars)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filterStars === stars 
                      ? 'bg-[#FFF6E0] text-[#272829]' 
                      : 'bg-[#31333A] text-[#D8D9DA] hover:bg-[#31333A]/80'
                  }`}
                >
                  <span>{stars}</span>
                  <Star size={14} fill={filterStars === stars ? "#272829" : "#FFC107"} className={filterStars === stars ? 'text-[#272829]' : 'text-yellow-400'} />
                  <span className="text-xs ml-1">{reviewStats ? ratingDistribution[stars-1] : 0}</span>
                </button>
              ))}
            </div>
            
            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Review Form */}
              <div className="md:col-span-4">
                <div className="sticky top-4">
                  <ReviewForm onReviewAdded={handleReviewAdded} />
                </div>
              </div>
              
              {/* Reviews List */}
              <div className="md:col-span-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center text-[#FFF6E0]">
                    <span>Community Reviews</span>
                    
                    {filterStars && (
                      <span className="ml-2 flex items-center text-sm px-2 py-0.5 rounded-full bg-[#FFF6E0]/10">
                        {filterStars} <Star size={12} fill="#FFC107" className="text-yellow-400 ml-0.5" />
                        <button 
                          className="ml-1 hover:text-red-400" 
                          onClick={() => setFilterStars(null)}
                        >×</button>
                      </span>
                    )}
                  </h3>
                  
                  {sortOption !== 'newest' && (
                    <div className="text-sm text-[#D8D9DA]/80 flex items-center">
                      <span>Sorted by:</span>
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-[#FFF6E0]/10">
                        {sortOption === 'newest' ? 'Newest First' : 
                         sortOption === 'oldest' ? 'Oldest First' : 
                         sortOption === 'highest' ? 'Highest Rated' : 
                         sortOption === 'lowest' ? 'Lowest Rated' : 
                         sortOption === 'mostLiked' ? 'Most Liked' : 'Most Helpful'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Loading state */}
                {loadingReviews ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-[#31333A] rounded-xl">
                    <div className="w-12 h-12 rounded-full border-[3px] border-[#FFF6E0]/20 border-t-[#FFF6E0] animate-spin mb-4"></div>
                    <p className="text-[#D8D9DA]">Loading reviews...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 bg-[#31333A] rounded-xl">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button 
                      onClick={() => loadReviews(1, true)}
                      className="px-4 py-2 bg-[#272829] hover:bg-[#272829]/70 rounded-lg text-sm transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : !displayedReviews || displayedReviews.length === 0 ? (
                  <div className="text-center py-12 bg-[#31333A] rounded-xl">
                    <p className="text-[#D8D9DA] mb-4">
                      {searchQuery || filterStars
                        ? "No reviews match your filter criteria." 
                        : "No reviews yet. Be the first to share your experience!"}
                    </p>
                    {(searchQuery || filterStars) && (
                      <button 
                        onClick={() => {setSearchQuery(''); setFilterStars(null);}}
                        className="px-4 py-2 bg-[#272829] hover:bg-[#272829]/70 rounded-lg text-sm transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="space-y-6 mb-6">
                      {displayedReviews.map((review) => (
                        <ReviewItem 
                          key={review._id} 
                          review={review}
                          isCurrentUser={authUser?.data?.user?._id === review.userId._id}
                          showEditOption={true}
                        />
                      ))}
                    </div>
                    
                    {/* Load More button instead of pagination */}
                    {hasMore && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={handleLoadMore}
                          disabled={isLoadingMore}
                          className="px-6 py-2.5 bg-[#31333A] text-[#FFF6E0] rounded-lg hover:bg-[#31333A]/80 transition-colors flex items-center space-x-2"
                        >
                          {isLoadingMore ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[#FFF6E0]/20 border-t-[#FFF6E0] rounded-full animate-spin"></div>
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              <span>Load More</span>
                              <ChevronDown size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <UserReviews onReviewDeleted={() => setActiveTab('all')} />
        )}
      </div>
    </div>
  );
};

export default Reviews; 