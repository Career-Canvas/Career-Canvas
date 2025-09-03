import { Brain, Heart, GraduationCap } from "lucide-react";

const CampusHero = () => {
  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-warm-accent rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex justify-center items-center mb-8">
          <div className="flex space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Find Your Perfect
          <span className="block bg-gradient-to-r from-warm-accent to-white bg-clip-text text-transparent">
            University Course
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          The smart way. Combining academic requirements with real student experiences and personality insights.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => {
              document.getElementById('aps-calculator')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
          >
            <Brain className="w-5 h-5 text-warm-accent group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white font-medium">Academic Match</span>
          </button>
          <button 
            onClick={() => {
              document.getElementById('university-sections')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
          >
            <Heart className="w-5 h-5 text-warm-accent group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white font-medium">Real Experiences</span>
          </button>
          <button 
            onClick={() => {
              window.location.href = '/course-reviews';
            }}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
          >
            <GraduationCap className="w-5 h-5 text-warm-accent group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white font-medium">Course Reviews</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CampusHero;