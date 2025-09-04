// Course Review Service - Frontend client for backend API
// This service calls the backend API which handles Supabase database operations

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface CourseReview {
  id?: string;
  created_at?: string;
  university_name: string;
  course_name: string;
  review_text: string;
  author?: string;
  email?: string;
  rating?: number;
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

export interface CourseReviewResponse {
  success: boolean;
  message: string;
  data?: {
    review: CourseReview;
    filterResult: FilterResult;
  };
}

/**
 * Submit a course review to the backend API
 * The backend handles Supabase database operations
 */
export async function submitCourseReview(reviewData: CourseReview): Promise<CourseReviewResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/course-reviews/submit`, {
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

    const result = await response.json();
    return {
      success: true,
      message: result.message || "Course review submitted successfully",
      data: result.data
    };
  } catch (error) {
    console.error('Error submitting course review:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to submit course review"
    };
  }
}

/**
 * Get course reviews for a specific course from the backend API
 */
export async function getCourseReviews(university: string, course: string): Promise<CourseReview[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/course-reviews/${encodeURIComponent(university)}/${encodeURIComponent(course)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('API returned unsuccessful response for getting course reviews.');
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error fetching course reviews:', error);
    return [];
  }
}

/**
 * Get all approved course reviews from the backend API
 */
export async function getAllCourseReviews(): Promise<CourseReview[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/course-reviews`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('API returned unsuccessful response for getting all course reviews.');
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error fetching all course reviews:', error);
    return [];
  }
}

/**
 * Filter a single course review for offensive content
 */
export async function filterCourseReview(reviewText: string): Promise<FilterResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/course-reviews/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewText }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error filtering course review:', error);
    throw new Error(`Failed to filter course review: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Filter multiple course reviews for offensive content
 */
export async function filterCourseReviewsBatch(reviews: string[]): Promise<Array<{
  index: number;
  review: string;
  isOffensive: boolean;
  isApproved: boolean;
  reason: string;
  toxicityScores?: any;
  highestRisk?: any;
}>> {
  try {
    const response = await fetch(`${API_BASE_URL}/course-reviews/filter-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviews }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.results;
  } catch (error) {
    console.error('Error batch filtering course reviews:', error);
    throw new Error(`Failed to batch filter course reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if the course review service is healthy
 */
export async function checkCourseReviewServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/course-reviews/health`);
    return response.ok;
  } catch (error) {
    console.error('Course review service health check failed:', error);
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
    severe_toxicity: 'Severely Toxic',
    obscene: 'Obscene',
    threat: 'Threatening',
    insult: 'Insulting',
    identity_hate: 'Identity Hate',
    profanity: 'Profanity',
    sexually_explicit: 'Sexually Explicit'
  };
  
  return categoryNames[category] || category.replace('_', ' ');
}
