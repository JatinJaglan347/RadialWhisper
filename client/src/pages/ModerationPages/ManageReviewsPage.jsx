import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, Search, Filter, Star, ThumbsUp, 
  Trash2, Edit, ArrowUp, ArrowDown, Calendar, User, 
  Loader, MessageSquare, CheckCircle, X, RefreshCw,
  Eye, XCircle, ChevronDown, SlidersHorizontal, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

const ManageReviewsPage = () => {
  const { 
    authUser,
    isKing, 
    isAdmin,
    toggleReviewApproval,
    deleteReview,
    fetchReviews,
    reviews: storeReviews,
    isLoadingReviews
  } = useAuthStore();
  
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [starFilter, setStarFilter] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null); // null = all, true = approved, false = pending
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    hasNext: false,
    hasPrev: false
  });
  const [viewingReview, setViewingReview] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  
  // New state for filter UI
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  
  // Refs for handling dropdown clicks
  const dropdownRefs = {
    rating: useRef(null),
    status: useRef(null),
    sort: useRef(null)
  };
  
  const fetchAllReviews = async (page = 1, limit = 10, rating = null) => {
    try {
      // Convert sortConfig to API sort parameter
      let sortParam = 'newest';
      if (sortConfig.key === 'createdAt') {
        sortParam = sortConfig.direction === 'desc' ? 'newest' : 'oldest';
      } else if (sortConfig.key === 'rating') {
        sortParam = sortConfig.direction === 'desc' ? 'highest' : 'lowest';
      } else if (sortConfig.key === 'likes') {
        sortParam = sortConfig.direction === 'desc' ? 'mostLiked' : 'mostLiked';
      } else if (sortConfig.key === 'helpful') {
        sortParam = sortConfig.direction === 'desc' ? 'mostHelpful' : 'mostHelpful';
      }
      
      // Use the authStore's fetchReviews method
      const response = await fetchReviews(page, limit, rating, sortParam, searchTerm, true);
      
      if (response && response.data) {
        // Filter by status if a status filter is set
        const filteredData = statusFilter !== null
          ? response.data.filter(review => review.isApproved === statusFilter)
          : response.data;
          
        setReviews(filteredData);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    }
  };
  
  // Always load on initial mount and whenever authUser changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadInitialData = async () => {
      // Check if authentication data is available
      if (authUser) {
        console.log("Loading reviews on authUser change or initial load");
        setIsLoading(true); // Set loading state
        try {
          await fetchAllReviews(1, itemsPerPage, starFilter);
        } finally {
          setIsLoading(false); // Ensure loading state is reset even on error
        }
      }
    };
    
    loadInitialData();
  }, [authUser ]); // Run on mount and when authUser changes
  
  // Update when filters change
  useEffect(() => {
    if (authUser) {
      fetchAllReviews(currentPage, itemsPerPage, starFilter);
    }
  }, [currentPage, itemsPerPage, starFilter, sortConfig, searchTerm, statusFilter]);
  
  // Add search handling with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (authUser?.data?.token) {
        fetchAllReviews(1, itemsPerPage, starFilter);
        setCurrentPage(1); // Reset to first page when searching
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Update the handler for search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setConfirmDelete(null);
      
      // Refresh the reviews list
      fetchAllReviews(currentPage, itemsPerPage, starFilter);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };
  
  const handleToggleApproval = async (reviewId, currentStatus) => {
    try {
      await toggleReviewApproval(reviewId, !currentStatus);
      
      // Refresh the reviews list
      fetchAllReviews(currentPage, itemsPerPage, starFilter);
    } catch (error) {
      console.error('Error updating review approval:', error);
    }
  };
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const totalPages = pagination.totalPages || 1;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than max
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  // Generate star ratings display
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-[#61677A]'}`}
          />
        ))}
      </div>
    );
  };
  
  // Add a new function to view the full review content
  const handleViewContent = (review) => {
    setViewingReview(review);
  };
  
  // Add a function to close the content view
  const handleCloseView = () => {
    setViewingReview(null);
  };
  
  // Add bulk selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReviews(reviews.map(r => r._id));
    } else {
      setSelectedReviews([]);
    }
  };
  
  const handleSelectReview = (reviewId) => {
    if (selectedReviews.includes(reviewId)) {
      setSelectedReviews(selectedReviews.filter(id => id !== reviewId));
    } else {
      setSelectedReviews([...selectedReviews, reviewId]);
    }
  };
  
  // Add bulk approve handler
  const handleBulkApprove = async () => {
    if (selectedReviews.length === 0) return;
    
    setIsBulkProcessing(true);
    try {
      // Create promises for all approvals
      const approvalPromises = selectedReviews.map(reviewId => {
        // Find the review to check current status
        const review = reviews.find(r => r._id === reviewId);
        // Only approve if not already approved
        if (review && !review.isApproved) {
          return toggleReviewApproval(reviewId, true);
        }
        return Promise.resolve(); // Skip if already approved
      });
      
      await Promise.all(approvalPromises);
      toast.success(`Successfully approved ${selectedReviews.length} reviews`);
      
      // Refresh the list and clear selection
      fetchAllReviews(currentPage, itemsPerPage, starFilter);
      setSelectedReviews([]);
    } catch (error) {
      console.error('Error in bulk approve:', error);
      toast.error('Failed to approve some reviews');
    } finally {
      setIsBulkProcessing(false);
    }
  };
  
  // Add bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) return;
    
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete ${selectedReviews.length} reviews? This action cannot be undone.`)) {
      return;
    }
    
    setIsBulkProcessing(true);
    try {
      // Create promises for all deletions
      const deletePromises = selectedReviews.map(reviewId => deleteReview(reviewId));
      
      await Promise.all(deletePromises);
      toast.success(`Successfully deleted ${selectedReviews.length} reviews`);
      
      // Refresh the list and clear selection
      fetchAllReviews(currentPage, itemsPerPage, starFilter);
      setSelectedReviews([]);
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast.error('Failed to delete some reviews');
    } finally {
      setIsBulkProcessing(false);
    }
  };
  
  // Toggle filter panel
  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
    setActiveDropdown(null);
  };
  
  // Toggle dropdown menus
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };
  
  // Check if any filters are active
  useEffect(() => {
    setFiltersApplied(starFilter !== null || statusFilter !== null || searchTerm !== '');
  }, [starFilter, statusFilter, searchTerm]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown === 'rating' && 
          dropdownRefs.rating.current && 
          !dropdownRefs.rating.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      if (activeDropdown === 'status' && 
          dropdownRefs.status.current && 
          !dropdownRefs.status.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      if (activeDropdown === 'sort' && 
          dropdownRefs.sort.current && 
          !dropdownRefs.sort.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);
  
  // Reset all filters
  const resetAllFilters = () => {
    setStarFilter(null);
    setStatusFilter(null);
    setSearchTerm('');
    setSortConfig({ key: 'createdAt', direction: 'desc' });
    setCurrentPage(1);
  };
  
  // Check if user is authorized to manage reviews (only king or admin)
  if (!isKing && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#1A1B1F] text-[#FFF6E0] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
          <p className="mb-6">You don't have permission to manage reviews. This feature is only available to administrators.</p>
          <Link to="/op/dashboard" className="px-4 py-2 bg-[#31333A] hover:bg-[#61677A] rounded transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // Add the content view modal just before the main return
  const renderViewModal = () => {
    if (!viewingReview) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
        <div className="bg-[#31333A] border border-[#61677A]/30 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-[#61677A]/30 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Review Details</h2>
            <button 
              onClick={handleCloseView}
              className="p-2 rounded-full hover:bg-[#61677A]/20 transition-colors"
            >
              <XCircle size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#61677A] overflow-hidden flex-shrink-0">
                {viewingReview.userId?.profileImageURL ? (
                  <img 
                    src={viewingReview.userId.profileImageURL} 
                    alt={viewingReview.userId?.fullName || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} className="w-full h-full p-1.5" />
                )}
              </div>
              <div>
                <div className="font-medium">{viewingReview.userId?.fullName || 'Anonymous User'}</div>
                <div className="text-sm text-[#FFF6E0]/60 flex items-center gap-1.5">
                  <Calendar size={12} />
                  {formatDistanceToNow(new Date(viewingReview.createdAt), { addSuffix: true })}
                </div>
              </div>
              <div className="ml-auto">
                {renderStars(viewingReview.rating)}
              </div>
            </div>
            
            <div className="mb-5 bg-[#1A1B1F] p-4 rounded-lg">
              {viewingReview.content}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <ThumbsUp size={14} className="text-[#FFF6E0]/70" />
                  <span>{viewingReview.likes || 0} likes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[#FFF6E0]/70" />
                  <span>{viewingReview.helpful || 0} helpful</span>
                </div>
              </div>
              
              <div className="space-x-2">
                <button
                  onClick={() => handleToggleApproval(viewingReview._id, viewingReview.isApproved)}
                  className={`px-3 py-1.5 rounded ${
                    viewingReview.isApproved 
                      ? "bg-yellow-500/20 text-yellow-400" 
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {viewingReview.isApproved ? "Unapprove" : "Approve"}
                </button>
                
                <button
                  onClick={() => {
                    setConfirmDelete(viewingReview._id);
                    handleCloseView();
                  }}
                  className="px-3 py-1.5 rounded bg-red-500/20 text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-[#1A1B1F] text-[#FFF6E0] relative overflow-hidden max-w-screen">
      {renderViewModal()}
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#1A1B1F] opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/src/assets/images/city-background.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#1A1B1F] via-[#31333A] to-transparent opacity-90"></div>
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-15 animate-pulse" style={{animationDuration: '10s'}}></div>
      <div className="absolute top-20 left-1/4 w-60 h-60 rounded-full bg-[#FFF6E0] blur-[100px] opacity-5 animate-pulse" style={{animationDuration: '8s'}}></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-10 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Link to="/op/dashboard" className="p-2.5 bg-[#31333A]/80 rounded-full hover:bg-[#61677A] transition-colors duration-300 group">
                <ChevronLeft size={20} className="group-hover:text-[#FFF6E0] transition-colors duration-300" />
              </Link>
              <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#1A1B1F] px-5 py-1.5 rounded-full text-sm font-semibold tracking-wide">Reviews</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Manage Reviews</span>
            </h1>
            <p className="text-[#D8D9DA] mt-3 max-w-lg text-lg">
              Review, moderate, and manage user feedback submissions.
            </p>
          </div>
          
          {/* Search and filter buttons */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full md:w-56 px-4 py-2.5 pl-10 bg-[#31333A]/80 border border-[#61677A]/30 rounded-xl text-[#FFF6E0] placeholder-[#FFF6E0]/40 focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFF6E0]/40" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-[#61677A]/20"
                >
                  <X size={14} className="text-[#FFF6E0]/60" />
                </button>
              )}
            </div>
            
            <button 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
                filtersApplied 
                  ? "bg-[#FFF6E0]/10 text-[#FFF6E0] border-[#FFF6E0]/30" 
                  : "bg-[#31333A]/80 text-[#FFF6E0]/80 border-[#61677A]/30 hover:bg-[#31333A]"
              }`}
              onClick={toggleFilterPanel}
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
              {filtersApplied && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-[#FFF6E0] text-[#1A1B1F] rounded-full font-medium">
                  {(starFilter !== null ? 1 : 0) + (statusFilter !== null ? 1 : 0) + (searchTerm !== '' ? 1 : 0)}
                </span>
              )}
            </button>
            
            <button 
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#31333A]/80 border border-[#61677A]/30 rounded-xl text-[#FFF6E0] hover:bg-[#31333A] transition-colors"
              onClick={() => fetchAllReviews(1, itemsPerPage, starFilter)}
              disabled={isLoadingReviews}
            >
              <RefreshCw size={18} className={isLoadingReviews ? 'animate-spin' : ''} />
              <span className="sr-only sm:not-sr-only">Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Filter panel */}
        {showFilterPanel && (
          <div className="bg-[#31333A]/90 border border-[#61677A]/30 backdrop-blur-sm rounded-xl p-5 mb-6 shadow-lg animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filter Reviews</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetAllFilters}
                  className="text-sm text-[#FFF6E0]/70 hover:text-[#FFF6E0] flex items-center gap-1.5"
                >
                  <RefreshCw size={14} />
                  Reset
                </button>
                <button 
                  onClick={toggleFilterPanel}
                  className="p-1.5 rounded-full hover:bg-[#61677A]/30"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Star Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#D8D9DA] flex items-center gap-1.5">
                  <Star size={14} className="text-yellow-400" />
                  Rating
                </label>
                <div className="relative" ref={dropdownRefs.rating}>
                  <button
                    onClick={() => toggleDropdown('rating')}
                    className="w-full flex items-center justify-between bg-[#272829] text-[#D8D9DA] rounded-lg p-2.5 border border-[#31333A] hover:border-[#61677A] focus:outline-none transition"
                  >
                    <span className="flex items-center gap-2">
                      {starFilter ? (
                        <>
                          {renderStars(starFilter)}
                          <span className="ml-1">({starFilter} Star{starFilter !== 1 ? 's' : ''})</span>
                        </>
                      ) : (
                        'All Ratings'
                      )}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'rating' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === 'rating' && (
                    <div className="absolute z-10 mt-1 w-full bg-[#272829] border border-[#31333A] rounded-lg shadow-xl py-1">
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${starFilter === null ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                        onClick={() => {
                          setStarFilter(null);
                          setActiveDropdown(null);
                        }}
                      >
                        All Ratings
                      </button>
                      {[5, 4, 3, 2, 1].map(rating => (
                        <button
                          key={rating}
                          className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${starFilter === rating ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'} flex items-center`}
                          onClick={() => {
                            setStarFilter(rating);
                            setActiveDropdown(null);
                          }}
                        >
                          {renderStars(rating)}
                          <span className="ml-2">({rating} Star{rating !== 1 ? 's' : ''})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#D8D9DA] flex items-center gap-1.5">
                  <CheckCircle size={14} />
                  Status
                </label>
                <div className="relative" ref={dropdownRefs.status}>
                  <button
                    onClick={() => toggleDropdown('status')}
                    className="w-full flex items-center justify-between bg-[#272829] text-[#D8D9DA] rounded-lg p-2.5 border border-[#31333A] hover:border-[#61677A] focus:outline-none transition"
                  >
                    <span className="flex items-center gap-2">
                      {statusFilter === true ? (
                        <>
                          <CheckCircle size={14} className="text-green-400" />
                          <span>Approved</span>
                        </>
                      ) : statusFilter === false ? (
                        <>
                          <AlertCircle size={14} className="text-yellow-400" />
                          <span>Pending</span>
                        </>
                      ) : (
                        'All Statuses'
                      )}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'status' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === 'status' && (
                    <div className="absolute z-10 mt-1 w-full bg-[#272829] border border-[#31333A] rounded-lg shadow-xl py-1">
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${statusFilter === null ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'}`}
                        onClick={() => {
                          setStatusFilter(null);
                          setActiveDropdown(null);
                        }}
                      >
                        All Statuses
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${statusFilter === true ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'} flex items-center gap-2`}
                        onClick={() => {
                          setStatusFilter(true);
                          setActiveDropdown(null);
                        }}
                      >
                        <CheckCircle size={14} className="text-green-400" />
                        Approved
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${statusFilter === false ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'} flex items-center gap-2`}
                        onClick={() => {
                          setStatusFilter(false);
                          setActiveDropdown(null);
                        }}
                      >
                        <AlertCircle size={14} className="text-yellow-400" />
                        Pending
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#D8D9DA] flex items-center gap-1.5">
                  <ArrowUp size={14} />
                  Sort By
                </label>
                <div className="relative" ref={dropdownRefs.sort}>
                  <button
                    onClick={() => toggleDropdown('sort')}
                    className="w-full flex items-center justify-between bg-[#272829] text-[#D8D9DA] rounded-lg p-2.5 border border-[#31333A] hover:border-[#61677A] focus:outline-none transition"
                  >
                    <span className="flex items-center gap-2">
                      {sortConfig.key === 'createdAt' ? (
                        <>
                          <Calendar size={14} />
                          <span>{sortConfig.direction === 'desc' ? 'Newest First' : 'Oldest First'}</span>
                        </>
                      ) : sortConfig.key === 'rating' ? (
                        <>
                          <Star size={14} />
                          <span>{sortConfig.direction === 'desc' ? 'Highest Rated' : 'Lowest Rated'}</span>
                        </>
                      ) : (
                        <>
                          <ThumbsUp size={14} />
                          <span>{sortConfig.key === 'likes' ? 'Most Liked' : 'Most Helpful'}</span>
                        </>
                      )}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === 'sort' && (
                    <div className="absolute z-10 mt-1 w-full bg-[#272829] border border-[#31333A] rounded-lg shadow-xl py-1">
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${
                          sortConfig.key === 'createdAt' && sortConfig.direction === 'desc' ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'
                        } flex items-center gap-2`}
                        onClick={() => {
                          setSortConfig({ key: 'createdAt', direction: 'desc' });
                          setActiveDropdown(null);
                        }}
                      >
                        <Calendar size={14} />
                        Newest First
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${
                          sortConfig.key === 'createdAt' && sortConfig.direction === 'asc' ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'
                        } flex items-center gap-2`}
                        onClick={() => {
                          setSortConfig({ key: 'createdAt', direction: 'asc' });
                          setActiveDropdown(null);
                        }}
                      >
                        <Calendar size={14} />
                        Oldest First
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${
                          sortConfig.key === 'rating' && sortConfig.direction === 'desc' ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'
                        } flex items-center gap-2`}
                        onClick={() => {
                          setSortConfig({ key: 'rating', direction: 'desc' });
                          setActiveDropdown(null);
                        }}
                      >
                        <Star size={14} />
                        Highest Rated
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${
                          sortConfig.key === 'rating' && sortConfig.direction === 'asc' ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'
                        } flex items-center gap-2`}
                        onClick={() => {
                          setSortConfig({ key: 'rating', direction: 'asc' });
                          setActiveDropdown(null);
                        }}
                      >
                        <Star size={14} />
                        Lowest Rated
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${
                          sortConfig.key === 'likes' ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'
                        } flex items-center gap-2`}
                        onClick={() => {
                          setSortConfig({ key: 'likes', direction: 'desc' });
                          setActiveDropdown(null);
                        }}
                      >
                        <ThumbsUp size={14} />
                        Most Liked
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#31333A] ${
                          sortConfig.key === 'helpful' ? 'bg-[#31333A]/70 text-[#FFF6E0]' : 'text-[#D8D9DA]'
                        } flex items-center gap-2`}
                        onClick={() => {
                          setSortConfig({ key: 'helpful', direction: 'desc' });
                          setActiveDropdown(null);
                        }}
                      >
                        <CheckCircle size={14} />
                        Most Helpful
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Active filters badges */}
            {filtersApplied && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-[#FFF6E0]/60">Active filters:</span>
                
                {searchTerm && (
                  <span className="px-2 py-1 bg-[#FFF6E0]/10 text-[#FFF6E0] text-sm rounded-lg flex items-center gap-1.5">
                    <Search size={12} />
                    "{searchTerm}"
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-1 p-0.5 rounded-full hover:bg-[#61677A]/30"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                
                {starFilter !== null && (
                  <span className="px-2 py-1 bg-[#FFF6E0]/10 text-[#FFF6E0] text-sm rounded-lg flex items-center gap-1.5">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {starFilter} Star{starFilter !== 1 ? 's' : ''}
                    <button 
                      onClick={() => setStarFilter(null)}
                      className="ml-1 p-0.5 rounded-full hover:bg-[#61677A]/30"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                
                {statusFilter !== null && (
                  <span className="px-2 py-1 bg-[#FFF6E0]/10 text-[#FFF6E0] text-sm rounded-lg flex items-center gap-1.5">
                    {statusFilter ? (
                      <CheckCircle size={12} className="text-green-400" />
                    ) : (
                      <AlertCircle size={12} className="text-yellow-400" />
                    )}
                    {statusFilter ? 'Approved' : 'Pending'}
                    <button 
                      onClick={() => setStatusFilter(null)}
                      className="ml-1 p-0.5 rounded-full hover:bg-[#61677A]/30"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Bulk actions UI */}
        {selectedReviews.length > 0 && (
          <div className="bg-[#31333A]/70 border border-[#61677A]/30 rounded-xl p-4 mb-4 flex items-center justify-between">
            <div>
              <span className="font-medium">{selectedReviews.length} reviews selected</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBulkApprove}
                disabled={isBulkProcessing}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
              >
                {isBulkProcessing ? <Loader size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>Approve All</span>
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isBulkProcessing}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
              >
                {isBulkProcessing ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span>Delete All</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Reviews table */}
        <div className="bg-[#31333A]/50 border border-[#61677A]/30 rounded-2xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#31333A]/80 border-b border-[#61677A]/30">
                  <th className="py-4 px-6 text-left w-8">
                    <input 
                      type="checkbox" 
                      checked={selectedReviews.length > 0 && selectedReviews.length === reviews.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-[#61677A] bg-[#31333A] text-[#FFF6E0] focus:ring-0 focus:ring-offset-0"
                    />
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2">
                      <span>User</span>
                      <button onClick={() => handleSort('userId')} className="p-1">
                        {sortConfig.key === 'userId' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        ) : (
                          <div className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2">
                      <span>Rating</span>
                      <button onClick={() => handleSort('rating')} className="p-1">
                        {sortConfig.key === 'rating' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        ) : (
                          <div className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">Content</th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2">
                      <span>Engagement</span>
                      <button onClick={() => handleSort('likes')} className="p-1">
                        {sortConfig.key === 'likes' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        ) : (
                          <div className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2">
                      <span>Date</span>
                      <button onClick={() => handleSort('createdAt')} className="p-1">
                        {sortConfig.key === 'createdAt' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        ) : (
                          <div className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingReviews ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader size={30} className="animate-spin text-[#FFF6E0]/70" />
                        <span className="text-[#FFF6E0]/70">Loading reviews...</span>
                      </div>
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <MessageSquare size={30} className="text-[#FFF6E0]/70" />
                        <span className="text-[#FFF6E0]/70">No reviews found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review._id} className="border-b border-[#61677A]/20 hover:bg-[#31333A]/60 transition-colors">
                      <td className="py-4 px-6">
                        <input 
                          type="checkbox"
                          checked={selectedReviews.includes(review._id)}
                          onChange={() => handleSelectReview(review._id)}
                          className="h-4 w-4 rounded border-[#61677A] bg-[#31333A] text-[#FFF6E0] focus:ring-0 focus:ring-offset-0"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 max-w-[150px]">
                          <div className="w-8 h-8 rounded-full bg-[#61677A] overflow-hidden flex-shrink-0">
                            {review.userId?.profileImageURL ? (
                              <img 
                                src={review.userId.profileImageURL} 
                                alt={review.userId?.fullName || 'User'} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={20} className="w-full h-full p-1" />
                            )}
                          </div>
                          <span className="font-medium truncate">
                            {review.userId?.fullName || 'Anonymous User'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {renderStars(review.rating)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="max-w-[300px] truncate flex items-center gap-2">
                          <span className="flex-1">{review.content}</span>
                          <button
                            onClick={() => handleViewContent(review)}
                            className="p-1 rounded hover:bg-[#61677A]/20 focus:outline-none"
                            title="View full content"
                          >
                            <Eye size={14} className="text-[#FFF6E0]/60" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <ThumbsUp size={14} className="text-[#FFF6E0]/70" />
                            <span>{review.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle size={14} className="text-[#FFF6E0]/70" />
                            <span>{review.helpful || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center text-sm gap-1.5 text-[#FFF6E0]/70">
                          <Calendar size={14} />
                          <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {review.isApproved ? (
                          <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleApproval(review._id, review.isApproved)}
                            className="p-2 bg-[#31333A] hover:bg-[#61677A]/70 rounded-lg transition-colors"
                            title={review.isApproved ? "Unapprove Review" : "Approve Review"}
                          >
                            {review.isApproved ? (
                              <X size={16} className="text-yellow-400" />
                            ) : (
                              <CheckCircle size={16} className="text-green-400" />
                            )}
                          </button>
                          
                          {confirmDelete === review._id ? (
                            <>
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                className="p-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg transition-colors"
                                title="Confirm Delete"
                              >
                                <CheckCircle size={16} className="text-red-400" />
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="p-2 bg-[#31333A] hover:bg-[#61677A]/70 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(review._id)}
                              className="p-2 bg-[#31333A] hover:bg-red-600/30 rounded-lg transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        {!isLoadingReviews && reviews.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg border ${
                  currentPage === 1
                    ? 'bg-[#31333A]/50 border-[#61677A]/20 text-[#FFF6E0]/40 cursor-not-allowed'
                    : 'bg-[#31333A]/80 border-[#61677A]/40 text-[#FFF6E0] hover:bg-[#61677A]/50'
                } transition-colors`}
              >
                Previous
              </button>
              
              {generatePaginationNumbers().map((number, i) => (
                <button
                  key={i}
                  onClick={() => typeof number === 'number' ? paginate(number) : null}
                  disabled={typeof number !== 'number'}
                  className={`px-3 py-1.5 rounded-lg border ${
                    number === currentPage
                      ? 'bg-[#FFF6E0] border-[#FFF6E0] text-[#1A1B1F] font-bold'
                      : number === '...'
                      ? 'bg-transparent border-transparent text-[#FFF6E0]/60 cursor-default'
                      : 'bg-[#31333A]/80 border-[#61677A]/40 text-[#FFF6E0] hover:bg-[#61677A]/50'
                  } transition-colors min-w-[40px]`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`px-3 py-1.5 rounded-lg border ${
                  currentPage === pagination.totalPages
                    ? 'bg-[#31333A]/50 border-[#61677A]/20 text-[#FFF6E0]/40 cursor-not-allowed'
                    : 'bg-[#31333A]/80 border-[#61677A]/40 text-[#FFF6E0] hover:bg-[#61677A]/50'
                } transition-colors`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReviewsPage; 