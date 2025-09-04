import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, Target, Users } from "lucide-react";
import CourseCard from "./CourseCard";
import { courses, type Course } from "@/data/universityData";

interface CourseRecommendationsProps {
  apsResults: {
    wits: number | null;
    uj: number | null;
    up: number | null;
  };
  userSubjects: string[];
  personalityType: string | null;
}

const CourseRecommendations = ({ apsResults, userSubjects, personalityType }: CourseRecommendationsProps) => {
  const [matchedCourses, setMatchedCourses] = useState<Course[]>([]);

  const personalityGroupMapping = useMemo(() => ({
    "INTJ": "Analytical", "INTP": "Analytical", "ENTJ": "Analytical", "ENTP": "Analytical",
    "INFJ": "Social", "INFP": "Social", "ENFJ": "Social", "ENFP": "Creative",
    "ISTJ": "Practical", "ISFJ": "Practical", "ESTJ": "Practical", "ESFJ": "Social",
    "ISTP": "Practical", "ISFP": "Creative", "ESTP": "Creative", "ESFP": "Creative"
  }), []);

  useEffect(() => {
    if ((apsResults.wits !== null || apsResults.uj !== null || apsResults.up !== null) && personalityType && userSubjects.length > 0) {
      const userPersonalityGroup = personalityGroupMapping[personalityType as keyof typeof personalityGroupMapping];

      const matches = courses.filter(course => {
        // Use the appropriate APS score for each university
        let apsMatch = false;
        if (course.university === "Wits" && apsResults.wits !== null) {
          apsMatch = apsResults.wits >= course.requiredAPS;
        } else if (course.university === "UJ" && apsResults.uj !== null) {
          apsMatch = apsResults.uj >= course.requiredAPS;
        } else if (course.university === "UP" && apsResults.up !== null) {
          apsMatch = apsResults.up >= course.requiredAPS;
        }
        
        const hasRequiredSubjects = course.requiredSubjects.every(reqSubject =>
          userSubjects.some(userSubject => 
            userSubject.toLowerCase().includes(reqSubject.toLowerCase()) ||
            reqSubject.toLowerCase().includes(userSubject.toLowerCase())
          )
        );
        
        // Check if user's personality type is in the course's personality type array
        const personalityMatch = course.personalityType.includes(personalityType);
        
        return apsMatch && hasRequiredSubjects && personalityMatch;
      });

      setMatchedCourses(matches);
    }
  }, [apsResults, userSubjects, personalityType, personalityGroupMapping]);

  // Since this component is now only rendered when results are locked in, we don't need the early return
  const userPersonalityGroup = personalityGroupMapping[personalityType as keyof typeof personalityGroupMapping];

  // Helper function to get the appropriate APS score for display
  const getDisplayAPSScore = () => {
    if (apsResults.wits !== null) return apsResults.wits;
    if (apsResults.uj !== null) return apsResults.uj;
    if (apsResults.up !== null) return apsResults.up;
    return null;
  };

  const displayAPSScore = getDisplayAPSScore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Your Course Recommendations
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Based on your APS scores, your <strong>{personalityType} ({userPersonalityGroup})</strong> personality type, 
          and your subject choices, here are the perfect matches for you.
        </p>
      </div>

      {/* Match Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center p-6">
          <div className="bg-success-green-light p-3 rounded-full w-fit mx-auto mb-4">
            <Target className="w-8 h-8 text-success-green" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">APS Scores</h3>
          <div className="space-y-2">
            {apsResults.wits !== null && (
              <div className="text-lg font-bold text-success-green">Wits: {apsResults.wits}</div>
            )}
            {apsResults.uj !== null && (
              <div className="text-lg font-bold text-success-green">UJ: {apsResults.uj}</div>
            )}
            {apsResults.up !== null && (
              <div className="text-lg font-bold text-success-green">UP: {apsResults.up}</div>
            )}
          </div>
        </Card>

        <Card className="text-center p-6">
          <div className="bg-warm-accent-light p-3 rounded-full w-fit mx-auto mb-4">
            <Users className="w-8 h-8 text-warm-accent" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personality Type</h3>
          <div className="text-2xl font-bold text-warm-accent">{personalityType}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">({userPersonalityGroup} Group)</p>
        </Card>

        <Card className="text-center p-6">
          <div className="bg-academic-blue-light p-3 rounded-full w-fit mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-academic-blue" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Perfect Matches</h3>
          <div className="text-2xl font-bold text-academic-blue">{matchedCourses.length}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Courses found for you</p>
        </Card>
      </div>

      {/* Course Results */}
      {matchedCourses.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-6 h-6 text-success-green" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Perfect Matches for You</h3>
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
            <Target className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">No Perfect Matches Found</h3>
            <div className="space-y-2 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              <p>
                Based on your current APS scores, subjects, and {personalityType} personality type, 
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
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Explore All Available Courses</h4>
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