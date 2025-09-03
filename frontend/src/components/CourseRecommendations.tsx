import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, Target, Users } from "lucide-react";
import CourseCard from "./CourseCard";
import { courses, type Course } from "@/data/universityData";

interface CourseRecommendationsProps {
  apsScore: number | null;
  userSubjects: string[];
  personalityType: string | null;
}

const CourseRecommendations = ({ apsScore, userSubjects, personalityType }: CourseRecommendationsProps) => {
  const [matchedCourses, setMatchedCourses] = useState<Course[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const personalityGroupMapping = useMemo(() => ({
    "INTJ": "Analytical", "INTP": "Analytical", "ENTJ": "Analytical", "ENTP": "Analytical",
    "INFJ": "Social", "INFP": "Social", "ENFJ": "Social", "ENFP": "Creative",
    "ISTJ": "Practical", "ISFJ": "Practical", "ESTJ": "Practical", "ESFJ": "Social",
    "ISTP": "Practical", "ISFP": "Creative", "ESTP": "Creative", "ESFP": "Creative"
  }), []);

  useEffect(() => {
    if (apsScore !== null && personalityType && userSubjects.length > 0) {
      const userPersonalityGroup = personalityGroupMapping[personalityType as keyof typeof personalityGroupMapping];

      const matches = courses.filter(course => {
        const apsMatch = apsScore >= course.requiredAPS;
        
        const hasRequiredSubjects = course.requiredSubjects.every(reqSubject =>
          userSubjects.some(userSubject => 
            userSubject.toLowerCase().includes(reqSubject.toLowerCase()) ||
            reqSubject.toLowerCase().includes(userSubject.toLowerCase())
          )
        );
        
        const personalityMatch = course.personalityGroup === userPersonalityGroup;
        
        return apsMatch && hasRequiredSubjects && personalityMatch;
      });

      setMatchedCourses(matches);
      setShowRecommendations(true);
    }
  }, [apsScore, userSubjects, personalityType, personalityGroupMapping]);

  if (!showRecommendations || (apsScore === null || !personalityType)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="text-center p-12 shadow-card">
          <div className="space-y-4">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600">Ready to Find Your Perfect Course?</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Complete your APS calculation and personality assessment above to discover courses that match your academic qualifications and learning style.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const userPersonalityGroup = personalityGroupMapping[personalityType as keyof typeof personalityGroupMapping];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Your Course Recommendations
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Based on your APS score of <strong>{apsScore}</strong>, your <strong>{personalityType} ({userPersonalityGroup})</strong> personality type, 
          and your subject choices, here are the perfect matches for you.
        </p>
      </div>

      {/* Match Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center p-6">
          <div className="bg-success-green-light p-3 rounded-full w-fit mx-auto mb-4">
            <Target className="w-8 h-8 text-success-green" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">APS Score</h3>
          <div className="text-2xl font-bold text-success-green">{apsScore}</div>
          <p className="text-sm text-gray-600">Meets {matchedCourses.length} course requirements</p>
        </Card>

        <Card className="text-center p-6">
          <div className="bg-warm-accent-light p-3 rounded-full w-fit mx-auto mb-4">
            <Users className="w-8 h-8 text-warm-accent" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Personality Type</h3>
          <div className="text-2xl font-bold text-warm-accent">{personalityType}</div>
          <p className="text-sm text-gray-600">({userPersonalityGroup} Group)</p>
        </Card>

        <Card className="text-center p-6">
          <div className="bg-academic-blue-light p-3 rounded-full w-fit mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-academic-blue" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Perfect Matches</h3>
          <div className="text-2xl font-bold text-academic-blue">{matchedCourses.length}</div>
          <p className="text-sm text-gray-600">Courses found for you</p>
        </Card>
      </div>

      {/* Course Results */}
      {matchedCourses.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-6 h-6 text-success-green" />
            <h3 className="text-2xl font-semibold text-gray-900">Perfect Matches for You</h3>
            <Badge className="bg-success-green text-white">
              {matchedCourses.length} {matchedCourses.length === 1 ? 'Course' : 'Courses'}
            </Badge>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {matchedCourses.map((course, index) => (
              <CourseCard key={index} course={course} isMatched={true} />
            ))}
          </div>
        </div>
      ) : (
        <Card className="text-center p-12">
          <div className="space-y-4">
            <Target className="w-16 h-16 text-gray-400 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600">No Perfect Matches Found</h3>
            <div className="space-y-2 text-gray-500 max-w-2xl mx-auto">
              <p>
                Based on your current APS score ({apsScore}), subjects, and {personalityType} personality type, 
                we couldn't find courses that match all your criteria.
              </p>
              <p className="text-sm">
                <strong>Don't worry!</strong> This might mean you need to:
              </p>
              <ul className="text-sm space-y-1">
                <li>• Consider improving your APS score through supplementary exams</li>
                <li>• Look into alternative subjects that meet course requirements</li>
                <li>• Explore courses that match your personality type with lower APS requirements</li>
              </ul>
            </div>
            
            <div className="mt-8">
              <h4 className="font-semibold text-gray-700 mb-4">Explore All Available Courses</h4>
              <div className="grid lg:grid-cols-2 gap-6">
                {courses
                  .filter(course => course.personalityGroup === userPersonalityGroup)
                  .slice(0, 4)
                  .map((course, index) => (
                    <CourseCard key={index} course={course} isMatched={false} />
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CourseRecommendations;