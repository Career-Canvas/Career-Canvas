import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Lightbulb, Target, CheckCircle2, ShieldAlert, Zap, Heart, Loader2 } from "lucide-react";
import * as React from "react";
import { Progress } from "@/components/ui/progress";

// Define the structure for the API response and results
interface Question {
  id: string;
  text: string;
  keyed: 'plus' | 'minus';
  domain: 'O' | 'C' | 'E' | 'A' | 'N';
}

interface PersonalityScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

interface PersonalityTestProps {
  onPersonalityDetermined: (scores: PersonalityScores) => void;
}

const domainDetails = {
  O: {
    name: "Openness to Experience",
    icon: Lightbulb,
    description: "Reflects your curiosity, creativity, and appreciation for art and new experiences. High scorers are imaginative and independent thinkers.",
    color: "text-warm-accent"
  },
  C: {
    name: "Conscientiousness",
    icon: Target,
    description: "Indicates your level of organization, discipline, and goal-directed behavior. High scorers are reliable, responsible, and hardworking.",
    color: "text-success-green"
  },
  E: {
    name: "Extraversion",
    icon: Zap,
    description: "Measures your sociability, assertiveness, and emotional expression. High scorers are outgoing, energetic, and thrive in social situations.",
    color: "text-purple-600"
  },
  A: {
    name: "Agreeableness",
    icon: Heart,
    description: "Shows your tendency to be compassionate and cooperative. High scorers are typically trusting, helpful, and good-natured.",
    color: "text-academic-blue"
  },
  N: {
    name: "Neuroticism",
    icon: ShieldAlert,
    description: "Relates to emotional stability and the tendency to experience negative emotions. High scorers may be more prone to stress and anxiety.",
    color: "text-red-500"
  },
};

const likertOptions = [
  { value: 1, label: "Very Inaccurate" },
  { value: 2, label: "Moderately Inaccurate" },
  { value: 3, label: "Neither Accurate Nor Inaccurate" },
  { value: 4, label: "Moderately Accurate" },
  { value: 5, label: "Very Accurate" },
];

const PersonalityTest = ({ onPersonalityDetermined }: PersonalityTestProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<PersonalityScores | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 15;

  // Fetch questions from the API when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/personality/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions. Please try again later.');
        }
        const data = await response.json();
        setQuestions(data); // Assuming your backend sends the questions directly as an array
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: Number(value) });
  };
  
  // Implement the Big Five scoring logic
  const calculateScores = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Send the answers AND questions to your backend API
      const response = await fetch('http://localhost:3001/api/personality/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, questions }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.scores) {
        setResults(data.scores);
        onPersonalityDetermined(data.scores); // Pass the detailed scores object up
      } else {
        throw new Error(data.error || 'Failed to get scores from the server.');
      }

    } catch (err) {
      console.error("API call failed:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const isComplete = totalQuestions > 0 && answeredQuestions === totalQuestions;
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  if (isLoading) return <p>Loading test...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
      <CardHeader className="bg-gradient-card rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-academic-blue">
          <Brain className="w-6 h-6" />
          Big Five Personality Assessment
        </CardTitle>
        <CardDescription>
          Discover your personality profile to find matching career paths. Based on the IPIP-NEO-120.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {!results ? (
          <>
            <div className="space-y-8">
              {currentQuestions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {startIndex + index + 1}
                    </span>
                    <h3 className="font-medium text-gray-900 leading-6">{question.text}</h3>
                  </div>
                  
                  <RadioGroup
                    value={answers[question.id]?.toString() || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                    className="ml-11 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
                  >
                    {likertOptions.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value.toString()} id={`${question.id}-${option.value}`} />
                        <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">{answeredQuestions} / {totalQuestions}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <Button 
              onClick={calculateScores}
              disabled={!isComplete || isSubmitting} 
              className="w-full mt-6 bg-warm-accent hover:bg-warm-accent/90 text-white shadow-button transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Calculating...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  {isComplete ? 'See My Results' : `Answer ${totalQuestions - answeredQuestions} more questions`}
                </>
              )}
            </Button>
          </>
        ) : (
          // 3. Display the detailed results
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-success-green" />
              <h3 className="text-xl font-semibold text-gray-900">Your Personality Profile</h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(results).map(([domain, score]) => {
                const detail = domainDetails[domain as keyof typeof domainDetails];
                
                return (
                  <div key={domain}>
                    <div className="flex items-center gap-3 mb-1">
                      {React.createElement(detail.icon, { className: `w-5 h-5 ${detail.color}` })}
                      <h4 className="font-semibold">{detail.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 ml-8">{detail.description}</p>
                    <div className="flex items-center gap-2 ml-8">
                      <Progress value={score} className="w-full" />
                      <span className="font-semibold text-sm">{Math.round(score)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalityTest;