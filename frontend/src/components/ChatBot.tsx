import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X } from "lucide-react";
import { universities, courses } from "@/data/universityData";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  apsScore: number | null;
  userSubjects: string[];
  personalityType: string | null;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  refreshTrigger?: number;
}

const ChatBot = ({ apsScore, userSubjects, personalityType, setMessages: setParentMessages, refreshTrigger }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setLocalMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDataUpdated, setShowDataUpdated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Debug logging
  console.log('ChatBot render - Current data:', { apsScore, userSubjects, personalityType, refreshTrigger });
  
  // Gemini API configuration
  const GEMINI_API_KEY = "AIzaSyAWHvDx2wyRVwYyuTuqenEvioc3JsVKSjE";
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync with parent messages when they change
  useEffect(() => {
    if (setParentMessages) {
      setParentMessages(messages);
    }
  }, [messages, setParentMessages]);

  // Show data updated notification when component refreshes
  useEffect(() => {
    if (apsScore !== null || personalityType !== null) {
      setShowDataUpdated(true);
      setTimeout(() => setShowDataUpdated(false), 4000);
      
      // If chatbot is open and has messages, refresh them with new data
      if (isOpen && messages.length > 0) {
        refreshChatbotWithNewData();
      }
    }
  }, [apsScore, personalityType]);

  // Handle refresh trigger from parent component
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      // Clear existing messages and refresh with new data
      setLocalMessages([]);
      setShowDataUpdated(true);
      setTimeout(() => setShowDataUpdated(false), 4000);
      
      // Always refresh with new data, regardless of whether chat is open
      setTimeout(() => {
        refreshChatbotWithNewData();
      }, 100);
    }
  }, [refreshTrigger]);

  const refreshChatbotWithNewData = () => {
    // Use the latest props data
    const currentApsScore = apsScore;
    const currentUserSubjects = userSubjects;
    const currentPersonalityType = personalityType;
    
    console.log('Refreshing chatbot with data:', { currentApsScore, currentUserSubjects, currentPersonalityType });
    
    const updatedWelcomeMessage: Message = {
      id: "welcome-updated",
      content: `🔄 **Your data has been updated!** 

🎯 **Current APS Score: ${currentApsScore !== null ? currentApsScore : 'Not calculated yet'}**
📚 **Current Subjects: ${currentUserSubjects.length > 0 ? currentUserSubjects.join(', ') : 'Not selected yet'}**
🧠 **Current Personality: ${currentPersonalityType || 'Not determined yet'}**

I can now provide you with personalized advice! Ask me anything like:
• "What courses can I apply for with my ${currentApsScore !== null ? currentApsScore : 'APS score'}?"
• "Do my subjects qualify me for Engineering?"
• "What courses match my personality type?"
• "Compare universities for my chosen course"`,
      isUser: false,
      timestamp: new Date()
    };
    
    setLocalMessages([updatedWelcomeMessage]);
  };



  const createSystemPrompt = () => {
    const coursesData = courses.map(course => ({
      university: course.university,
      course: course.courseName,
      requiredAPS: course.requiredAPS,
      requiredSubjects: course.requiredSubjects,
      personalityType: course.personalityType,
      brainInfo: course.brainInfo,
      heartInfo: course.heartInfo,
      reviews: course.reviews
    }));

    const universitiesData = universities.map(uni => ({
      name: uni.name,
      description: uni.description,
      generalReviews: uni.generalReviews,
      campusTips: uni.campusTips
    }));

    return `You are a friendly university guidance counselor helping South African students choose the right university and course. You have access to comprehensive data about Wits, UJ, and UCT universities.

STUDENT'S PERSONAL INFORMATION:
- APS Score: ${apsScore !== null ? apsScore : 'Not calculated yet'}
- Subjects: ${userSubjects.length > 0 ? userSubjects.join(', ') : 'Not selected yet'}
- Personality Type: ${personalityType || 'Not determined yet'}

DEBUG INFO - Current Data:
- apsScore value: ${apsScore}
- userSubjects array: ${JSON.stringify(userSubjects)}
- personalityType value: ${personalityType}

IMPORTANT: You have access to detailed course information including:
- APS scores required for each course
- Required subjects for each course
- Personality types that match each course
- Course duration and intake periods
- Student reviews and experiences

Available courses and requirements:
${JSON.stringify(coursesData, null, 2)}

Universities information and reviews:
${JSON.stringify(universitiesData, null, 2)}

Your role:
- Be conversational, friendly, and supportive like a helpful friend
- Use the student's personal data (APS, subjects, personality) to give personalized advice when available
- Ask questions to understand their interests, academic strengths, and preferences
- Use the student reviews and experiences to give authentic insights
- Help them understand APS requirements and subject prerequisites
- Share campus tips and student experiences
- Guide them through personality-based course matching when personality data is available
- Be encouraging and positive

SPECIFIC CAPABILITIES:
1. **Personalized APS Analysis**: Compare their actual APS score with course requirements
2. **Subject Matching**: Check if their subjects meet course prerequisites
3. **Personality Matching**: Match their personality type with suitable courses (when available)
4. **University Comparisons**: Compare the same course across different universities
5. **Career Guidance**: Use brainInfo and heartInfo to explain what each course offers

PERSONALITY TEST HANDLING:
- If they have taken the personality test: Use it to recommend courses that match their learning style
- If they haven't taken it: Gently suggest it as a helpful tool, but don't make it mandatory
- Always provide valuable guidance regardless of whether they've completed the personality test
- Focus on their interests and academic strengths when personality data isn't available

EXAMPLE QUERIES YOU CAN HANDLE:
- "What courses can I apply for with my current APS score?"
- "Do my subjects qualify me for Engineering?"
- "What courses match my personality type?" (if personality data available)
- "What courses interest me?" (if no personality data)
- "Compare Computer Science at Wits vs UJ vs UCT"
- "How can I improve my chances of getting into my dream course?"

Keep responses concise but helpful. Always reference their personal data when relevant. If they haven't calculated their APS or taken the personality test, gently encourage them to do so for better guidance, but don't make it a barrier to helping them.`;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setLocalMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Debug logging
    console.log('Sending message to AI with data:', { apsScore, userSubjects, personalityType });
    console.log('System prompt data:', { 
      apsScore: apsScore !== null ? apsScore : 'Not calculated yet',
      userSubjects: userSubjects.length > 0 ? userSubjects.join(', ') : 'Not selected yet',
      personalityType: personalityType || 'Not determined yet'
    });

    try {
      // Prepare conversation history for Gemini
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: createSystemPrompt() + "\n\nUser: " + inputMessage }]
            },
            ...conversationHistory
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            topP: 0.8,
            topK: 40
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini");
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.candidates[0].content.parts[0].text,
        isUser: false,
        timestamp: new Date()
      };

      setLocalMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setLocalMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure chatbot shows current data when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Show welcome message with current data when chat is opened
      const welcomeMessage: Message = {
        id: "welcome",
        content: `Hey there! 👋 I'm your AI university guide! 

${apsScore !== null ? `🎯 **Your APS Score: ${apsScore}**` : '🎯 **Calculate your APS score first** for personalized advice'}
${userSubjects.length > 0 ? `📚 **Your Subjects: ${userSubjects.join(', ')}**` : '📚 **Select your subjects** to see course requirements'}
${personalityType ? `🧠 **Your Personality: ${personalityType}**` : '🧠 **Personality test available** (optional but helpful!)'}

I can help you with:
🎯 **Personalized Course Matching** - Based on your actual scores and subjects
🧠 **Course Recommendations** - Based on your interests and strengths
📚 **Subject Requirement Checking** - See if you qualify for specific courses
🏫 **University Comparisons** - Compare Wits, UJ, and UCT
💡 **Course Insights** - Get real student experiences

${apsScore !== null ? `What would you like to know? You can ask me anything like:\n• "What courses can I apply for with my ${apsScore} APS score?"\n• "Do my subjects qualify me for Engineering?"\n• "What courses match my personality type?"` : 'Start by calculating your APS score for the best guidance! The personality test is optional but can help find courses that match your learning style.'}

${apsScore !== null && userSubjects.length > 0 ? `\n💡 **Quick Tip**: I can now give you personalized advice based on your ${apsScore} APS score and ${userSubjects.join(', ')} subjects!` : ''}

${apsScore !== null ? `\n🔍 **Debug Info**: I can see your APS score is ${apsScore} and subjects are ${userSubjects.join(', ')}` : ''}`,
        isUser: false,
        timestamp: new Date()
      };
      
      setLocalMessages([welcomeMessage]);
    }
  }, [isOpen, apsScore, userSubjects, personalityType, messages.length]);

  const startChat = () => {
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={startChat}
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-primary">
              Campus Guide 🎓
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Data Updated Notification */}
          {showDataUpdated && (
            <div className="p-3 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center space-x-2 text-blue-700">
                <span className="text-blue-600">🔄</span>
                <span className="text-sm font-medium">Your data has been updated!</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                {apsScore !== null && `APS Score: ${apsScore}`}
                {apsScore !== null && personalityType !== null && ' • '}
                {personalityType !== null && `Personality: ${personalityType}`}
              </p>
            </div>
          )}
          
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-blue-400 rounded-full animate-ping"></div>
                    </div>
                    <div className="flex space-x-1">
                      <span className="text-blue-600 font-medium">Thinking</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-500 mt-2 italic">Analyzing your data and finding the perfect courses...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about universities..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;