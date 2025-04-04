import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Star, Edit2, Trash2, Check, X, FileText, Calendar, User, ArrowLeft, Save, MessageSquare, Shield, ThumbsUp, CheckCircle } from 'lucide-react';

const UserReviews = ({ onReviewDeleted }) => {
  const { authUser, fetchUserReviews, updateReview, deleteReview } = useAuthStore();
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editFormData, setEditFormData] = useState({
    rating: 0,
    content: ''
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch user's reviews on component mount
  useEffect(() => {
    const loadReviews = async () => {
      if (authUser?.data?.user?._id) {
        setLoading(true);
        try {
          const result = await fetchUserReviews();
          setUserReviews(result?.data || []);
        } catch (error) {
          console.error('Error fetching user reviews:', error);
          toast.error('Failed to load your reviews', {
            style: {
              background: '#31333A',
              color: '#FFF6E0',
              borderRadius: '10px',
            },
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadReviews();
  }, [authUser, fetchUserReviews]);

  // Start editing a review
  const handleEditClick = (review) => {
    setEditingReview(review._id);
    setEditFormData({
      rating: review.rating,
      content: review.content
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditFormData({
      rating: 0,
      content: ''
    });
  };

  // Handle input changes in edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle rating selection in edit form
  const handleRatingChange = (newRating) => {
    setEditFormData(prev => ({
      ...prev,
      rating: newRating
    }));
  };

  // Submit review update
  const handleUpdateReview = async (reviewId) => {
    if (!editFormData.rating) {
      toast.error('Please select a rating', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
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
      });
      return;
    }

    try {
      const result = await updateReview(reviewId, editFormData);
      if (result) {
        // Update the local state with the updated review
        setUserReviews(reviews => 
          reviews.map(review => 
            review._id === reviewId ? { ...review, ...editFormData, updatedAt: new Date().toISOString() } : review
          )
        );
        setEditingReview(null);
        
        toast.success('Review updated successfully', {
          style: {
            background: '#31333A',
            color: '#FFF6E0',
            borderRadius: '10px',
          },
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
      });
    }
  };

  // Delete confirmation
  const handleDeleteClick = (reviewId) => {
    setConfirmDelete(reviewId);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      // Remove the deleted review from local state
      setUserReviews(reviews => reviews.filter(review => review._id !== reviewId));
      setConfirmDelete(null);
      
      toast.success('Review deleted successfully', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
      });
      
      // If there are no reviews left after deletion and onReviewDeleted is provided,
      // call it to switch back to all reviews
      if (userReviews.length === 1 && onReviewDeleted) {
        onReviewDeleted();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  if (!authUser) {
    return (
      <div className="bg-[#31333A] rounded-xl shadow-lg overflow-hidden p-6">
        <div className="flex flex-col items-center text-center">
          <Shield size={36} className="text-[#D8D9DA]/50 mb-3" />
          <h3 className="text-xl font-medium mb-2 text-[#FFF6E0]">Authentication Required</h3>
          <p className="text-[#D8D9DA] mb-4">
            Please sign in to view and manage your reviews.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-[#FFF6E0] text-[#272829] rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#31333A] rounded-xl shadow-lg overflow-hidden p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#FFF6E0]/20 border-t-[#FFF6E0] rounded-full animate-spin mb-4"></div>
          <p className="text-[#D8D9DA]">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Section header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-[#272829] flex items-center justify-center mr-3 text-[#FFF6E0]">
            <User size={20} />
          </div>
          
          <div>
            <h2 className="font-medium text-[#FFF6E0]">Your Reviews</h2>
            <div className="text-sm text-[#D8D9DA]/70">
              {userReviews.length} {userReviews.length === 1 ? 'review' : 'reviews'} submitted
            </div>
          </div>
        </div>
        
        {onReviewDeleted && (
          <button 
            onClick={onReviewDeleted}
            className="flex items-center px-4 py-2 rounded-lg bg-[#272829] text-[#D8D9DA] hover:bg-opacity-80 transition-colors text-sm"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to All Reviews
          </button>
        )}
      </div>
      
      {userReviews.length === 0 ? (
        <div className="bg-[#31333A] rounded-xl p-8 text-center">
          <MessageSquare size={40} className="mx-auto mb-4 text-[#D8D9DA]/40" />
          <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
          <p className="text-[#D8D9DA] mb-6">
            You haven't shared any reviews yet. Start contributing to the community by sharing your experience.
          </p>
          {onReviewDeleted && (
            <button 
              onClick={onReviewDeleted}
              className="px-4 py-2 bg-[#FFF6E0] text-[#272829] rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {userReviews.map((review) => {
            if (confirmDelete === review._id) {
              return (
                <div 
                  key={review._id}
                  className="bg-[#31333A] rounded-xl overflow-hidden shadow-md border border-red-500/30"
                >
                  <div className="p-5">
                    <div className="flex items-center text-red-400 mb-3">
                      <Trash2 size={18} className="mr-2" />
                      <h3 className="font-medium">Confirm Deletion</h3>
                    </div>
                    
                    <p className="text-[#D8D9DA] text-sm mb-4">
                      Are you sure you want to delete this review? This action cannot be undone.
                    </p>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleCancelDelete}
                        className="px-4 py-2 bg-[#272829] text-[#D8D9DA] hover:bg-opacity-80 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg flex items-center"
                      >
                        <Trash2 size={16} className="mr-1.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            
            if (editingReview === review._id) {
              return (
                <div key={review._id} className="bg-[#31333A] rounded-xl overflow-hidden shadow-md">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-[#FFF6E0] flex items-center">
                        <Edit2 size={18} className="mr-2" />
                        Edit Your Review
                      </h3>
                      
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 text-[#D8D9DA] hover:text-red-400 rounded-full hover:bg-[#272829]"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#D8D9DA] mb-2">Rating</label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingChange(star)}
                              className="relative p-1 transition-transform hover:scale-110"
                            >
                              <Star 
                                size={24}
                                fill={editFormData.rating >= star ? "#FFC107" : "none"}
                                className={`${
                                  editFormData.rating >= star ? 'text-yellow-400' : 'text-gray-600'
                                }`} 
                              />
                              
                              {/* Connecting line between stars */}
                              {star < 5 && (
                                <div 
                                  className={`absolute top-1/2 left-full h-0.5 w-1.5 -translate-y-1/2 transition-colors duration-200 ${
                                    editFormData.rating >= star + 1 ? 'bg-yellow-400' : 'bg-gray-600'
                                  }`}
                                ></div>
                              )}
                            </button>
                          ))}
                          
                          {editFormData.rating > 0 && (
                            <span className="ml-2 text-[#D8D9DA]">{editFormData.rating}.0</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-[#D8D9DA] mb-2">Review</label>
                        <textarea
                          name="content"
                          value={editFormData.content}
                          onChange={handleEditChange}
                          rows="4"
                          className="w-full px-3 py-2 bg-[#272829] rounded-lg text-[#FFF6E0] focus:outline-none resize-none"
                          maxLength="500"
                        ></textarea>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-[#D8D9DA]/70">
                            {editFormData.content.length}/500
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-[#272829] text-[#D8D9DA] hover:bg-opacity-80 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateReview(review._id)}
                          className="px-4 py-2 bg-[#FFF6E0] text-[#272829] hover:bg-opacity-90 rounded-lg flex items-center"
                        >
                          <Save size={16} className="mr-1.5" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <div key={review._id} className="bg-[#31333A] rounded-xl overflow-hidden shadow-md">
                <div className="p-5">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center space-x-2 mb-1 text-[#D8D9DA]/70 text-sm">
                      <Calendar size={14} />
                      <span>
                        {formatDate(review.createdAt)}
                      </span>
                      {review.createdAt !== review.updatedAt && (
                        <span className="text-[#D8D9DA]/50 text-xs">(Edited)</span>
                      )}
                    </div>
                    
                    <div className="flex items-center bg-[#272829] px-2 py-1 rounded-lg">
                      <div className="flex mr-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            size={14}
                            fill={star <= review.rating ? "#FFC107" : "none"}
                            className={`${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-600'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-[#FFF6E0]">{review.rating}.0</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#272829] rounded-lg p-4 mb-3">
                    <p className="text-[#FFF6E0]/90 leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3 text-sm">
                      <div className="flex items-center text-[#D8D9DA]/70">
                        <ThumbsUp size={14} className="mr-1.5" />
                        <span>{review.likes || 0}</span>
                      </div>
                      <div className="flex items-center text-[#D8D9DA]/70">
                        <CheckCircle size={14} className="mr-1.5" />
                        <span>{review.helpful || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(review)}
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#272829] hover:bg-[#272829]/80 text-[#D8D9DA] text-sm"
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(review._id)}
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#272829] hover:bg-[#272829]/80 text-red-400 text-sm"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
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

export default UserReviews; 