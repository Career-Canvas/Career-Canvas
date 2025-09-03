import express from 'express';
import { supabase } from '../supabaseClient.js';
import { filterCourseReview, filterCourseReviewsBatch } from '../services/courseReviewFilter.js';

const router = express.Router();

if (!supabase) {
    console.error("Supabase client is not available in routes/courseReviews.js. Check supabaseClient.js and .env file.");
}

/**
 * GET /api/course-reviews
 * Fetch all approved course reviews from the database
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('course_reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching course reviews:', error);
      throw new Error('Could not fetch course reviews from the database.');
    }

    res.json({
      success: true,
      data: data,
    });

  } catch (error) {
    console.error('Error fetching course reviews:', error);
    res.status(500).json({
      error: 'Failed to fetch course reviews',
      message: error.message,
    });
  }
});

/**
 * GET /api/course-reviews/:university/:course
 * Fetch course reviews for a specific university and course
 */
router.get('/:university/:course', async (req, res) => {
  try {
    const { university, course } = req.params;

    if (!university || !course) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'University and course parameters are required'
      });
    }

    const { data, error } = await supabase
      .from('course_reviews')
      .select('*')
      .eq('university_name', university)
      .eq('course_name', course)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching course reviews:', error);
      throw new Error('Could not fetch course reviews from the database.');
    }

    res.json({
      success: true,
      data: data,
    });

  } catch (error) {
    console.error('Error fetching course reviews:', error);
    res.status(500).json({
      error: 'Failed to fetch course reviews',
      message: error.message,
    });
  }
});

/**
 * POST /api/course-reviews/submit
 * Submit a new course review to the database
 */
router.post('/submit', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({
      error: 'Database connection error',
      message: 'Supabase client is not initialized. Check your server logs for errors in supabaseClient.js.'
    });
  }

  try {
    const { 
      university_name, 
      course_name, 
      review_text, 
      author, 
      email, 
      rating 
    } = req.body;

    // Validate required fields
    if (!university_name || !course_name || !review_text) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide university_name, course_name, and review_text'
      });
    }

    // Validate review text length
    if (review_text.trim().length < 10) {
      return res.status(400).json({
        error: 'Review too short',
        message: 'Review must be at least 10 characters long'
      });
    }

    if (review_text.trim().length > 1000) {
      return res.status(400).json({
        error: 'Review too long',
        message: 'Review must be less than 1000 characters'
      });
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return res.status(400).json({
        error: 'Invalid rating',
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    // Validate email format if provided
    if (email && !email.includes('@')) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      });
    }

    // Filter the review for offensive content using AI
    const filterResult = await filterCourseReview(review_text);

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

    // Prepare data for insertion
    const reviewData = {
      university_name,
      course_name,
      review_text: review_text.trim(),
      author: author || null,
      email: email || null,
      rating: rating || null,
      is_approved: filterResult.isApproved // Use AI filtering result
    };

    // Insert the review into Supabase
    const { data: insertedReview, error: dbError } = await supabase
      .from('course_reviews')
      .insert([reviewData])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase error inserting course review:', dbError);
      throw new Error('Could not save course review to the database.');
    }

    res.json({
      success: true,
      message: 'Course review submitted successfully',
      data: {
        review: insertedReview,
        filterResult
      }
    });

  } catch (error) {
    console.error('Error submitting course review:', error);
    res.status(500).json({
      error: 'Failed to submit course review',
      message: error.message
    });
  }
});

/**
 * PUT /api/course-reviews/:id/approve
 * Approve a course review (for admin/moderator use)
 */
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: 'Missing review ID',
        message: 'Review ID is required'
      });
    }

    const { data, error } = await supabase
      .from('course_reviews')
      .update({ is_approved: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error approving course review:', error);
      throw new Error('Could not approve course review in the database.');
    }

    if (!data) {
      return res.status(404).json({
        error: 'Review not found',
        message: 'No course review found with the provided ID'
      });
    }

    res.json({
      success: true,
      message: 'Course review approved successfully',
      data: data
    });

  } catch (error) {
    console.error('Error approving course review:', error);
    res.status(500).json({
      error: 'Failed to approve course review',
      message: error.message
    });
  }
});

/**
 * DELETE /api/course-reviews/:id
 * Delete a course review (for admin/moderator use)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: 'Missing review ID',
        message: 'Review ID is required'
      });
    }

    const { error } = await supabase
      .from('course_reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting course review:', error);
      throw new Error('Could not delete course review from the database.');
    }

    res.json({
      success: true,
      message: 'Course review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course review:', error);
    res.status(500).json({
      error: 'Failed to delete course review',
      message: error.message
    });
  }
});

/**
 * POST /api/course-reviews/filter
 * Filter a single course review for offensive content
 */
router.post('/filter', async (req, res) => {
  try {
    const { reviewText } = req.body;

    if (!reviewText) {
      return res.status(400).json({
        error: 'Missing review text',
        message: 'Review text is required'
      });
    }

    const filterResult = await filterCourseReview(reviewText);

    res.json({
      success: true,
      data: filterResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error filtering course review:', error);
    res.status(500).json({
      error: 'Filtering failed',
      message: error.message
    });
  }
});

/**
 * POST /api/course-reviews/filter-batch
 * Filter multiple course reviews for offensive content
 */
router.post('/filter-batch', async (req, res) => {
  try {
    const { reviews } = req.body;

    if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({
        error: 'Invalid reviews data',
        message: 'Reviews must be an array'
      });
    }

    const results = await filterCourseReviewsBatch(reviews);

    res.json({
      success: true,
      data: {
        totalReviews: reviews.length,
        results
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error batch filtering course reviews:', error);
    res.status(500).json({
      error: 'Batch filtering failed',
      message: error.message
    });
  }
});

/**
 * GET /api/course-reviews/health
 * Health check for the course reviews service
 */
router.get('/health', async (req, res) => {
  try {
    // Test database connection by trying to fetch one record
    const { data, error } = await supabase
      .from('course_reviews')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    res.json({
      status: 'healthy',
      service: 'Course Reviews API',
      timestamp: new Date().toISOString(),
      database: 'connected',
      table: 'course_reviews'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'Course Reviews API',
      timestamp: new Date().toISOString(),
      error: error.message,
      database: 'disconnected'
    });
  }
});

export { router as courseReviewRoutes };
