import { useEffect, useState } from 'react';
import { FaStar, FaThumbsUp, FaRegThumbsUp, FaCheckCircle, FaRegCheckCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore.js';
import { toast } from 'react-hot-toast';

const ReviewItem = ({ review }) => {
  const { authUser, likeReview, markReviewHelpful } = useAuthStore();
  const [likes, setLikes] = useState(review.likes || 0);
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isMarkedHelpful, setIsMarkedHelpful] = useState(false);

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
  }, [review.likes, review.helpful]);
  
  // Check if review was actually edited (content changed)
  // We determine this by checking if the timestamps differ by more than 1 minute
  // This helps avoid showing "Edited" for mere like/helpful interactions
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
      toast.error('Please login to like reviews');
      return;
    }
    
    if (isOwnReview) {
      toast.error('You cannot like your own review');
      return;
    }
    
    try {
      const response = await likeReview(review._id);
      
      if (response) {
        // Update local state based on API response
        setLikes(response.data.likes);
        setIsLiked(!isLiked); // Toggle the liked state
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  const handleMarkHelpful = async () => {
    if (!authUser) {
      toast.error('Please login to mark reviews as helpful');
      return;
    }
    
    if (isOwnReview) {
      toast.error('You cannot mark your own review as helpful');
      return;
    }
    
    try {
      const response = await markReviewHelpful(review._id);
      
      if (response) {
        // Update local state based on API response
        setHelpful(response.data.helpful);
        setIsMarkedHelpful(!isMarkedHelpful); // Toggle the helpful state
      }
    } catch (error) {
      console.error('Error toggling helpful mark:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 mr-3">
            {review.userId?.profileImageURL ? (
              <img 
                src={review.userId.profileImageURL} 
                alt={`${review.userId.fullName}'s profile`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-300 text-xl font-bold">
                {review.userId?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {review.userId?.fullName || 'Anonymous User'}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : 'Recently'}
            </p>
          </div>
        </div>
        
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar 
              key={star}
              className={`${
                star <= review.rating
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`} 
            />
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-700 dark:text-gray-300">
          {review.content}
        </p>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLike}
            disabled={isOwnReview || !authUser}
            className={`flex items-center space-x-1 text-sm ${
              !authUser
                ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                : isOwnReview 
                  ? 'cursor-not-allowed text-gray-400 dark:text-gray-600' 
                  : isLiked
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
            }`}
          >
            {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
            <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
          </button>
          
          <button 
            onClick={handleMarkHelpful}
            disabled={isOwnReview || !authUser}
            className={`flex items-center space-x-1 text-sm ${
              !authUser
                ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                : isOwnReview 
                  ? 'cursor-not-allowed text-gray-400 dark:text-gray-600' 
                  : isMarkedHelpful
                    ? 'text-green-500 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400'
            }`}
          >
            {isMarkedHelpful ? <FaCheckCircle /> : <FaRegCheckCircle />}
            <span>Helpful ({helpful})</span>
          </button>
        </div>
        
        {wasEdited() && (
          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
            Edited
          </span>
        )}
      </div>
    </div>
  );
};

export default ReviewItem; 