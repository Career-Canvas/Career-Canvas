import { Brain, Heart, GraduationCap, Sparkles, Target } from "lucide-react";

const CampusHero = () => {
  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-300/40 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-purple-200/30 rounded-full blur-lg animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-white/25 rounded-full blur-xl animate-pulse delay-300"></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Logo/Brand Section */}
        <div className="mb-8">
          <div className="flex justify-center items-center mb-6">
            <div className="flex space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 leading-tight">
            Career Canvas
          </h1>
          
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-cyan-300 mr-2" />
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              Everything you need when choosing a course
            </p>
            <Sparkles className="w-6 h-6 text-cyan-300 ml-2" />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
              University Course
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            The smart way to choose your future. Combining academic requirements with real student experiences, 
            personality insights, and authentic reviews to match you with your ideal university course.
          </p>
        </div>
        
        {/* Feature buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
            onClick={() => {
              document.getElementById('aps-calculator')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-full px-8 py-4 hover:bg-white/25 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
          >
            <Brain className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white font-semibold text-lg">Academic Match</span>
          </button>
          <button 
            onClick={() => {
              document.getElementById('university-sections')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-full px-8 py-4 hover:bg-white/25 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
          >
            <Heart className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white font-semibold text-lg">Real Experiences</span>
          </button>
          <button 
            onClick={() => {
              window.location.href = '/course-reviews';
            }}
            className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-full px-8 py-4 hover:bg-white/25 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
          >
            <GraduationCap className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white font-semibold text-lg">Course Reviews</span>
          </button>
        </div>
        
        {/* Call to action */}
        <div className="text-center">
          <button 
            onClick={() => {
              document.getElementById('aps-calculator')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="inline-flex items-center space-x-3 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-full px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Target className="w-6 h-6" />
            <span>Start Your Journey</span>
          </button>
          <p className="text-white/70 text-sm mt-4">
            Join thousands of students who found their perfect course match
          </p>
        </div>
      </div>
    </section>
  );
};

export default CampusHero;