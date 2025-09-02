import express from 'express';
import { filterReview, filterReviewsBatch } from '../services/reviewFilter.js';

const router = express.Router();

/**
 * POST /api/reviews/filter
 * Filter a single review for offensive content
 */
router.post('/filter', async (req, res) => {
  try {
    const { reviewText } = req.body;

    if (!reviewText) {
      return res.status(400).json({
        error: 'Missing review text',
        message: 'Please provide reviewText in the request body'
      });
    }

    const result = await filterReview(reviewText);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error filtering review:', error);
    res.status(500).json({
      error: 'Failed to filter review',
      message: error.message
    });
  }
});

/**
 * POST /api/reviews/filter-batch
 * Filter multiple reviews for offensive content
 */
router.post('/filter-batch', async (req, res) => {
  try {
    const { reviews } = req.body;

    if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({
        error: 'Invalid reviews data',
        message: 'Please provide reviews as an array in the request body'
      });
    }

    if (reviews.length > 10) {
      return res.status(400).json({
        error: 'Too many reviews',
        message: 'Maximum 10 reviews can be processed in a single batch'
      });
    }

    const results = await filterReviewsBatch(reviews);
    
    res.json({
      success: true,
      data: {
        totalReviews: reviews.length,
        results
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error batch filtering reviews:', error);
    res.status(500).json({
      error: 'Failed to filter reviews',
      message: error.message
    });
  }
});

/**
 * POST /api/reviews/submit
 * Submit a review with automatic filtering
 */
router.post('/submit', async (req, res) => {
  try {
    const { 
      reviewText, 
      universityName, 
      category, 
      rating, 
      author 
    } = req.body;

    // Validate required fields
    if (!reviewText || !universityName || !category || !rating || !author) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide reviewText, universityName, category, rating, and author'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({
        error: 'Invalid rating',
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    // Filter the review for offensive content
    const filterResult = await filterReview(reviewText);

    if (filterResult.isOffensive) {
      return res.status(400).json({
        error: 'Review rejected',
        message: filterResult.reason,
        data: {
          isOffensive: true,
          isApproved: false,
          reason: filterResult.reason,
          toxicityScores: filterResult.toxicityScores
        }
      });
    }

    // If review passes filtering, you would typically save it to a database here
    // For now, we'll just return success
    const reviewData = {
      id: Date.now().toString(), // Generate a temporary ID
      reviewText,
      universityName,
      category,
      rating,
      author,
      timestamp: new Date().toISOString(),
      isApproved: true
    };

    res.json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        review: reviewData,
        filterResult
      }
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      error: 'Failed to submit review',
      message: error.message
    });
  }
});

/**
 * GET /api/reviews/health
 * Health check for the review filtering service
 */
router.get('/health', async (req, res) => {
  try {
    // Test the filtering service with a simple, non-offensive text
    const testResult = await filterReview('This is a test review for health check.');
    
    res.json({
      status: 'healthy',
      service: 'Review Filtering API',
      timestamp: new Date().toISOString(),
      testResult: {
        isOffensive: testResult.isOffensive,
        isApproved: testResult.isApproved,
        reason: testResult.reason
      }
    });

  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'Review Filtering API',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export { router as reviewRoutes };
