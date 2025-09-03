import { useState } from "react";
import CampusHero from "@/components/CampusHero";
import APSCalculator from "@/components/APSCalculator";
import PersonalityTest from "@/components/PersonalityTest";
import CourseRecommendations from "@/components/CourseRecommendations";
import UniversitySections from "@/components/UniversitySections";
import ChatBot from "@/components/ChatBot";
import ThemeToggle from "@/components/DarkModeToggle";

const Index = () => {
  const [apsScore, setApsScore] = useState<number | null>(null);
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [personalityType, setPersonalityType] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [refreshChatbot, setRefreshChatbot] = useState<number>(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleAPSCalculated = (score: number, subjects: string[]) => {
    setApsScore(score);
    setUserSubjects(subjects);
  };

  const handlePersonalityDetermined = (type: string) => {
    setPersonalityType(type);
  };

  const handleLockInResults = () => {
    if (apsScore !== null || personalityType !== null) {
      console.log('Lock-in button clicked with data:', { apsScore, userSubjects, personalityType });
      
      // Reset chatbot messages and trigger a refresh with new data
      setMessages([]);
      // Force chatbot to refresh by updating a trigger state
      setRefreshChatbot(prev => prev + 1);
      // Show success message
      setShowSuccessMessage(true);
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dark Mode Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <CampusHero />
      
      {/* APS Calculator and Personality Test */}
      <section id="aps-calculator" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Your Perfect Match
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Let's start by understanding your academic achievements and learning style. 
              This will help us recommend the most suitable courses for you.
            </p>
          </div>
          
                     <div className="grid lg:grid-cols-2 gap-8">
             <APSCalculator onAPSCalculated={handleAPSCalculated} />
             <PersonalityTest onPersonalityDetermined={handlePersonalityDetermined} />
           </div>
           
           {/* Save/Lock In Button */}
           <div className="text-center mt-12">
             <button
               onClick={handleLockInResults}
               disabled={apsScore === null && personalityType === null}
               className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 ${
                 apsScore !== null || personalityType !== null
                   ? 'bg-academic-blue hover:bg-academic-blue/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
               }`}
             >
               {apsScore !== null || personalityType !== null ? (
                 <>
                   🔒 Lock In My Results & Update AI Guide
                   <span className="block text-sm font-normal mt-1">
                     {apsScore !== null && `APS: ${apsScore}`}
                     {apsScore !== null && personalityType !== null && ' • '}
                     {personalityType !== null && `Personality: ${personalityType}`}
                   </span>
                 </>
               ) : (
                 'Complete APS Calculator or Personality Test to Continue'
               )}
             </button>
             
             {/* Success Message */}
             {showSuccessMessage && (
               <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                 <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-full">
                   <span className="mr-2">✅</span>
                   <span className="text-sm font-medium">
                     Results locked in! Your AI guide has been updated with your latest information.
                   </span>
                 </div>
               </div>
             )}
           </div>
        </div>
      </section>

      {/* Course Recommendations */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <CourseRecommendations 
          apsScore={apsScore}
          userSubjects={userSubjects}
          personalityType={personalityType}
        />
      </section>

      {/* University Sections */}
      <section id="university-sections" className="py-16 bg-gray-50 dark:bg-gray-900">
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
            <p>© 2025 Career Canvas. Built with ❤️ for South African students.</p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <ChatBot 
        apsScore={apsScore}
        userSubjects={userSubjects}
        personalityType={personalityType}
        setMessages={setMessages}
        refreshTrigger={refreshChatbot}
      />
    </div>
  );
};

export default Index;
