import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore.js';

const ReviewForm = ({ onReviewSubmitted }) => {
  const { authUser, createReview } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authUser) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter your review');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const reviewData = {
        rating,
        content
      };
      
      const response = await createReview(reviewData);
      
      if (response) {
        setRating(0);
        setContent('');
        
        if (onReviewSubmitted) {
          onReviewSubmitted(response.data);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user not logged in, show login prompt
  if (!authUser) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Write a Review</h3>
        <div className="text-center py-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please login to share your review and rating.
          </p>
          <a 
            href="/login" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Login / Sign Up
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="mb-2 text-gray-700 dark:text-gray-300">Your Rating</p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                className="text-2xl focus:outline-none"
                aria-label={`Rate ${star} out of 5 stars`}
              >
                <FaStar 
                  className={`
                    ${(hoverRating || rating) >= star 
                      ? 'text-yellow-400' 
                      : 'text-gray-300 dark:text-gray-600'
                    }
                    transition-colors duration-150
                  `} 
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="review-content" className="block mb-2 text-gray-700 dark:text-gray-300">
            Your Review
          </label>
          <textarea
            id="review-content"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Share your experience with our app..."
            maxLength={500}
          ></textarea>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {content.length}/500 characters
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !content.trim()}
          className={`px-4 py-2 rounded-md font-medium text-white ${
            isSubmitting || rating === 0 || !content.trim()
              ? 'bg-blue-300 dark:bg-blue-700 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
          } transition-colors duration-150`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm; 