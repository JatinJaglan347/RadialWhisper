import { useState, useEffect } from 'react';
import { FaStar, FaUser } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore.js';
import { Link } from 'react-router-dom';

import ReviewForm from '../components/ReviewForm';
import ReviewItem from '../components/ReviewItem';

const Reviews = () => {
  const { 
    authUser, 
    reviews, 
    fetchReviews, 
    isLoadingReviews 
  } = useAuthStore();
  
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  const loadReviews = async (page = 1) => {
    try {
      setError(null);
      const response = await fetchReviews(page, 5);
      
      if (response) {
        setPagination(response.pagination);
        
        // Calculate average rating
        if (response.data.length > 0) {
          const total = response.data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating((total / response.data.length).toFixed(1));
        }
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      loadReviews(newPage);
    }
  };

  const handleReviewSubmitted = () => {
    loadReviews(); // Refresh the reviews list
  };

  const getRatingCounters = () => {
    const counters = [0, 0, 0, 0, 0]; // For 1-5 stars
    
    if (!reviews || !Array.isArray(reviews)) return counters;
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        counters[review.rating - 1]++;
      }
    });
    
    return counters;
  };

  const ratingCounters = getRatingCounters();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Customer Reviews
        </h1>
        
        {authUser && (
          <Link 
            to="/my-reviews"
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <FaUser className="mr-2" />
            My Reviews
          </Link>
        )}
      </div>
      
      {/* Rating Summary */}
      {!isLoadingReviews && reviews && reviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-5xl font-bold text-gray-900 dark:text-white mr-2">
                  {averageRating}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar 
                      key={star}
                      className={`${
                        star <= Math.round(averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Based on {pagination.total} reviews
              </p>
            </div>
            
            <div className="w-full md:w-2/3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center mb-2">
                  <div className="flex items-center mr-2 w-16">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
                      {star}
                    </span>
                    <FaStar className="text-yellow-400" />
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-400 h-2.5 rounded-full"
                      style={{ 
                        width: `${pagination.total > 0 ? (ratingCounters[star - 1] / pagination.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 w-10">
                    {ratingCounters[star - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Review Form */}
        <div className="md:col-span-1">
          <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
        </div>
        
        {/* Reviews List */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Recent Reviews
          </h3>
          
          {isLoadingReviews ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <>
              {reviews.map((review) => (
                <ReviewItem 
                  key={review._id} 
                  review={review}
                />
              ))}
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-3 py-1 rounded-md mr-2 ${
                      pagination.page === 1
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded-md mx-1 ${
                        pagination.page === i + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className={`px-3 py-1 rounded-md ml-2 ${
                      pagination.page === pagination.pages
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews; 