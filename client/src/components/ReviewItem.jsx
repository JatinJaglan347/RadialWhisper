import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore.js';
import { toast } from 'react-hot-toast';
import { Star, ThumbsUp, CheckCircle, MoreHorizontal, Calendar, Award, Clock, Edit3, User, MessageCircle, Trash2, X, Save } from 'lucide-react';

const ReviewItem = ({ review, onReviewUpdated, onReviewDeleted, showEditOption = false }) => {
  const { authUser, likeReview, markReviewHelpful, updateReview, deleteReview } = useAuthStore();
  const [likes, setLikes] = useState(review.likes || 0);
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isMarkedHelpful, setIsMarkedHelpful] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editFormData, setEditFormData] = useState({
    rating: review.rating,
    content: review.content
  });

  const currentUserId = authUser?.data?.user?._id;
  const isOwnReview = currentUserId === review.userId._id;
  
  // Check if the current user has already liked or marked helpful
  useEffect(() => {
    if (currentUserId) {
      // Check if the user's ID is in the likedBy array
      setIsLiked(review.likedBy?.includes(currentUserId) || false);
      
      // Check if the user's ID is in the helpfulBy array
      setIsMarkedHelpful(review.helpfulBy?.includes(currentUserId) || false);
    }
  }, [currentUserId, review.likedBy, review.helpfulBy]);
  
  // Update local state whenever the review prop changes
  useEffect(() => {
    setLikes(review.likes || 0);
    setHelpful(review.helpful || 0);
    setEditFormData({
      rating: review.rating,
      content: review.content
    });
  }, [review]);
  
  // Check if review was actually edited (content changed)
  const wasEdited = () => {
    if (!review.createdAt || !review.updatedAt) return false;
    
    const createdDate = new Date(review.createdAt);
    const updatedDate = new Date(review.updatedAt);
    
    // Get time difference in minutes
    const timeDiff = (updatedDate - createdDate) / (1000 * 60);
    
    // If difference is more than 1 minute, consider it a content edit
    return timeDiff > 1;
  };
  
  const handleLike = async () => {
    if (!authUser) {
      toast.error('Please login to like reviews', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
        icon: '⚠️',
      });
      return;
    }
    
    if (isOwnReview) {
      toast.error('You cannot like your own review', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
        icon: '⚠️',
      });
      return;
    }
    
    try {
      const response = await likeReview(review._id);
      
      if (response) {
        setLikes(response.data.likes);
        setIsLiked(!isLiked);
        setShowActions(false);
        
        if (!isLiked) {
          toast.success('Review liked!', {
            style: {
              background: '#31333A',
              color: '#FFF6E0',
              borderRadius: '10px',
            },
            icon: '👍',
          });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  const handleMarkHelpful = async () => {
    if (!authUser) {
      toast.error('Please login to mark reviews as helpful', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
        icon: '⚠️',
      });
      return;
    }
    
    if (isOwnReview) {
      toast.error('You cannot mark your own review as helpful', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
        icon: '⚠️',
      });
      return;
    }
    
    try {
      const response = await markReviewHelpful(review._id);
      
      if (response) {
        setHelpful(response.data.helpful);
        setIsMarkedHelpful(!isMarkedHelpful);
        setShowActions(false);
        
        if (!isMarkedHelpful) {
          toast.success('Marked as helpful!', {
            style: {
              background: '#31333A',
              color: '#FFF6E0',
              borderRadius: '10px',
            },
            icon: '✅',
          });
        }
      }
    } catch (error) {
      console.error('Error toggling helpful mark:', error);
    }
  };

  // For inline editing
  const handleEditClick = () => {
    setIsEditing(true);
    setShowActions(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      rating: review.rating,
      content: review.content
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    setEditFormData(prev => ({
      ...prev,
      rating: newRating
    }));
  };

  const handleUpdateReview = async () => {
    if (!editFormData.rating) {
      toast.error('Please select a rating', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
        icon: '⚠️',
      });
      return;
    }

    if (!editFormData.content.trim()) {
      toast.error('Please enter your review content', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
        icon: '⚠️',
      });
      return;
    }

    try {
      const result = await updateReview(review._id, editFormData);
      if (result) {
        // The parent component will refetch reviews
        setIsEditing(false);
        
        toast.success('Review updated successfully', {
          style: {
            background: '#31333A',
            color: '#FFF6E0',
            borderRadius: '10px',
          },
          icon: '✅',
        });
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
        icon: '❌',
      });
    }
  };

  const handleDeleteReview = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(review._id);
        
        toast.success('Review deleted successfully', {
          style: {
            background: '#31333A',
            color: '#FFF6E0',
            borderRadius: '10px',
          },
          icon: '🗑️',
        });
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review', {
          style: {
            background: '#31333A',
            color: '#FFF6E0',
            borderRadius: '10px',
          },
          icon: '❌',
        });
      }
    }
  };
  
  const getFirstInitial = (name) => {
    return name?.charAt(0).toUpperCase() || 'A';
  };

  if (isEditing) {
    return (
      <div className="bg-[#31333A] rounded-xl overflow-hidden relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-pink-500 opacity-20 blur-sm rounded-xl"></div>
        <div className="relative p-6 z-10">
          <div className="flex items-center mb-4">
            <Edit3 size={18} className="mr-2 text-amber-400" />
            <h3 className="text-lg font-semibold text-[#FFF6E0]">Edit Your Review</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#D8D9DA] mb-2">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="p-1 focus:outline-none group transition-transform"
                  >
                    <Star 
                      size={24}
                      fill={editFormData.rating >= star ? "#F59E0B" : "none"}
                      stroke={editFormData.rating >= star ? "#F59E0B" : "#9CA3AF"}
                      className={`transition-colors`} 
                    />
                  </button>
                ))}
                
                {editFormData.rating > 0 && (
                  <div className="ml-2 text-[#FFF6E0] font-medium">
                    {editFormData.rating}.0
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-[#D8D9DA] mb-2">Review</label>
              <textarea
                id="content"
                name="content"
                value={editFormData.content}
                onChange={handleEditChange}
                rows="4"
                className="w-full px-4 py-3 bg-[#272829] rounded-lg text-[#FFF6E0] placeholder-[#61677A] focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
              ></textarea>
              <div className="mt-1 flex justify-end">
                <span className="text-xs text-[#D8D9DA]/70">
                  {editFormData.content.length}/500
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg bg-[#272829] text-[#D8D9DA] hover:bg-[#3A3C43] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReview}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (confirmDelete) {
    return (
      <div className="bg-[#31333A] rounded-xl overflow-hidden relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-pink-500 opacity-10 blur-sm rounded-xl"></div>
        
        <div className="relative p-5 z-10">
          <h3 className="text-lg font-semibold text-amber-400 mb-3">Confirm Delete</h3>
          <p className="text-[#D8D9DA] mb-4">Are you sure you want to delete this review? This action cannot be undone.</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 rounded-lg bg-[#272829] text-[#D8D9DA] hover:bg-[#2C2D30] transition-colors flex items-center"
            >
              <X size={16} className="mr-1" />
              Cancel
            </button>
            <button
              onClick={handleDeleteReview}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90 transition-colors flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-[#31333A] rounded-xl overflow-hidden transition-all duration-300 relative">
      {/* Border glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm rounded-xl"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#272829] flex items-center justify-center text-[#FFF6E0] font-semibold mr-4">
                {review.userId?.profileImageURL ? (
                  <img 
                    src={review.userId.profileImageURL} 
                    alt={`${review.userId.fullName}'s profile`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getFirstInitial(review.userId?.fullName)}</span>
                )}
              </div>
              
            </div>
            
            <div>
              <div className="flex items-center">
                <h4 className="text-lg font-medium text-[#FFF6E0]">
                  {review.userId?.fullName || 'Anonymous User'}
                </h4>
                
                {isOwnReview && (
                  <span className="ml-2 px-2 py-0.5 bg-amber-500/20 rounded-full text-xs text-amber-400">
                    You
                  </span>
                )}
              </div>
              
              <div className="flex items-center mt-1 text-sm text-[#D8D9DA]/70">
                <Clock size={12} className="mr-1" />
                <span>
                  {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : 'Recently'}
                </span>
                
                {wasEdited() && (
                  <span className="ml-2 text-xs text-[#D8D9DA]/60">
                    (Edited)
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 px-3 py-1.5 rounded-lg flex items-center space-x-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    fill={star <= review.rating ? "#F59E0B" : "none"}
                    stroke={star <= review.rating ? "#F59E0B" : "#9CA3AF"}
                    size={16}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-amber-400 ml-1">{review.rating}.0</span>
            </div>
            
            <div className="relative ml-2">
              <button 
                onClick={() => setShowActions(!showActions)}
                className="p-2 text-[#D8D9DA] hover:text-[#FFF6E0] transition-colors rounded-full hover:bg-[#272829]"
              >
                <MoreHorizontal size={18} />
              </button>
              
              {showActions && (
                <div className="absolute right-0 mt-1 bg-[#272829] rounded-lg shadow-xl p-2 z-20 w-56">
                  {!isOwnReview ? (
                    <>
                      <button
                        onClick={handleLike}
                        disabled={!authUser}
                        className={`w-full flex items-center text-left px-3 py-2 rounded-lg text-sm ${
                          !authUser 
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#31333A]'
                        }`}
                      >
                        <ThumbsUp size={14} className={isLiked ? 'text-amber-400' : 'text-[#D8D9DA]'} />
                        <span className="ml-2">{isLiked ? 'Unlike Review' : 'Like Review'}</span>
                      </button>
                      
                      <button
                        onClick={handleMarkHelpful}
                        disabled={!authUser}
                        className={`w-full flex items-center text-left px-3 py-2 rounded-lg text-sm ${
                          !authUser
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-[#31333A]'
                        }`}
                      >
                        <CheckCircle size={14} className={isMarkedHelpful ? 'text-amber-400' : 'text-[#D8D9DA]'} />
                        <span className="ml-2">{isMarkedHelpful ? 'Remove Helpful Mark' : 'Mark as Helpful'}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full flex items-center text-left px-3 py-2 rounded-lg text-sm hover:bg-[#31333A]"
                      >
                        <Edit3 size={14} className="text-[#D8D9DA]" />
                        <span className="ml-2">Edit Review</span>
                      </button>
                      
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="w-full flex items-center text-left px-3 py-2 rounded-lg text-sm hover:bg-[#31333A] text-red-400"
                      >
                        <Trash2 size={14} className="text-red-400" />
                        <span className="ml-2">Delete Review</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Review content */}
        <div className="relative">
          <div className="bg-[#272829] p-4 rounded-lg">
            <p className="text-[#FFF6E0] leading-relaxed">
              {review.content}
            </p>
          </div>
          
          {/* Subtle bottom gradient */}
          <div className="absolute bottom-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
        </div>
        
        {/* Review stats and actions */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex space-x-4">
            <button 
              onClick={handleLike}
              disabled={isOwnReview || !authUser}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                !authUser || isOwnReview
                  ? 'cursor-not-allowed opacity-50'
                  : isLiked
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'hover:bg-[#272829] text-[#D8D9DA] hover:text-amber-400'
              }`}
            >
              <ThumbsUp size={14} className={isLiked ? 'text-amber-400' : ''} />
              <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </button>
            
            <button 
              onClick={handleMarkHelpful}
              disabled={isOwnReview || !authUser}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                !authUser || isOwnReview
                  ? 'cursor-not-allowed opacity-50'
                  : isMarkedHelpful
                    ? 'bg-amber-500/10 text-amber-400' 
                    : 'hover:bg-[#272829] text-[#D8D9DA] hover:text-amber-400'
              }`}
            >
              <CheckCircle size={14} className={isMarkedHelpful ? 'text-amber-400' : ''} />
              <span>Helpful ({helpful})</span>
            </button>
          </div>
          
          {/* Edit button for own review (when showEditOption is true) */}
          {(showEditOption && isOwnReview) && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-[#272829] text-[#D8D9DA] hover:text-amber-400 transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          )}
          
          {/* Most helpful badge */}
          {helpful >= 2 && !isOwnReview && (
            <div className="flex items-center text-amber-400">
              <Award size={14} className="mr-1" />
              <span className="text-xs font-medium">Highly Rated</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewItem; 