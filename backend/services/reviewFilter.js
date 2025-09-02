import axios from 'axios';

// Hugging Face API configuration
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/unitary/toxic-bert';
const API_KEY = process.env.HUGGING_FACE_API_KEY;

if (!API_KEY) {
  console.warn('⚠️  HUGGING_FACE_API_KEY not found in environment variables');
}

/**
 * Analyzes text for toxicity using Hugging Face's toxic-bert model
 * @param {string} text - The text to analyze
 * @returns {Promise<Object>} - Analysis results with toxicity scores
 */
export async function analyzeToxicity(text) {
  try {
    if (!API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    const response = await axios.post(
      HUGGING_FACE_API_URL,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error analyzing toxicity:', error.message);
    throw new Error(`Failed to analyze text toxicity: ${error.message}`);
  }
}

/**
 * Determines if a review is offensive based on toxicity analysis
 * @param {string} reviewText - The review text to check
 * @returns {Promise<Object>} - Filtering result with isOffensive flag and details
 */
export async function filterReview(reviewText) {
  try {
    // Basic text validation
    if (!reviewText || typeof reviewText !== 'string') {
      return {
        isOffensive: false,
        isApproved: false,
        reason: 'Invalid review text'
      };
    }

    if (reviewText.trim().length < 10) {
      return {
        isOffensive: false,
        isApproved: false,
        reason: 'Review too short (minimum 10 characters)'
      };
    }

    if (reviewText.length > 1000) {
      return {
        isOffensive: false,
        isApproved: false,
        reason: 'Review too long (maximum 1000 characters)'
      };
    }

    // Analyze toxicity using Hugging Face API
    const toxicityResults = await analyzeToxicity(reviewText);
    
    // Extract toxicity scores
    const scores = toxicityResults[0];
    
    // Define thresholds for different toxicity categories
    const thresholds = {
      toxic: 0.7,        // High threshold for toxic content
      severe_toxic: 0.6, // Lower threshold for severe toxicity
      obscene: 0.6,      // Lower threshold for obscene content
      threat: 0.5,       // Lower threshold for threats
      insult: 0.6,       // Lower threshold for insults
      identity_hate: 0.5 // Lower threshold for identity-based hate
    };

    // Check if any category exceeds thresholds
    const isOffensive = Object.entries(thresholds).some(([category, threshold]) => {
      return scores[category] && scores[category] > threshold;
    });

    // Get the highest scoring category for detailed feedback
    const highestScore = Object.entries(scores).reduce((max, [category, score]) => {
      return score > max.score ? { category, score } : max;
    }, { category: 'none', score: 0 });

    // Determine approval status
    const isApproved = !isOffensive;

    return {
      isOffensive,
      isApproved,
      reason: isOffensive 
        ? `Content flagged as potentially ${highestScore.category.replace('_', ' ')} (confidence: ${(highestScore.score * 100).toFixed(1)}%)`
        : 'Content approved',
      toxicityScores: scores,
      highestRisk: highestScore.category !== 'none' ? {
        category: highestScore.category,
        score: highestScore.score,
        threshold: thresholds[highestScore.category]
      } : null
    };

  } catch (error) {
    console.error('Error filtering review:', error);
    
    // Fallback: reject review if we can't analyze it
    return {
      isOffensive: true,
      isApproved: false,
      reason: `Unable to analyze content: ${error.message}`,
      error: true
    };
  }
}

/**
 * Batch filter multiple reviews
 * @param {Array<string>} reviews - Array of review texts
 * @returns {Promise<Array>} - Array of filtering results
 */
export async function filterReviewsBatch(reviews) {
  try {
    const results = await Promise.all(
      reviews.map(async (review, index) => {
        try {
          const result = await filterReview(review);
          return {
            index,
            review,
            ...result
          };
        } catch (error) {
          return {
            index,
            review,
            isOffensive: true,
            isApproved: false,
            reason: `Error processing review: ${error.message}`,
            error: true
          };
        }
      })
    );

    return results;
  } catch (error) {
    throw new Error(`Batch filtering failed: ${error.message}`);
  }
}
