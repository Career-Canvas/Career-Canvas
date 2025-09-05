import { useState, useEffect } from "react";
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle, BookOpen, GraduationCap, Star } from "lucide-react";
import { universities, courses } from "../data/universityData";
import { submitCourseReview, filterCourseReview, FilterResult, getToxicityLevel, getToxicityCategoryName } from "../services/courseReviewService";

interface CourseReview {
  author?: string;
  email?: string;
  university: string;
  course: string;
  reviewText: string;
  rating?: number;
}

interface CourseReviewFormProps {
  preSelectedUniversity?: string;
  preSelectedCourse?: string;
  onReviewSubmitted?: () => void;
}

export default function CourseReviewForm({ preSelectedUniversity, preSelectedCourse, onReviewSubmitted }: CourseReviewFormProps) {
  const [formData, setFormData] = useState<CourseReview>({
    author: "",
    email: "",
    university: preSelectedUniversity || "",
    course: preSelectedCourse || "",
    reviewText: "",
    rating: 5
  });

  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [toxicityResult, setToxicityResult] = useState<FilterResult | null>(null);
  const [aiTestPassed, setAiTestPassed] = useState(false);

  // Update available courses when university changes
  useEffect(() => {
    if (formData.university) {
      const universityCourses = courses
        .filter(course => course.university === formData.university)
        .map(course => course.courseName);
      setAvailableCourses(universityCourses);
      // Reset course selection when university changes (unless it's pre-selected)
      if (!preSelectedCourse) {
        setFormData(prev => ({ ...prev, course: "" }));
      }
    } else {
      setAvailableCourses([]);
    }
  }, [formData.university, preSelectedCourse]);

  // Initialize available courses when component mounts with pre-selected values
  useEffect(() => {
    if (preSelectedUniversity) {
      const universityCourses = courses
        .filter(course => course.university === preSelectedUniversity)
        .map(course => course.courseName);
      setAvailableCourses(universityCourses);
    }
  }, [preSelectedUniversity]);

  const handleInputChange = (field: keyof CourseReview, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear previous results when form changes
    setToxicityResult(null);
    setError(null);
    setSuccess(false);
    setAiTestPassed(false);
  };

  const handleCheckReview = async () => {
    if (!formData.reviewText.trim()) {
      setError("Please enter your review text first.");
      return;
    }

    if (formData.reviewText.trim().length < 10) {
      setError("Review must be at least 10 characters long.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setToxicityResult(null);

    try {
      // Use backend AI filtering to check the review
      const filterResult = await filterCourseReview(formData.reviewText);
      setToxicityResult(filterResult);
      
      if (filterResult.isOffensive) {
        setError(filterResult.reason);
        setAiTestPassed(false);
      } else {
        setAiTestPassed(true);
        setError(null);
      }
    } catch (error) {
      console.error('Error checking review:', error);
      setError("An error occurred while checking your review. Please try again.");
      setAiTestPassed(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiTestPassed) {
      setError("Please pass the AI content check before submitting your review.");
      return;
    }

    if (!formData.reviewText.trim() || !formData.university || !formData.course) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare data for storage
      const reviewData = {
        university_name: formData.university,
        course_name: formData.course,
        review_text: formData.reviewText,
        author: formData.author || null,
        email: formData.email || null,
        rating: formData.rating || null
      };

      // Submit the review
      const response = await submitCourseReview(reviewData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          author: "",
          email: "",
          university: preSelectedUniversity || "",
          course: preSelectedCourse || "",
          reviewText: "",
          rating: 5
        });
        setToxicityResult(null);
        setAiTestPassed(false);
        
        // Call the callback to refresh review count
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        setError(response.message || "Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError("An error occurred while submitting your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Leave Your Course Review
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {preSelectedUniversity && preSelectedCourse 
              ? `Share your experience with ${preSelectedCourse} at ${preSelectedUniversity}`
              : "Share your experience to help future students make informed decisions"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Author Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* University and Course Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                University <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                required
                disabled={!!preSelectedUniversity}
              >
                <option value="">Select University</option>
                {universities.map((uni) => (
                  <option key={uni.shortName} value={uni.shortName}>
                    {uni.name}
                  </option>
                ))}
              </select>
              {preSelectedUniversity && (
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Pre-selected for {preSelectedUniversity}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Degree Program <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                required
                disabled={!formData.university || !!preSelectedCourse}
              >
                <option value="">Select Course</option>
                {availableCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              {preSelectedCourse && (
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Pre-selected for {preSelectedCourse}
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {getRatingStars(formData.rating || 5)}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {formData.rating}/5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reviewText}
              onChange={(e) => handleInputChange('reviewText', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Share your experience with this degree program. What did you like? What could be improved? What advice would you give to future students?"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Minimum 10 characters. Your review will be analyzed for appropriate content.
            </p>
          </div>

          {/* AI Content Check Section */}
          <div className="border-t pt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Content Safety Check
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your review must pass our AI content filter before submission
              </p>
            </div>

            {/* Check Review Button */}
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={handleCheckReview}
                disabled={isAnalyzing || !formData.reviewText.trim() || formData.reviewText.trim().length < 10}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking Content...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Check Review
                  </>
                )}
              </button>
            </div>

            {/* AI Test Status */}
            {aiTestPassed && (
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-green-800 dark:text-green-200">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">AI Test Passed! ✓</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Your review content is safe and ready for submission
                </p>
              </div>
            )}

            {/* Toxicity Analysis Result */}
            {toxicityResult && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-800 dark:text-purple-200 font-medium">Content Analysis Complete</span>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Result:</strong> {toxicityResult.reason}
                  </div>

                  {toxicityResult.toxicityScores && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Toxicity Scores:</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(toxicityResult.toxicityScores).map(([category, score]) => (
                          <div key={category} className="text-xs">
                            <div className="font-medium text-gray-600 dark:text-gray-400 capitalize">
                              {getToxicityCategoryName(category)}
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    score < 0.3 ? 'bg-green-500' : score < 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${score * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {Math.round(score * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {toxicityResult.highestRisk && (
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Highest Risk:</strong> {getToxicityCategoryName(toxicityResult.highestRisk.category)} 
                      ({Math.round(toxicityResult.highestRisk.score * 100)}% - Threshold: {Math.round(toxicityResult.highestRisk.threshold * 100)}%)
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || !aiTestPassed}
              className={`px-8 py-3 font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                aiTestPassed 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting Review...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>
          </div>

          {/* Submit Button Help Text */}
          {!aiTestPassed && (
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete the AI content check above to enable review submission
              </p>
            </div>
          )}
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 dark:text-red-200 font-medium">Error</span>
            </div>
            <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 dark:text-green-200 font-medium">Success!</span>
            </div>
            <p className="text-green-700 dark:text-green-300 mt-1">
              Your review has been submitted successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
