import express from 'express';
const router = express.Router();

/**
 * @route   GET /api/test/health
 * @desc    Health check endpoint to verify API is working
 * @access  Public
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is working correctly',
        timestamp: new Date().toISOString()
    });
});

export default router; 