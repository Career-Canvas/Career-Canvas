import { useState, useEffect } from "react";
import { MessageSquare, Star, Calendar, User, Loader2, Plus } from "lucide-react";
import { CourseReview, getCourseReviews } from "../services/courseReviewService";
import CourseReviewForm from "./CourseReviewForm";

interface CourseReviewsDisplayProps {
  university: string;
  course: string;
  onAddReview?: () => void;
}

export default function CourseReviewsDisplay({ university, course, onAddReview }: CourseReviewsDisplayProps) {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Mock reviews for demonstration - will be replaced with actual data fetching
  const mockReviews: CourseReview[] = [
    {
      id: "1",
      author: "Sarah M.",
      university_name: university,
      course_name: course,
      review_text: "This program exceeded my expectations! The professors are incredibly knowledgeable and the practical projects really help solidify the concepts. The career support is excellent too.",
      created_at: "2024-01-15T10:30:00Z",
      rating: 5
    },
    {
      id: "2",
      author: "David K.",
      university_name: university,
      course_name: course,
      review_text: "Great course structure and the lecturers are very approachable. The workload is manageable if you stay organized. Highly recommend for anyone interested in this field.",
      created_at: "2024-01-10T14:20:00Z",
      rating: 4
    }
  ];

  useEffect(() => {
    fetchReviews();
  }, [university, course]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const fetchedReviews = await getCourseReviews(university, course);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to mock data if API fails
      setReviews(mockReviews);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddReview = () => {
    setShowReviewForm(true);
    if (onAddReview) {
      onAddReview();
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // Refresh reviews after submission
    fetchReviews();
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);
  const hasMoreReviews = reviews.length > 2;

  // Show review form if requested
  if (showReviewForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Write a Review for {course} at {university}
          </h3>
          <button
            onClick={() => setShowReviewForm(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to Reviews
          </button>
        </div>
        <CourseReviewForm 
          preSelectedUniversity={university}
          preSelectedCourse={course}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-gray-600 dark:text-gray-400">Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No reviews yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Be the first to share your experience with this degree program!
        </p>
        <button
          onClick={handleAddReview}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Write First Review
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {review.author || "Anonymous"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(review.created_at)}
                  </div>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1">
                {getRatingStars(review.rating || 0)}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  {review.rating}/5
                </span>
              </div>
            </div>

            {/* Review Content */}
            <div className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
              {review.review_text}
            </div>

            {/* Review Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleAddReview}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
              >
                Reply to this review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMoreReviews && (
        <div className="text-center">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
          >
            {showAllReviews ? 'Show Less' : `Show ${reviews.length - 2} More Reviews`}
          </button>
        </div>
      )}

      {/* Add Review Button */}
      <div className="text-center pt-4">
        <button
          onClick={handleAddReview}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Your Review
        </button>
      </div>
    </div>
  );
}
