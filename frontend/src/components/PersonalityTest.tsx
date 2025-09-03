import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Users, Lightbulb, CheckCircle2, DraftingCompass, Handshake, Microscope, Rocket, ArrowLeft, ArrowRight } from "lucide-react";
import * as React from "react";
import { Progress } from "@/components/ui/progress";


interface PersonalityTestProps {
  onPersonalityDetermined: (personalityType: string) => void;
}

const PersonalityTest = ({ onPersonalityDetermined }: PersonalityTestProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [personalityType, setPersonalityType] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const QUESTIONS_PER_PAGE = 5;

  const questions = useMemo(() => [
    // --- Introversion (I) vs. Extraversion (E) ---
    {
      id: "ie1",
      question: "After a social event, you usually feel:",
      options: [
        { value: "I", label: "Drained and in need of alone time." },
        { value: "E", label: "Energized and ready for more interaction." }
      ]
    },
    {
      id: "ie2",
      question: "In group projects, you prefer to:",
      options: [
        { value: "I", label: "Work on your own part and then combine it with others." },
        { value: "E", label: "Brainstorm and work collaboratively throughout the process." }
      ]
    },
    {
      id: "ie3",
      question: "You would describe yourself as more:",
      options: [
        { value: "I", label: "Reserved and thoughtful." },
        { value: "E", label: "Outgoing and expressive." }
      ]
    },
    {
      id: "ie4",
      question: "When meeting new people, you are more likely to:",
      options: [
        { value: "I", label: "Wait for them to approach you." },
        { value: "E", label: "Initiate the conversation yourself." }
      ]
    },
    {
      id: "ie5",
      question: "Your ideal weekend involves:",
      options: [
        { value: "I", label: "A few close friends or quiet activities." },
        { value: "E", label: "A big party or a large social gathering." }
      ]
    },
    // --- Sensing (S) vs. Intuition (N) ---
    {
      id: "sn1",
      question: "When approaching a new subject, you focus on:",
      options: [
        { value: "S", label: "The concrete facts and practical details." },
        { value: "N", label: "The underlying concepts and future possibilities." }
      ]
    },
    {
      id: "sn2",
      question: "You tend to trust:",
      options: [
        { value: "S", label: "Your direct experience and what you can observe." },
        { value: "N", label: "Your intuition and 'gut feelings'." }
      ]
    },
    {
      id: "sn3",
      question: "In instructions, you prefer:",
      options: [
        { value: "S", label: "Step-by-step, detailed guidance." },
        { value: "N", label: "A general overview, allowing you to improvise." }
      ]
    },
    {
      id: "sn4",
      question: "You are more interested in:",
      options: [
        { value: "S", label: "The reality of 'what is'." },
        { value: "N", label: "The potential of 'what could be'." }
      ]
    },
    {
      id: "sn5",
      question: "When describing an event, you are more likely to:",
      options: [
        { value: "S", label: "Recount the specific details of what happened." },
        { value: "N", label: "Describe the overall impression and meaning it had for you." }
      ]
    },
    // --- Thinking (T) vs. Feeling (F) ---
    {
      id: "tf1",
      question: "You make decisions primarily based on:",
      options: [
        { value: "T", label: "Objective logic and principles of fairness." },
        { value: "F", label: "Personal values and how the decision affects others." }
      ]
    },
    {
      id: "tf2",
      question: "When giving feedback, you are more concerned with:",
      options: [
        { value: "T", label: "Being truthful and direct." },
        { value: "F", label: "Being gentle and encouraging." }
      ]
    },
    {
      id: "tf3",
      question: "You are more motivated by:",
      options: [
        { value: "T", label: "Achieving goals and being effective." },
        { value: "F", label: "Receiving appreciation and making a difference to people." }
      ]
    },
    {
      id: "tf4",
      question: "In a debate, you are more likely to:",
      options: [
        { value: "T", label: "Find flaws in the logic of the opposing argument." },
        { value: "F", label: "Find common ground and seek harmony." }
      ]
    },
    {
      id: "tf5",
      question: "You would rather be seen as:",
      options: [
        { value: "T", label: "Logical and competent." },
        { value: "F", label: "Empathetic and caring." }
      ]
    },
    // --- Judging (J) vs. Perceiving (P) ---
    {
      id: "jp1",
      question: "You prefer your life to be:",
      options: [
        { value: "J", label: "Planned and orderly." },
        { value: "P", label: "Spontaneous and flexible." }
      ]
    },
    {
      id: "jp2",
      question: "When working on a project, you prefer to:",
      options: [
        { value: "J", label: "Finish one task completely before starting the next." },
        { value: "P", label: "Work on multiple tasks at once and switch between them." }
      ]
    },
    {
      id: "jp3",
      question: "You feel more satisfied after:",
      options: [
        { value: "J", label: "Making a decision and having a clear plan." },
        { value: "P", label: "Keeping your options open for as long as possible." }
      ]
    },
    {
      id: "jp4",
      question: "You see deadlines as:",
      options: [
        { value: "J", label: "Important goals to be met." },
        { value: "P", label: "Flexible guidelines." }
      ]
    },
    {
      id: "jp5",
      question: "Your approach to work is more:",
      options: [
        { value: "J", label: "Methodical and systematic." },
        { value: "P", label: "Adaptable and open to new information." }
      ]
    }
  ], []);

  const personalityDescriptions = useMemo(() => ({
    "INTJ": { icon: DraftingCompass, title: "The Architect", description: "Imaginative and strategic thinkers, with a plan for everything. You likely excel in STEM fields and research.", color: "text-purple-600" },
    "INTP": { icon: Microscope, title: "The Logician", description: "Innovative inventors with an unquenchable thirst for knowledge. You thrive in analytical and theoretical fields.", color: "text-purple-600" },
    "ENTJ": { icon: Rocket, title: "The Commander", description: "Bold, imaginative and strong-willed leaders, always finding a way – or making one. You are a natural fit for business and leadership roles.", color: "text-purple-600" },
    "ENTP": { icon: Lightbulb, title: "The Debater", description: "Smart and curious thinkers who cannot resist an intellectual challenge. You would enjoy entrepreneurship and law.", color: "text-purple-600" },
    "INFJ": { icon: Handshake, title: "The Advocate", description: "Quiet and mystical, yet very inspiring and tireless idealists. You would do well in counseling, and social sciences.", color: "text-green-600" },
    "INFP": { icon: Users, title: "The Mediator", description: "Poetic, kind and altruistic people, always eager to help a good cause. Careers in writing and social work are a great fit.", color: "text-green-600" },
    "ENFJ": { icon: Users, title: "The Protagonist", description: "Charismatic and inspiring leaders, able to mesmerize their listeners. You are suited for teaching, and social sciences.", color: "text-green-600" },
    "ENFP": { icon: Lightbulb, title: "The Campaigner", description: "Enthusiastic, creative, and sociable free spirits, who can always find a reason to smile. You would enjoy careers in the arts and communication.", color: "text-green-600" },
    "ISTJ": { icon: Brain, title: "The Logistician", description: "Practical and fact-minded individuals, whose reliability cannot be doubted. You are well-suited for fields like accounting and engineering.", color: "text-academic-blue" },
    "ISFJ": { icon: Handshake, title: "The Defender", description: "Very dedicated and warm protectors, always ready to defend their loved ones. You would excel in healthcare and education.", color: "text-academic-blue" },
    "ESTJ": { icon: Rocket, title: "The Executive", description: "Excellent administrators, unsurpassed at managing things – or people. Business and management roles are a natural fit.", color: "text-academic-blue" },
    "ESFJ": { icon: Users, title: "The Consul", description: "Extraordinarily caring, social and popular people, always eager to help. You are a great fit for social work and teaching.", color: "text-academic-blue" },
    "ISTP": { icon: DraftingCompass, title: "The Virtuoso", description: "Bold and practical experimenters, masters of all kinds of tools. You would thrive in hands-on fields like engineering or design.", color: "text-warm-accent" },
    "ISFP": { icon: Lightbulb, title: "The Adventurer", description: "Flexible and charming artists, always ready to explore and experience something new. Creative fields like design and the arts are a perfect match.", color: "text-warm-accent" },
    "ESTP": { icon: Rocket, title: "The Entrepreneur", description: "Smart, energetic and very perceptive people, who truly enjoy living on the edge. You are a natural for business and marketing.", color: "text-warm-accent" },
    "ESFP": { icon: Lightbulb, title: "The Entertainer", description: "Spontaneous, energetic and enthusiastic people – life is never boring around them. Careers in the arts and communication are a great fit.", color: "text-warm-accent" },
  }), []);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculatePersonalityType = () => {
    const counts = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.values(answers).forEach(value => {
      counts[value]++;
    });

    let result = "";
    result += counts.I >= counts.E ? "I" : "E";
    result += counts.S >= counts.N ? "S" : "N";
    result += counts.T >= counts.F ? "T" : "F";
    result += counts.J >= counts.P ? "J" : "P";
    
    setPersonalityType(result);
    setShowResult(true);
    onPersonalityDetermined(result);
  };

  const isPageComplete = useMemo(() => {
    return currentQuestions.every(q => !!answers[q.id]);
  }, [answers, currentQuestions]);

  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
      <CardHeader className="bg-gradient-card rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-academic-blue">
          <Brain className="w-6 h-6" />
          Personality Assessment
        </CardTitle>
        <CardDescription>
          Based on the Myers-Briggs Type Indicator, this will help discover your learning style and career preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-academic-blue">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
          <p className="text-center text-xs text-gray-500 mt-2">Page {currentPage} of {totalPages}</p>
        </div>
        
        <div className="space-y-8">
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {startIndex + index + 1}
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

        <div className="mt-8 flex justify-between items-center">
          {currentPage > 1 ? (
             <Button onClick={() => setCurrentPage(p => p - 1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          ) : <div />}

          {currentPage < totalPages && (
            <Button onClick={() => setCurrentPage(p => p + 1)} disabled={!isPageComplete} className="ml-auto">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {currentPage === totalPages && (
             <Button 
              onClick={calculatePersonalityType}
              disabled={!isPageComplete}
              className="w-full bg-warm-accent hover:bg-warm-accent/90 text-white shadow-button transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              size="lg"
            >
              <Brain className="w-5 h-5 mr-2" />
              Discover My Personality Type
            </Button>
          )}
        </div>

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
                <div className="text-2xl font-bold text-gray-900">{personalityType} - {personalityDescriptions[personalityType as keyof typeof personalityDescriptions].title}</div>
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