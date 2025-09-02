import { useState } from "react";
import CampusHero from "@/components/CampusHero";
import APSCalculator from "@/components/APSCalculator";
import PersonalityTest from "@/components/PersonalityTest";
import CourseRecommendations from "@/components/CourseRecommendations";
import UniversitySections from "@/components/UniversitySections";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  const [apsScore, setApsScore] = useState<number | null>(null);
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [personalityType, setPersonalityType] = useState<string | null>(null);

  const handleAPSCalculated = (score: number, subjects: string[]) => {
    setApsScore(score);
    setUserSubjects(subjects);
  };

  const handlePersonalityDetermined = (type: string) => {
    setPersonalityType(type);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <CampusHero />
      
      {/* APS Calculator and Personality Test */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Perfect Match
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Let's start by understanding your academic achievements and learning style. 
              This will help us recommend the most suitable courses for you.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <APSCalculator onAPSCalculated={handleAPSCalculated} />
            <PersonalityTest onPersonalityDetermined={handlePersonalityDetermined} />
          </div>
        </div>
      </section>

      {/* Course Recommendations */}
      <section className="py-16 bg-white">
        <CourseRecommendations 
          apsScore={apsScore}
          userSubjects={userSubjects}
          personalityType={personalityType}
        />
      </section>

      {/* University Sections */}
      <section className="py-16 bg-gray-50">
        <UniversitySections />
      </section>

      {/* Footer */}
      <footer className="bg-academic-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Career Canvas</h3>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Helping South African students make informed decisions about their university education 
            by combining academic requirements with authentic student experiences.
          </p>
          <div className="text-sm text-white/60">
            <p>© 2024 Career Canvas. Built with ❤️ for South African students.</p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
};

export default Index;
