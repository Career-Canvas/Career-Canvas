import { Brain, Heart, Star, Clock, Users, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseReviews, CourseReview } from "../services/courseReviewService";
import { Course } from "../data/universityData";

interface CourseCardProps {
  course: Course;
  isMatched?: boolean;
}

const CourseCard = ({ course, isMatched = false }: CourseCardProps) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const fetchedReviews = await getCourseReviews(course.university, course.courseName);
        
        // Sort by rating (highest first) and take top 2
        const topReviews = fetchedReviews
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 2);
        setReviews(topReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Set empty array if API fails
        setReviews([]);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [course.university, course.courseName]);

  const handleSeeMoreReviews = () => {
    // Navigate to course review page and scroll to this course
    const courseId = `${course.university}-${course.courseName}`.replace(/\s+/g, '-').toLowerCase();
    navigate(`/course-reviews?course=${courseId}`);
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
        className={`w-3 h-3 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className={`shadow-card hover:shadow-card-hover transition-all duration-300 ${isMatched ? 'ring-2 ring-success-green border-success-green/20' : ''}`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 bg-gradient-card rounded-t-lg">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{course.courseName}</h3>
            {isMatched && (
              <Badge className="bg-success-green text-white">
                Perfect Match!
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-academic-blue border-academic-blue/30">
              {course.university}
            </Badge>
            <Badge variant="outline" className="text-warm-accent border-warm-accent/30">
              APS: {course.requiredAPS}+
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600/30">
              {Array.isArray(course.personalityType) ? course.personalityType.join(', ') : course.personalityType}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.intake}
            </div>
          </div>
        </div>

        {/* Brain Section */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-academic-blue-light p-2 rounded-full">
              <Brain className="w-5 h-5 text-academic-blue" />
            </div>
            <h4 className="font-semibold text-academic-blue">The Brain</h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">Academic Focus</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{course.brainInfo}</p>
          
          <div className="space-y-2">
            <h5 className="font-medium text-gray-900 dark:text-white">Required Subjects:</h5>
            <div className="flex flex-wrap gap-2">
              {course.requiredSubjects.map((subject, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Heart Section */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <h4 className="font-semibold text-red-500">The Heart</h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">Student Experience</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{course.heartInfo}</p>
        </div>

        {/* Course Reviews Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-600">Student Reviews</h4>
            </div>
            <Badge variant="outline" className="text-xs">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </Badge>
          </div>

          {isLoadingReviews ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-3 mb-4">
              {reviews.map((review, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      {getRatingStars(review.rating || 0)}
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {review.rating}/5
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(review.created_at || '')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-1">
                    "{review.review_text.length > 100 
                      ? review.review_text.substring(0, 100) + '...' 
                      : review.review_text}"
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    - {review.author || 'Anonymous'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Be the first to review this course!</p>
            </div>
          )}

          {/* See More Reviews Button */}
          <button
            onClick={handleSeeMoreReviews}
            className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            See More Reviews
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;