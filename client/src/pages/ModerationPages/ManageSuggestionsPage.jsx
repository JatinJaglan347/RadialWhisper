import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, Search, Filter, Bookmark, ThumbsUp, Plus, 
  Trash2, Edit, ArrowUp, ArrowDown, Calendar, User, 
  Loader, MessageSquare, AlertCircle, Sparkles, AlertTriangle, Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDistanceToNow } from 'date-fns';

const ManageSuggestionsPage = () => {
  const { 
    suggestions, 
    fetchSuggestions, 
    likeSuggestion, 
    authUser, 
    deleteSuggestion,
    isAdmin,
    isKing,
    isModrater
  } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  
  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoading(true);
      await fetchSuggestions();
      setIsLoading(false);
    };
    
    loadSuggestions();
  }, [fetchSuggestions]);
  
  const categories = [
    { name: 'All', icon: <Sparkles size={14} /> },
    { name: 'Feature Request', icon: <Plus size={14} /> },
    { name: 'UI/UX Improvement', icon: <Settings size={14} /> },
    { name: 'Bug Report', icon: <AlertCircle size={14} /> },
    { name: 'Performance Issue', icon: <AlertTriangle size={14} /> },
    { name: 'Documentation', icon: <MessageSquare size={14} /> },
    { name: 'Other', icon: <MessageSquare size={14} /> }
  ];
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    if (sortConfig.key === 'createdAt') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortConfig.key === 'likes') {
      return sortConfig.direction === 'asc' 
        ? a.likes - b.likes 
        : b.likes - a.likes;
    }
    return 0;
  });
  
  const filteredSuggestions = sortedSuggestions.filter(suggestion => {
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || suggestion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuggestions.slice(indexOfFirstItem, indexOfLastItem);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const isLikedByUser = (suggestion) => {
    const userId = authUser?.data?.user?._id;
    return suggestion.likedBy.some(id => id === userId);
  };
  
  const canModerate = isAdmin || isKing || isModrater;
  const userId = authUser?.data?.user?._id;
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this suggestion?")) {
      await deleteSuggestion(id);
      await fetchSuggestions();
    }
  };
  
  // Get category icon
  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : <MessageSquare size={14} />;
  };
  
  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
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
  
  return (
    <div className="min-h-screen bg-[#1A1B1F] text-[#FFF6E0] relative overflow-hidden max-w-screen ">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#1A1B1F] opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/src/assets/images/city-background.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#1A1B1F] via-[#31333A] to-transparent opacity-90"></div>
      </div>
      
      {/* Improved floating orbs */}
      <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-96 h-96 rounded-full bg-[#61677A] blur-[150px] opacity-15 animate-pulse" style={{animationDuration: '10s'}}></div>
      <div className="absolute top-20 left-1/4 w-60 h-60 rounded-full bg-[#FFF6E0] blur-[100px] opacity-5 animate-pulse" style={{animationDuration: '8s'}}></div>
      
      {/* Improved grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-10 relative z-10 max-w-7xl">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Link to="/" className="p-2.5 bg-[#31333A]/80 rounded-full hover:bg-[#61677A] transition-colors duration-300 group">
                <ChevronLeft size={20} className="group-hover:text-[#FFF6E0] transition-colors duration-300" />
              </Link>
              <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#1A1B1F] px-5 py-1.5 rounded-full text-sm font-semibold tracking-wide">Community</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Manage Suggestions</span>
            </h1>
            <p className="text-[#D8D9DA] mt-3 max-w-lg text-lg">
              Browse, filter, and interact with community suggestions. Help us improve the platform!
            </p>
          </div>
          
          <Link to="/create-suggestion" className="btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#FFE6C0] hover:to-[#FFF6E0] text-[#1A1B1F] px-7 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:translate-y-[-2px]">
            <Plus size={18} className="mr-2" />
            New Suggestion
          </Link>
        </div>
        
        {/* Enhanced Filters and search */}
        <div className="bg-[#31333A]/80 backdrop-blur-md p-6 rounded-2xl border border-[#61677A]/30 mb-10 shadow-lg">
          <div className="flex flex-col  gap-5">
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D8D9DA]" />
              <input
                type="text"
                placeholder="Search suggestions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1A1B1F]/80 border border-[#61677A]/30 rounded-xl py-3 pl-12 pr-4 text-[#FFF6E0] placeholder-[#D8D9DA]/50 focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30 transition-all duration-300"
              />
            </div>
            
            <div className="flex gap-3 items-center">
              <Filter size={18} className="text-[#D8D9DA]" />
              <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap md:flex-nowrap">
                {categories.map(category => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === category.name
                        ? 'bg-[#FFF6E0] text-[#1A1B1F] font-semibold shadow-md'
                        : 'bg-[#1A1B1F]/70 text-[#D8D9DA] hover:bg-[#1A1B1F]/90'
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6 flex-wrap">
            <button
              onClick={() => handleSort('createdAt')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                sortConfig.key === 'createdAt' ? 'bg-[#61677A]/50 text-[#FFF6E0] font-medium' : 'text-[#D8D9DA] hover:bg-[#61677A]/20'
              }`}
            >
              <Calendar size={16} />
              Date
              {sortConfig.key === 'createdAt' && (
                sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
              )}
            </button>
            
            <button
              onClick={() => handleSort('likes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                sortConfig.key === 'likes' ? 'bg-[#61677A]/50 text-[#FFF6E0] font-medium' : 'text-[#D8D9DA] hover:bg-[#61677A]/20'
              }`}
            >
              <ThumbsUp size={16} />
              Likes
              {sortConfig.key === 'likes' && (
                sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
              )}
            </button>
            
            <div className="ml-auto text-[#D8D9DA]/70 flex items-center">
              <span className="text-sm">{filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''} found</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Suggestions List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="flex flex-col items-center">
              <Loader size={40} className="text-[#FFF6E0] animate-spin mb-4" />
              <p className="text-[#D8D9DA] text-lg">Loading suggestions...</p>
            </div>
          </div>
        ) : filteredSuggestions.length === 0 ? (
          <div className="bg-[#31333A]/70 backdrop-blur-md p-12 rounded-2xl border border-[#61677A]/30 text-center shadow-lg">
            <Bookmark size={60} className="mx-auto text-[#D8D9DA] mb-6 opacity-70" />
            <h3 className="text-2xl font-semibold mb-3">No suggestions found</h3>
            <p className="text-[#D8D9DA] mb-8 text-lg max-w-xl mx-auto">Try adjusting your search or filters, or create a new suggestion to be the first one!</p>
            <Link to="/create-suggestion" className="btn bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#FFE6C0] hover:to-[#FFF6E0] text-[#1A1B1F] px-7 py-3.5 rounded-full font-semibold transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl transform hover:translate-y-[-2px]">
              <Plus size={18} className="mr-2" />
              New Suggestion
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map(suggestion => (
              <div 
                key={suggestion._id} 
                className="bg-[#31333A]/70 backdrop-blur-md rounded-2xl border border-[#61677A]/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#61677A]/50 group transform hover:translate-y-[-2px]"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#61677A]/40 text-[#D8D9DA] flex items-center gap-1.5">
                      {getCategoryIcon(suggestion.category)}
                      {suggestion.category}
                    </span>
                    <div className="flex gap-2">
                      {(canModerate || suggestion.user === userId) && (
                        <>
                          <Link to={`/edit-suggestion/${suggestion._id}`} className="p-2 rounded-full bg-[#272829]/70 hover:bg-[#272829] transition-colors duration-300 group-hover:opacity-100 opacity-70">
                            <Edit size={16} className="text-[#D8D9DA] group-hover:text-[#FFF6E0]" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(suggestion._id)}
                            className="p-2 rounded-full bg-[#272829]/70 hover:bg-red-900/80 transition-colors duration-300 group-hover:opacity-100 opacity-70"
                          >
                            <Trash2 size={16} className="text-[#D8D9DA] group-hover:text-red-300" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <Link to={`/suggestion/${suggestion._id}`} className="block group-hover:scale-[1.01] transition-transform duration-300">
                    <h3 className="text-xl font-semibold mb-3 truncate hover:text-[#FFF6E0] transition-colors duration-300">
                      {suggestion.title}
                    </h3>
                    <p className="text-[#D8D9DA] mb-5 line-clamp-3 text-sm leading-relaxed">
                      {suggestion.description}
                    </p>
                  </Link>
                  
                  <div className="flex justify-between items-end">
                    <button 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                        isLikedByUser(suggestion)
                          ? 'bg-[#FFF6E0]/20 text-[#FFF6E0]'
                          : 'text-[#D8D9DA] hover:bg-[#FFF6E0]/10'
                      }`}
                      onClick={() => likeSuggestion(suggestion._id)}
                    >
                      <ThumbsUp size={16} className={isLikedByUser(suggestion) ? 'fill-[#FFF6E0]' : ''} />
                      {suggestion.likes}
                    </button>
                    
                    <div className="text-[#D8D9DA]/80 text-xs mt-2 text-right">
                      <span>{formatDistanceToNow(new Date(suggestion.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-[#61677A]/20">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#61677A] to-[#31333A] rounded-full flex items-center justify-center mr-3 shadow-md">
                        <User size={14} className="text-[#FFF6E0]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#FFF6E0]">
                          {suggestion.user?.fullName || "Anonymous"}
                        </div>
                        <div className="flex items-center text-xs">
                          <span className="text-[#D8D9DA]/80">{suggestion.user?.email || "unknown"}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <span className="text-[#D8D9DA]/80">#{suggestion.user?.uniqueTag || "unknown"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Enhanced Pagination */}
        {filteredSuggestions.length > itemsPerPage && (
          <div className="mt-12 flex justify-center">
            <div className="bg-[#31333A]/70 backdrop-blur-md rounded-xl border border-[#61677A]/30 p-2 inline-flex shadow-lg">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  currentPage === 1 
                    ? 'text-[#D8D9DA]/40 cursor-not-allowed' 
                    : 'text-[#D8D9DA] hover:bg-[#272829] hover:text-[#FFF6E0]'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center px-2">
                {generatePaginationNumbers().map((number, index) => (
                  <React.Fragment key={index}>
                    {number === '...' ? (
                      <span className="px-3 text-[#D8D9DA]/50">...</span>
                    ) : (
                      <button
                        onClick={() => paginate(number)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md mx-1 ${
                          currentPage === number
                            ? 'bg-[#FFF6E0] text-[#1A1B1F] font-medium'
                            : 'text-[#D8D9DA] hover:bg-[#272829] transition-colors duration-300'
                        }`}
                      >
                        {number}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  currentPage === totalPages 
                    ? 'text-[#D8D9DA]/40 cursor-not-allowed' 
                    : 'text-[#D8D9DA] hover:bg-[#272829] hover:text-[#FFF6E0]'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {/* Stats summary */}
        {!isLoading && filteredSuggestions.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#31333A]/50 backdrop-blur-sm p-4 rounded-xl border border-[#61677A]/20">
              <h4 className="text-[#D8D9DA]/70 text-sm mb-1">Total Suggestions</h4>
              <p className="text-2xl font-semibold text-[#FFF6E0]">{suggestions.length}</p>
            </div>
            <div className="bg-[#31333A]/50 backdrop-blur-sm p-4 rounded-xl border border-[#61677A]/20">
              <h4 className="text-[#D8D9DA]/70 text-sm mb-1">Most Popular Category</h4>
              <p className="text-2xl font-semibold text-[#FFF6E0]">
                {Object.entries(
                  suggestions.reduce((acc, curr) => {
                    acc[curr.category] = (acc[curr.category] || 0) + 1;
                    return acc;
                  }, {})
                ).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"}
              </p>
            </div>
            <div className="bg-[#31333A]/50 backdrop-blur-sm p-4 rounded-xl border border-[#61677A]/20">
              <h4 className="text-[#D8D9DA]/70 text-sm mb-1">Most Liked</h4>
              <p className="text-2xl font-semibold text-[#FFF6E0]">
                {suggestions.reduce((max, curr) => (curr.likes > max ? curr.likes : max), 0)}
              </p>
            </div>
            <div className="bg-[#31333A]/50 backdrop-blur-sm p-4 rounded-xl border border-[#61677A]/20">
              <h4 className="text-[#D8D9DA]/70 text-sm mb-1">Latest Update</h4>
              <p className="text-2xl font-semibold text-[#FFF6E0]">
                {suggestions.length > 0 
                  ? formatDistanceToNow(new Date(
                      suggestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.createdAt
                    ), { addSuffix: true })
                  : "None"}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced floating action button for mobile */}
      <Link to="/create-suggestion" className="fixed bottom-8 right-8 md:hidden z-50 bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] rounded-full p-4 shadow-xl">
        <Plus size={28} className="text-[#1A1B1F]" />
      </Link>
    </div>
  );
};

export default ManageSuggestionsPage;