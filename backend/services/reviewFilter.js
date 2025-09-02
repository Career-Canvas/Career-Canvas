import axios from 'axios';

// Hugging Face API configuration - Use the correct toxicity detection model
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/unitary/toxic-bert';

// Test the API key on startup
console.log('🔍 ReviewFilter service loaded');
console.log('🔍 API URL:', HUGGING_FACE_API_URL);
console.log('🔍 API Key exists:', !!process.env.HUGGING_FACE_API_KEY);
if (process.env.HUGGING_FACE_API_KEY) {
  console.log('🔍 API Key length:', process.env.HUGGING_FACE_API_KEY.length);
  console.log('🔍 API Key starts with:', process.env.HUGGING_FACE_API_KEY.substring(0, 10) + '...');
}

/**
 * Analyzes text for toxicity using Hugging Face's toxic-bert model
 * @param {string} text - The text to analyze
 * @returns {Promise<Object>} - Analysis results with toxicity scores
 */
export async function analyzeToxicity(text) {
  try {
    const API_KEY = process.env.HUGGING_FACE_API_KEY;
    
    console.log('🔍 Starting toxicity analysis for text:', text);
    console.log('🔍 API Key exists:', !!API_KEY);
    console.log('🔍 API URL:', HUGGING_FACE_API_URL);
    
    if (!API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    console.log('🔍 Making request to Hugging Face API...');
    
    const response = await axios.post(
      HUGGING_FACE_API_URL,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('🔍 API Response status:', response.status);
    console.log('🔍 API Response data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('❌ Error analyzing toxicity:', error.message);
    console.error('❌ Full error:', error);
    
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    
    throw new Error(`Failed to analyze text toxicity: ${error.message}`);
  }
}

/**
 * Generates a detailed reason for why content was flagged as offensive
 * @param {Object} scores - Toxicity scores for each category
 * @param {Object} thresholds - Threshold values for each category
 * @returns {string} - Detailed explanation of the offensive content
 */
function generateDetailedReason(scores, thresholds) {
  const flaggedCategories = [];
  
  Object.entries(thresholds).forEach(([category, threshold]) => {
    const score = scores[category] || 0;
    if (score > threshold) {
      const confidence = (score * 100).toFixed(1);
      const categoryName = category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      flaggedCategories.push(`${categoryName} (${confidence}% confidence)`);
    }
  });
  
  if (flaggedCategories.length === 1) {
    return `Content flagged as ${flaggedCategories[0]}. This content contains language that violates our community guidelines.`;
  } else {
    return `Content flagged for multiple toxicity categories: ${flaggedCategories.join(', ')}. This content contains language that violates our community guidelines in several ways.`;
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
    
    // Debug: Log the raw API response
    console.log('🔍 Raw Hugging Face API response:', JSON.stringify(toxicityResults, null, 2));
    
    // Extract toxicity scores and convert to the format our code expects
    const rawScores = toxicityResults[0];
    console.log('🔍 Raw scores from API:', JSON.stringify(rawScores, null, 2));
    
    // Convert array of {label, score} objects to {category: score} format
    const scores = {};
    rawScores.forEach(item => {
      scores[item.label] = item.score;
    });
    
    console.log('🔍 Converted scores object:', JSON.stringify(scores, null, 2));
    
    // Define thresholds for different toxicity categories (LOWERED for better detection)
    const thresholds = {
      toxic: 0.3,        // Lower threshold for toxic content (was 0.7)
      severe_toxic: 0.2, // Lower threshold for severe toxicity (was 0.6)
      obscene: 0.2,      // Lower threshold for obscene content (was 0.6)
      threat: 0.15,      // Lower threshold for threats (was 0.5)
      insult: 0.2,       // Lower threshold for insults (was 0.6)
      identity_hate: 0.15 // Lower threshold for identity-based hate (was 0.5)
    };

    // Check if any category exceeds thresholds
    console.log('🔍 Checking thresholds against scores:');
    Object.entries(thresholds).forEach(([category, threshold]) => {
      const score = scores[category] || 0;
      const exceeds = score > threshold;
      console.log(`  ${category}: score=${score.toFixed(3)}, threshold=${threshold}, exceeds=${exceeds}`);
    });
    
    const isOffensive = Object.entries(thresholds).some(([category, threshold]) => {
      return scores[category] && scores[category] > threshold;
    });
    
    console.log('🔍 Final result - isOffensive:', isOffensive);

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
        ? generateDetailedReason(scores, thresholds)
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
