import Review from '../models/review.model.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { rating, content } = req.body;
    const userId = req.user._id;

    if (!rating || !content) {
      return res.status(400).json({ message: 'Rating and content are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const newReview = new Review({
      userId,
      rating,
      content,
    });

    const savedReview = await newReview.save();
    
    return res.status(201).json({ 
      success: true,
      data: savedReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    
    // Build query object for filtering
    const query = { isApproved: true };
    
    // Add rating filter if provided
    if (req.query.rating) {
      query.rating = parseInt(req.query.rating);
    }
    
    // Add search query if provided
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { content: searchRegex },
        // Add more fields to search if needed
      ];
    }
    
    // Get total matching documents with the filters
    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);
    
    // Build the query with sort options
    let reviewsQuery = Review.find(query)
      .populate('userId', 'fullName profileImageURL')
      .skip(skip)
      .limit(limit);
    
    // Add sorting if provided
    if (req.query.sort) {
      let sortOption = {};
      
      switch (req.query.sort) {
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        case 'highest':
          sortOption = { rating: -1 };
          break;
        case 'lowest':
          sortOption = { rating: 1 };
          break;
        case 'mostLiked':
          sortOption = { likes: -1 };
          break;
        case 'mostHelpful':
          sortOption = { helpful: -1 };
          break;
        default:
          sortOption = { createdAt: -1 }; // Default to newest
      }
      
      reviewsQuery = reviewsQuery.sort(sortOption);
    } else {
      // Default sort by most recent
      reviewsQuery = reviewsQuery.sort({ createdAt: -1 });
    }
    
    // Execute query
    const reviews = await reviewsQuery.lean();
    
    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total: totalReviews,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get review by ID
export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId)
      .populate('userId', 'fullName profileImageURL')
      .lean();
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    return res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, content } = req.body;
    const userId = req.user._id;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns the review
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
    }
    
    const updates = {};
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      updates.rating = rating;
    }
    
    if (content) {
      updates.content = content;
    }
    
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updates,
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns the review
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }
    
    await Review.findByIdAndDelete(reviewId);
    
    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Initialize helpfulBy array if it doesn't exist
    if (!review.helpfulBy) {
      review.helpfulBy = [];
    }
    
    // Check if user already marked this review as helpful
    const userMarkedIndex = review.helpfulBy.indexOf(userId.toString());
    
    if (userMarkedIndex === -1) {
      // User hasn't marked it as helpful yet, so add the mark
      review.helpfulBy.push(userId);
      review.helpful += 1;
    } else {
      // User already marked it as helpful, so remove the mark
      review.helpfulBy.splice(userMarkedIndex, 1);
      review.helpful -= 1;
    }
    
    // Save without triggering timestamp updates
    await review.save({ timestamps: false });
    
    // Populate the user data before sending response
    const populatedReview = await Review.findById(reviewId)
      .populate('userId', 'fullName profileImageURL')
      .lean();
    
    return res.status(200).json({
      success: true,
      data: populatedReview,
      hasMarked: userMarkedIndex === -1 // Returns true if mark was added, false if removed
    });
  } catch (error) {
    console.error('Error toggling review helpful mark:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Like review
export const likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Initialize likedBy array if it doesn't exist
    if (!review.likedBy) {
      review.likedBy = [];
    }
    
    // Check if user already liked the review
    const userLikedIndex = review.likedBy.indexOf(userId.toString());
    
    if (userLikedIndex === -1) {
      // User hasn't liked the review yet, so add the like
      review.likedBy.push(userId);
      review.likes += 1;
    } else {
      // User already liked the review, so remove the like
      review.likedBy.splice(userLikedIndex, 1);
      review.likes -= 1;
    }
    
    // Save without triggering timestamp updates
    await review.save({ timestamps: false });
    
    // Populate the user data before sending response
    const populatedReview = await Review.findById(reviewId)
      .populate('userId', 'fullName profileImageURL')
      .lean();
    
    return res.status(200).json({
      success: true,
      data: populatedReview,
      hasLiked: userLikedIndex === -1 // Returns true if like was added, false if removed
    });
  } catch (error) {
    console.error('Error toggling review like:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get reviews by current authenticated user
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName profileImageURL')
      .lean();
    
    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// New function to get overall review statistics
export const getReviewStats = async (req, res) => {
  try {
    // Get all reviews (only the necessary fields for stats)
    const allReviews = await Review.find({ isApproved: true })
      .select('rating likes helpful likedBy helpfulBy')
      .lean();
    
    // Calculate overall rating
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : 0;
    
    // Calculate rating distribution
    const ratingDistribution = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 stars
    allReviews.forEach(review => {
      ratingDistribution[review.rating - 1]++;
    });
    
    // Calculate total likes and helpful
    const totalLikes = allReviews.reduce((sum, review) => sum + (review.likes || 0), 0);
    const totalHelpful = allReviews.reduce((sum, review) => sum + (review.helpful || 0), 0);
    
    return res.status(200).json({
      success: true,
      data: {
        totalReviews: allReviews.length,
        averageRating,
        ratingDistribution,
        totalLikes,
        totalHelpful
      }
    });
  } catch (error) {
    console.error('Error fetching review statistics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 