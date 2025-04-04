import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { FaStar, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const UserReviews = () => {
  const { authUser, fetchUserReviews, updateReview, deleteReview } = useAuthStore();
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editFormData, setEditFormData] = useState({
    rating: 0,
    content: ''
  });

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
          toast.error('Failed to load your reviews');
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
      toast.error('Please select a rating');
      return;
    }

    if (!editFormData.content.trim()) {
      toast.error('Please enter your review content');
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
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        // Remove the deleted review from local state
        setUserReviews(reviews => reviews.filter(review => review._id !== reviewId));
        toast.success('Review deleted successfully');
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      }
    }
  };

  // Render star rating
  const renderStars = (rating, onRatingChange = null) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`${
              star <= rating
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            } ${onRatingChange ? 'cursor-pointer' : ''}`}
            onClick={() => onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!authUser) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
        <p>Please log in to view your reviews.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Reviews</h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2">Loading your reviews...</p>
        </div>
      ) : userReviews.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't written any reviews yet.</p>
          <a 
            href="/reviews" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Write a Review
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {userReviews.map((review) => (
            <div 
              key={review._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              {editingReview === review._id ? (
                // Edit form
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    {renderStars(editFormData.rating, handleRatingChange)}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium mb-2">Review</label>
                    <textarea
                      id="content"
                      name="content"
                      value={editFormData.content}
                      onChange={handleEditChange}
                      rows="4"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaTimes className="mr-1" />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateReview(review._id)}
                      className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <FaCheck className="mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                // Review display
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      {renderStars(review.rating)}
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Posted: {formatDate(review.createdAt)}
                        {review.updatedAt && review.updatedAt !== review.createdAt && (
                          <span className="ml-2 italic">
                            (Edited: {formatDate(review.updatedAt)})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(review)}
                        className="p-2 text-blue-500 hover:text-blue-600"
                        aria-label="Edit review"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-2 text-red-500 hover:text-red-600"
                        aria-label="Delete review"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                  
                  <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-4">{review.likes || 0} likes</span>
                    <span>{review.helpful || 0} marked as helpful</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews; 