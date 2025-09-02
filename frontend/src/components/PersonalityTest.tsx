import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Users, Lightbulb, Target, CheckCircle2 } from "lucide-react";
import * as React from "react";

interface PersonalityTestProps {
  onPersonalityDetermined: (personalityType: string) => void;
}

const PersonalityTest = ({ onPersonalityDetermined }: PersonalityTestProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [personalityType, setPersonalityType] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      id: "problem_solving",
      question: "How do you prefer to solve problems?",
      options: [
        { value: "analytical", label: "By analyzing data and using logical thinking", type: "Analytical" },
        { value: "creative", label: "By brainstorming and thinking outside the box", type: "Creative" },
        { value: "practical", label: "By finding practical, tried-and-tested solutions", type: "Practical" },
        { value: "collaborative", label: "By discussing with others and finding consensus", type: "Social" }
      ]
    },
    {
      id: "work_environment",
      question: "What work environment energizes you most?",
      options: [
        { value: "team", label: "Collaborative team environments with lots of interaction", type: "Social" },
        { value: "independent", label: "Quiet, independent spaces where I can focus", type: "Analytical" },
        { value: "dynamic", label: "Fast-paced, ever-changing environments", type: "Creative" },
        { value: "structured", label: "Well-organized, structured environments", type: "Practical" }
      ]
    },
    {
      id: "learning_style",
      question: "How do you learn best?",
      options: [
        { value: "hands_on", label: "Through hands-on experience and practice", type: "Practical" },
        { value: "theory", label: "By understanding theories and concepts first", type: "Analytical" },
        { value: "discussion", label: "Through group discussions and collaboration", type: "Social" },
        { value: "exploration", label: "By exploring and experimenting freely", type: "Creative" }
      ]
    },
    {
      id: "decision_making",
      question: "When making important decisions, you rely most on:",
      options: [
        { value: "data", label: "Facts, data, and logical analysis", type: "Analytical" },
        { value: "intuition", label: "Gut feeling and creative insights", type: "Creative" },
        { value: "experience", label: "Past experience and proven methods", type: "Practical" },
        { value: "consensus", label: "Input from others and group consensus", type: "Social" }
      ]
    },
    {
      id: "motivation",
      question: "What motivates you most in your studies/work?",
      options: [
        { value: "impact", label: "Making a positive impact on people's lives", type: "Social" },
        { value: "innovation", label: "Creating something new and innovative", type: "Creative" },
        { value: "mastery", label: "Mastering complex concepts and skills", type: "Analytical" },
        { value: "results", label: "Achieving tangible, practical results", type: "Practical" }
      ]
    },
    {
      id: "challenge_approach",
      question: "When facing a difficult challenge, you:",
      options: [
        { value: "break_down", label: "Break it down systematically and analyze each part", type: "Analytical" },
        { value: "brainstorm", label: "Generate multiple creative solutions", type: "Creative" },
        { value: "seek_help", label: "Seek advice and collaborate with others", type: "Social" },
        { value: "apply_experience", label: "Apply what has worked before", type: "Practical" }
      ]
    }
  ];

  const personalityDescriptions = {
    Analytical: {
      icon: Brain,
      description: "You excel at logical thinking, data analysis, and systematic problem-solving. Perfect for STEM fields and research.",
      color: "text-academic-blue"
    },
    Creative: {
      icon: Lightbulb,
      description: "You thrive on innovation, artistic expression, and thinking outside the box. Ideal for design, arts, and entrepreneurship.",
      color: "text-warm-accent"
    },
    Practical: {
      icon: Target,
      description: "You focus on real-world applications and tangible results. Great for engineering, business, and applied sciences.",
      color: "text-success-green"
    },
    Social: {
      icon: Users,
      description: "You're motivated by helping others and working in teams. Perfect for education, psychology, and social sciences.",
      color: "text-purple-600"
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculatePersonalityType = () => {
    const typeCounts: Record<string, number> = {
      Analytical: 0,
      Creative: 0,
      Practical: 0,
      Social: 0
    };

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(opt => opt.value === answer);
      if (option) {
        typeCounts[option.type]++;
      }
    });

    const dominantType = Object.entries(typeCounts).reduce((a, b) => 
      typeCounts[a[0]] > typeCounts[b[0]] ? a : b
    )[0];

    setPersonalityType(dominantType);
    setShowResult(true);
    onPersonalityDetermined(dominantType);
  };

  const isComplete = Object.keys(answers).length === questions.length;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
      <CardHeader className="bg-gradient-card rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-academic-blue">
          <Brain className="w-6 h-6" />
          Personality Assessment
        </CardTitle>
        <CardDescription>
          Answer these questions to discover your learning style and career preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <h3 className="font-medium text-gray-900 leading-6">{question.question}</h3>
              </div>
              
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                className="ml-11 space-y-3"
              >
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3">
                    <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                    <Label 
                      htmlFor={`${question.id}-${option.value}`}
                      className="text-sm leading-5 cursor-pointer hover:text-academic-blue transition-colors"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        <Button 
          onClick={calculatePersonalityType}
          disabled={!isComplete}
          className="w-full mt-8 bg-warm-accent hover:bg-warm-accent/90 text-white shadow-button transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          size="lg"
        >
          <Brain className="w-5 h-5 mr-2" />
          {isComplete ? 'Discover My Personality Type' : `Answer ${questions.length - Object.keys(answers).length} more questions`}
        </Button>

        {showResult && personalityType && (
          <div className="mt-6 p-6 bg-warm-accent-light border border-warm-accent/20 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-warm-accent" />
              <h3 className="text-lg font-semibold text-gray-900">Your Personality Type</h3>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              {React.createElement(personalityDescriptions[personalityType as keyof typeof personalityDescriptions].icon, {
                className: `w-12 h-12 ${personalityDescriptions[personalityType as keyof typeof personalityDescriptions].color}`
              })}
              <div>
                <div className="text-2xl font-bold text-gray-900">{personalityType}</div>
                <div className="text-sm text-gray-600">Personality Type</div>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              {personalityDescriptions[personalityType as keyof typeof personalityDescriptions].description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalityTest;