import { Brain, Heart, Star, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Course {
  courseName: string;
  requiredAPS: number;
  requiredSubjects: string[];
  personalityType: string;
  brainInfo: string;
  heartInfo: string;
  university: string;
  duration: string;
  intake: string;
  reviews: Array<{
    rating: number;
    comment: string;
    author: string;
  }>;
}

interface CourseCardProps {
  course: Course;
  isMatched?: boolean;
}

const CourseCard = ({ course, isMatched = false }: CourseCardProps) => {
  const averageRating = course.reviews.length > 0 
    ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
    : 0;

  return (
    <Card className={`shadow-card hover:shadow-card-hover transition-all duration-300 ${isMatched ? 'ring-2 ring-success-green border-success-green/20' : ''}`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 bg-gradient-card rounded-t-lg">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">{course.courseName}</h3>
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
              {course.personalityType}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.intake}
            </div>
            {course.reviews.length > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {averageRating.toFixed(1)} ({course.reviews.length} reviews)
              </div>
            )}
          </div>
        </div>

        {/* Brain Section */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-academic-blue-light p-2 rounded-full">
              <Brain className="w-5 h-5 text-academic-blue" />
            </div>
            <h4 className="font-semibold text-academic-blue">The Brain</h4>
            <span className="text-sm text-gray-500">Academic Focus</span>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">{course.brainInfo}</p>
          
          <div className="space-y-2">
            <h5 className="font-medium text-gray-900">Required Subjects:</h5>
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
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <h4 className="font-semibold text-red-500">The Heart</h4>
            <span className="text-sm text-gray-500">Student Experience</span>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">{course.heartInfo}</p>
          
          {course.reviews.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-medium text-gray-900">Recent Reviews:</h5>
              {course.reviews.slice(0, 2).map((review, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">- {review.author}</span>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;