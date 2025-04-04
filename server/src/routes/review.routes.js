import express from 'express';
import { 
  createReview, 
  getAllReviews, 
  getReviewById, 
  updateReview, 
  deleteReview, 
  markReviewHelpful,
  likeReview,
  getUserReviews,
  getReviewStats
} from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllReviews);
router.get('/stats', getReviewStats);

// Protected routes (require authentication)
router.post('/', verifyJWT, createReview);

// Get current user's reviews (must be before /:reviewId route)
router.get('/user', verifyJWT, getUserReviews);

// Routes with reviewId parameter
router.get('/:reviewId', getReviewById);
router.put('/:reviewId', verifyJWT, updateReview);
router.delete('/:reviewId', verifyJWT, deleteReview);
router.put('/:reviewId/helpful', verifyJWT, markReviewHelpful);
router.put('/:reviewId/like', verifyJWT, likeReview);

export default router; 