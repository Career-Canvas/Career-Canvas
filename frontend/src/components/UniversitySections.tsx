import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Wifi, Car, Coffee, Heart, MessageCircle } from "lucide-react";
import { universities, type UniversityInfo } from "@/data/universityData";
import ReviewSubmissionForm from "./ReviewSubmissionForm";
import { useState } from "react";

const UniversitySections = () => {
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);

  const handleReviewSubmit = (universityName: string) => {
    setShowReviewForm(null);
    // You could add a success message or refresh reviews here
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'transport':
        return <Car className="w-4 h-4" />;
      case 'technology':
        return <Wifi className="w-4 h-4" />;
      case 'food':
        return <Coffee className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          University Campus Life
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get the inside scoop on campus life, facilities, and student experiences at South Africa's top universities.
        </p>
      </div>

      <div className="space-y-16">
        {universities.map((university) => (
          <div key={university.shortName} className="space-y-8">
            {/* University Header with custom background */}
                         <div className={`text-center p-8 rounded-2xl ${
               university.shortName === 'Wits' 
                 ? 'bg-blue-950/30 backdrop-blur-sm border border-blue-300/40' 
                 : university.shortName === 'UJ' 
                 ? 'bg-orange-500/20 backdrop-blur-sm border border-orange-200/30'
                 : 'bg-gradient-to-br from-blue-900/20 to-blue-400/20 backdrop-blur-sm border border-blue-200/30'
             }`}>
               <h3 className={`text-3xl font-bold mb-2 ${
                 university.shortName === 'Wits' 
                   ? 'text-blue-950' 
                   : university.shortName === 'UJ' 
                   ? 'text-orange-700'
                   : 'text-blue-800'
               }`}>
                 {university.name}
               </h3>
               <p className={`text-lg max-w-2xl mx-auto ${
                 university.shortName === 'Wits' 
                   ? 'text-blue-900/90' 
                   : university.shortName === 'UJ' 
                   ? 'text-orange-700/80'
                   : 'text-blue-700/80'
               }`}>
                 {university.description}
               </p>
             </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Campus Tips */}
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
                <CardHeader className="bg-warm-accent-light">
                  <CardTitle className="flex items-center gap-2 text-warm-accent">
                    <MapPin className="w-6 h-6" />
                    Campus Insider Tips
                  </CardTitle>
                  <CardDescription>
                    Practical advice from current students
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {university.campusTips.map((tip, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-warm-accent font-medium text-sm mt-1">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Student Reviews */}
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
                <CardHeader className="bg-red-50">
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <Heart className="w-6 h-6" />
                    Student Reviews
                  </CardTitle>
                  <CardDescription>
                    Honest experiences from the campus community
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    {university.generalReviews.map((review, index) => (
                      <div key={index} className="border-l-4 border-red-200 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(review.category)}
                            <Badge variant="outline" className="text-xs">
                              {review.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
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
                        </div>
                        <p className="text-sm text-gray-700 italic mb-1">
                          "{review.comment}"
                        </p>
                        <p className="text-xs text-gray-500">- {review.author}</p>
                      </div>
                    ))}
                  </div>

                  {/* Review Submission Form */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Share Your Experience
                    </h4>
                    <div className="space-y-3">
                      {showReviewForm === university.name ? (
                        <ReviewSubmissionForm 
                          universityName={university.name}
                          onReviewSubmitted={() => handleReviewSubmit(university.name)}
                        />
                      ) : (
                        <Button
                          onClick={() => setShowReviewForm(university.name)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white"
                          size="sm"
                        >
                          Submit Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Divider */}
            {university !== universities[universities.length - 1] && (
              <div className="flex items-center justify-center py-8">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-md"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-hero text-white p-8 shadow-card-hover">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold mb-4">
              Help Future Students Make Better Choices
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Your experiences matter! Share honest reviews about your university to help other students 
              make informed decisions about their academic future.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-academic-blue hover:bg-white/90"
            >
              Join Our Community
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UniversitySections;