import { useState, useEffect } from "react";
import { BookOpen, MessageSquare, Star, Users, TrendingUp } from "lucide-react";
import CourseReviewForm from "../components/CourseReviewForm";
import CourseReviewsDisplay from "../components/CourseReviewsDisplay";
import { courses, universities } from "../data/universityData";

export default function CourseReviewDemo() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [selectedUniversity, setSelectedUniversity] = useState(courses[0].university);
  const [activeTab, setActiveTab] = useState('overview');

  // Handle URL parameters for scrolling to specific course
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = urlParams.get('course');
    
    if (courseParam) {
      // Find the course based on the parameter
      const targetCourse = courses.find(course => {
        const courseId = `${course.university}-${course.courseName}`.replace(/\s+/g, '-').toLowerCase();
        return courseId === courseParam;
      });
      
      if (targetCourse) {
        setSelectedCourse(targetCourse);
        setSelectedUniversity(targetCourse.university);
        setActiveTab('display');
        
        // Scroll to the course after a short delay to ensure the page is rendered
        setTimeout(() => {
          const courseElement = document.getElementById(`course-${targetCourse.university}-${targetCourse.courseName}`.replace(/\s+/g, '-').toLowerCase());
          if (courseElement) {
            courseElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 500);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <a 
              href="/" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </a>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">Course Reviews</span>
          </nav>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Course Review System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the new course review system that helps students make informed decisions about their academic journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">24</h3>
            <p className="text-gray-600 dark:text-gray-400">Degree Programs</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">156</h3>
            <p className="text-gray-600 dark:text-gray-400">Student Reviews</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">3</h3>
            <p className="text-gray-600 dark:text-gray-400">Universities</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">98%</h3>
            <p className="text-gray-600 dark:text-gray-400">Content Safe</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Custom Tabs */}
          <div className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              System Overview
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'form'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Review Form
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'display'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Reviews Display
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Features */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Key Features</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium">AI-Powered Content Moderation</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Uses Google's Perspective API to automatically filter inappropriate content
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium">Dynamic Course Selection</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Course options automatically update based on selected university
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium">Real-time Toxicity Analysis</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Instant feedback on content safety with detailed scoring
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium">Integrated Review Display</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Reviews seamlessly integrated into course cards and dedicated sections
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* How It Works */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">How It Works</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-medium">1</div>
                        <span className="text-sm">Student selects university and degree program</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-medium">2</div>
                        <span className="text-sm">Writes review and submits for analysis</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-medium">3</div>
                        <span className="text-sm">AI analyzes content for toxicity and safety</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-medium">4</div>
                        <span className="text-sm">Safe reviews are approved and displayed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Try the Review System?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  Experience the seamless integration of AI-powered content moderation and dynamic course selection.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setActiveTab('form')}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Write a Review
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('display')}
                    className="px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    View Reviews
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Tab */}
          {activeTab === 'form' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Review Submission Form
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Experience the intelligent form that dynamically adapts to your selections and ensures content quality.
                </p>
              </div>
              
              <CourseReviewForm />
            </div>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Reviews Display System
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Select a university to view all courses and their reviews, or explore individual courses.
                </p>
              </div>

              {/* University Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select University to View All Courses & Reviews</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose a university to see all available degree programs and their student reviews
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {universities.map((uni) => (
                    <button
                      key={uni.shortName}
                      onClick={() => {
                        setSelectedUniversity(uni.shortName);
                        setSelectedCourse(courses.find(c => c.university === uni.shortName) || courses[0]);
                      }}
                      className={`justify-start h-auto p-6 hover:scale-105 transition-transform rounded-lg border-2 ${
                        selectedUniversity === uni.shortName
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium text-lg">{uni.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {courses.filter(c => c.university === uni.shortName).length} Degree Programs
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* All Courses for Selected University */}
              {selectedUniversity && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      All Courses at {universities.find(u => u.shortName === selectedUniversity)?.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Browse through all degree programs and read student reviews
                  </p>
                  <div className="space-y-6">
                    {courses
                      .filter(course => course.university === selectedUniversity)
                      .map((course, index) => (
                        <div 
                          key={index} 
                          id={`course-${course.university}-${course.courseName}`.replace(/\s+/g, '-').toLowerCase()}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                {course.courseName}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">{course.duration}</span>
                                <span className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">{course.intake}</span>
                                <span className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">APS: {course.requiredAPS}</span>
                                <span className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">
                                  {Array.isArray(course.personalityType) ? course.personalityType.join(', ') : course.personalityType}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Required Subjects:</strong> {course.requiredSubjects.join(', ')}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                // Scroll to the course detail view
                                document.getElementById('course-detail-view')?.scrollIntoView({ 
                                  behavior: 'smooth',
                                  block: 'start'
                                });
                              }}
                              className="ml-4 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                            >
                              View Details
                            </button>
                          </div>
                          
                          {/* Reviews for this course */}
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Student Reviews
                              </h4>

                            </div>
                            <CourseReviewsDisplay 
                              university={course.university}
                              course={course.courseName}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Individual Course Detail View */}
              <div id="course-detail-view" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Course Detail View</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Detailed view of a specific course with comprehensive information
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Course Info Card */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedCourse.courseName}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {selectedCourse.university} • {selectedCourse.duration} • {selectedCourse.intake}
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Required APS: {selectedCourse.requiredAPS}</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCourse.requiredSubjects.map((subject, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Personality Type</h4>
                          <span className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">
                            {Array.isArray(selectedCourse.personalityType) ? selectedCourse.personalityType.join(', ') : selectedCourse.personalityType}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedCourse.personalityGroup} Group
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Display */}
                  <div>
                    <CourseReviewsDisplay 
                      university={selectedCourse.university}
                      course={selectedCourse.courseName}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
