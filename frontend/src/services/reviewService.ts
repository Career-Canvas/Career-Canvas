// Dynamic API base URL that works both locally and on deployed site
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ilostit-aeh2e8a0b9h8bbc4.westeurope-01.azurewebsites.net/api'
  : 'http://localhost:3001/api';

export interface ReviewSubmission {
  reviewText: string;
  universityName: string;
  category: string;
  rating: number;
  author: string;
  email: string;
}

export interface FilterResult {
  isOffensive: boolean;
  isApproved: boolean;
  reason: string;
  toxicityScores?: {
    [key: string]: number;
  };
  highestRisk?: {
    category: string;
    score: number;
    threshold: number;
  };
}

export interface Review {
    id: number;
    created_at: string;
    reviewText: string;
    universityName: string;
    category: string;
    rating: number;
    author: string;
    email: string;
    isApproved: boolean;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: {
    review: Review;
    filterResult: FilterResult;
  };
}

export interface FilterResponse {
  success: boolean;
  data: FilterResult;
  timestamp: string;
}

export interface BatchFilterResponse {
  success: boolean;
  data: {
    totalReviews: number;
    results: Array<{
      index: number;
      review: string;
      isOffensive: boolean;
      isApproved: boolean;
      reason: string;
      toxicityScores?: any;
      highestRisk?: any;
    }>;
  };
  timestamp: string;
}

/**
 * Filter a single review for offensive content
 */
export async function filterReview(reviewText: string): Promise<FilterResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewText }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: FilterResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error filtering review:', error);
    throw new Error(`Failed to filter review: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Filter multiple reviews for offensive content
 */
export async function filterReviewsBatch(reviews: string[]): Promise<BatchFilterResponse['data']> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/filter-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviews }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: BatchFilterResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error batch filtering reviews:', error);
    throw new Error(`Failed to batch filter reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Submit a review with automatic filtering
 */
export async function submitReview(reviewData: ReviewSubmission): Promise<ReviewResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ReviewResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw new Error(`Failed to submit review: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all approved reviews from the database
 */
export async function getReviews(): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error('API returned unsuccessful response for getting reviews.');
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    // Return empty array on failure so the UI doesn't crash
    return [];
  }
}


/**
 * Check if the review API is healthy
 */
export async function checkReviewAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/health`);
    return response.ok;
  } catch (error) {
    console.error('Review API health check failed:', error);
    return false;
  }
}

/**
 * Get toxicity level description based on score
 */
export function getToxicityLevel(score: number): string {
  if (score < 0.3) return 'Low';
  if (score < 0.6) return 'Medium';
  if (score < 0.8) return 'High';
  return 'Very High';
}

/**
 * Get toxicity category display name
 */
export function getToxicityCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    toxic: 'Toxic',
    severe_toxic: 'Severely Toxic',
    obscene: 'Obscene',
    threat: 'Threatening',
    insult: 'Insulting',
    identity_hate: 'Identity Hate'
  };
  
  return categoryNames[category] || category.replace('_', ' ');
}

