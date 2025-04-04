import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore.js';
import { Star, Send, User, Lock, AlertCircle } from 'lucide-react';

const ReviewForm = ({ onReviewAdded }) => {
  const { authUser, createReview } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      toast.error('Please log in to submit a review', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
      });
      return;
    }

    if (!rating) {
      toast.error('Please select a rating', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
      });
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter your review content', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createReview({ rating, content });
      
      // Clear form
      setRating(0);
      setContent('');
      
      // Show success toast
      toast.success('Review submitted successfully!', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
      });
      
      // Notify parent component
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.', {
        style: {
          background: '#31333A',
          color: '#FFF6E0',
          borderRadius: '10px',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Character count colors
  const getCharCountColor = () => {
    const length = content.length;
    if (length === 0) return 'text-[#D8D9DA]/50';
    if (length < 20) return 'text-red-400';
    if (length < 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (!authUser) {
    return (
      <div className="bg-[#31333A] rounded-xl overflow-hidden p-6 relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFF6E0]/0 via-[#FFF6E0]/30 to-[#FFF6E0]/0"></div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-3 text-[#FFF6E0]">Share Your Experience</h3>
          
          <p className="text-[#D8D9DA] mb-6">
            Log in to share your review and help others make informed decisions.
          </p>
          
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#272829] flex items-center justify-center">
              <Lock size={32} className="text-[#D8D9DA]" />
            </div>
          </div>
          
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full py-3 px-4 bg-[#FFF6E0] text-[#272829] font-medium rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
          >
            Log In to Write a Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#31333A] rounded-xl overflow-hidden p-6 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFF6E0]/0 via-[#FFF6E0]/30 to-[#FFF6E0]/0"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-4 text-[#FFF6E0]">Share Your Experience</h3>
        
        <form onSubmit={handleSubmit}>
          {/* Rating stars */}
          <div className="mb-5">
            <label className="block text-sm text-[#D8D9DA] mb-2">Rate your experience</label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="relative p-1.5 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    size={28}
                    fill={(hoverRating || rating) >= star ? "#FFC107" : "none"}
                    className={`
                      transition-all duration-200
                      ${(hoverRating || rating) >= star
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                      }
                      ${rating >= star && 'filter drop-shadow(0 0 2px rgba(255, 193, 7, 0.5))'}
                    `} 
                  />
                  
                  {/* Connecting line between stars */}
                  {star < 5 && (
                    <div 
                      className={`absolute top-1/2 left-full h-0.5 w-1.5 -translate-y-1/2 transition-colors duration-200 ${
                        (hoverRating || rating) >= star + 1 ? 'bg-yellow-400' : 'bg-gray-600'
                      }`}
                    ></div>
                  )}
                </button>
              ))}
              
              {rating > 0 && (
                <span className="ml-3 font-medium text-[#FFF6E0]">{rating}.0</span>
              )}
            </div>
          </div>
          
          {/* Review content */}
          <div className="mb-5">
            <label className="block text-sm text-[#D8D9DA] mb-2">Write your review</label>
            <div className={`relative border-2 rounded-lg transition-all duration-200 ${
              isFocused 
                ? 'border-[#FFF6E0]/30 shadow-[0_0_10px_rgba(255,246,224,0.05)]' 
                : 'border-[#272829]'
            }`}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Share your thoughts and experiences..."
                rows="4"
                className="w-full px-4 py-3 bg-[#272829] rounded-lg text-[#FFF6E0] placeholder-[#D8D9DA]/50 resize-none focus:outline-none"
                maxLength="500"
              />
              
              {/* Character counter */}
              <div className="absolute bottom-2 right-3">
                <span className={`text-xs ${getCharCountColor()}`}>
                  {content.length}/500
                </span>
              </div>
            </div>
            
            {content.length > 0 && content.length < 20 && (
              <div className="flex items-center mt-2 text-xs text-red-400">
                <AlertCircle size={12} className="mr-1" />
                <span>Please write at least 20 characters</span>
              </div>
            )}
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || content.length < 20}
              className={`
                px-5 py-2.5 rounded-lg font-medium flex items-center
                ${isSubmitting || content.length < 20
                  ? 'bg-[#272829] text-[#D8D9DA]/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] hover:shadow-md hover:opacity-90'
                }
                transition-all duration-200
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#272829] border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm; 