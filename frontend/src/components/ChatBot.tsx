import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Settings, RefreshCw, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { apiKeyManager } from "../services/apiKeyManager";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { universities, courses } from "@/data/universityData";
import { MessageCircle } from "lucide-react";
import APIKeyManagerComponent from "./APIKeyManager";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  apsResults: {
    wits: number | null;
    uj: number | null;
    up: number | null;
  };
  userSubjects: string[];
  personalityType: string | null;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  refreshTrigger?: number;
}

const ChatBot = ({ apsResults, userSubjects, personalityType, setMessages: setParentMessages, refreshTrigger }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setLocalMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDataUpdated, setShowDataUpdated] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  const [isHealthy, setIsHealthy] = useState(true);
  const [showKeyManager, setShowKeyManager] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Debug logging
  console.log('ChatBot render - Current data:', { apsResults, userSubjects, personalityType, refreshTrigger });
  
  // Gemini API configuration
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  
  // Get current API key from rotation manager
  const getCurrentAPIKey = () => {
    const keyInfo = apiKeyManager.getCurrentKeyInfo();
    if (!keyInfo) {
      console.warn("⚠️ No available API keys - all keys are rate limited");
      return null;
    }
    console.log(`🔑 Using API key: ${keyInfo.name}`);
    return keyInfo.key;
  };
  
  // Add retry delay configuration
  const RETRY_DELAYS = [1000, 2000, 5000]; // Progressive delays in milliseconds

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
    if (apsResults.wits !== null || apsResults.uj !== null || apsResults.up !== null || personalityType !== null) {
      setShowDataUpdated(true);
      setTimeout(() => setShowDataUpdated(false), 4000);
      
      // If chatbot is open and has messages, refresh them with new data
      if (isOpen && messages.length > 0) {
        refreshChatbotWithNewData();
      }
    }
  }, [apsResults, personalityType]);

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
    const currentApsResults = apsResults;
    const currentUserSubjects = userSubjects;
    const currentPersonalityType = personalityType;
    
    console.log('Refreshing chatbot with data:', { currentApsResults, currentUserSubjects, currentPersonalityType });
    
    const updatedWelcomeMessage: Message = {
      id: "welcome-updated",
      content: `🔄 **Your data has been updated!** 

🎯 **Current APS Scores:**
${currentApsResults.wits !== null ? `• **Wits**: ${currentApsResults.wits}` : '• **Wits**: Not calculated yet'}
${currentApsResults.uj !== null ? `• **UJ**: ${currentApsResults.uj}` : '• **UJ**: Not calculated yet'}
${currentApsResults.up !== null ? `• **UP**: ${currentApsResults.up}` : '• **UP**: Not calculated yet'}

📚 **Current Subjects: ${currentUserSubjects.length > 0 ? currentUserSubjects.join(', ') : 'Not selected yet'}**
🧠 **Current Personality: ${currentPersonalityType || 'Not determined yet'}**

I can now provide you with personalized advice! Ask me anything like:
• "What courses can I apply for at Wits with my ${currentApsResults.wits !== null ? currentApsResults.wits : 'APS score'}?"
• "Do my subjects qualify me for Engineering at UJ?"
• "What courses match my personality type at UP?"
• "Compare my options across all three universities"`,
      isUser: false,
      timestamp: new Date()
    };
    
    setLocalMessages([updatedWelcomeMessage]);
    // Generate new conversation ID for fresh context
    setConversationId(Date.now().toString());
  };

  const resetConversation = () => {
    setLocalMessages([]);
    setRetryCount(0);
    setConversationId(Date.now().toString());
    setIsHealthy(true);
    refreshChatbotWithNewData();
  };

  const checkConversationHealth = () => {
    // If we have too many consecutive errors, mark as unhealthy
    if (retryCount >= 3) {
      setIsHealthy(false);
      return false;
    }
    
    // If we've had recent failures, provide a warning but allow continuation
    if (retryCount >= 1) {
      console.warn(`Conversation health warning: ${retryCount} recent failures`);
    }
    
    return true;
  };

  const createSystemPrompt = () => {
    const coursesData = courses.map(course => ({
      university: course.university,
      course: course.courseName,
      requiredAPS: course.requiredAPS,
      requiredSubjects: course.requiredSubjects,
      personalityType: course.personalityType,
      brainInfo: course.brainInfo,
      heartInfo: course.heartInfo
    }));

    const universitiesData = universities.map(uni => ({
      name: uni.name,
      description: uni.description,
      campusTips: uni.campusTips
    }));

    return `You are a friendly, supportive, and knowledgeable university admissions and career advisor.

STUDENT'S PERSONAL INFORMATION:
- APS Scores:
  * Wits: ${apsResults.wits !== null ? apsResults.wits : 'Not calculated yet'}
  * UJ: ${apsResults.uj !== null ? apsResults.uj : 'Not calculated yet'}
  * UP: ${apsResults.up !== null ? apsResults.up : 'Not calculated yet'}
- Subjects: ${userSubjects.length > 0 ? userSubjects.join(', ') : 'Not selected yet'}
- Personality Type: ${personalityType || 'Not determined yet'}

CORE CAPABILITIES:
- Provide personalized advice based on student's marks and profile for each university
- Explain APS requirements, subject prerequisites, and course content for Wits, UJ, and UP
- Compare universities based on student preferences (e.g., "theoretical vs. practical")
- Match personality traits to suitable degrees at each university
- Give specific advice about which university might be best based on their APS scores

CONVERSATIONAL GUIDELINES:
- **Keep it concise:** Maximum 2-3 paragraphs, short and to the point
- **Avoid conversational dead ends:** Always end with a clear, open-ended question
- **Manage expectations:** If requests are too broad, ask clarifying questions
- **Handle errors gracefully:** Provide simple, helpful messages instead of long explanations
- **Be university-specific:** When giving advice, consider the student's APS score for each university separately

FORMATTING REQUIREMENTS:
- **Always use proper Markdown formatting:** Use ## headings, bullet points (*), and proper paragraph spacing
- **Use clear paragraph breaks:** Separate different ideas with blank lines for readability
- **Bold key terms:** Use **bold** for important course names, universities, or concepts
- **Structure responses well:** Use headings, lists, and paragraphs to make information easy to scan
- **Do NOT include:** Lengthy explanations of how you work, disclaimers about data, or information about your model/APIs

Available courses: ${coursesData.length} courses with APS requirements, subjects, and personality matches.
Universities: ${universitiesData.length} universities with reviews and campus tips.

Remember: Be helpful, conversational, and always guide students to their next step with a question.

IMPORTANT: Use the conversation history to provide contextual responses. Don't ask for information the student has already provided in previous messages. Build on what they've already told you.

CRITICAL: When asked about specific courses or universities, provide detailed, actionable information. Don't give vague responses or ask unnecessary clarifying questions if the student has already specified what they want to know.

UNIVERSITY-SPECIFIC GUIDANCE: Always consider the student's APS score for each university when giving advice. A student might qualify for courses at one university but not another due to different APS requirements.`;
  };

  const sendMessage = async (retryAttempt = 0) => {
    if (!inputMessage.trim() || isLoading) return;
    
    // Check conversation health before proceeding
    if (!checkConversationHealth()) {
      const healthMessage: Message = {
        id: Date.now().toString(),
        content: "⚠️ **Conversation Health Check Failed**\n\nI've detected multiple consecutive errors. Please use the refresh button (🔄) to reset the conversation and try again.",
        isUser: false,
        timestamp: new Date()
      };
      setLocalMessages(prev => [...prev, healthMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    // Add user message immediately
    setLocalMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    // Debug logging
    console.log('Sending message to AI with data:', { apsResults, userSubjects, personalityType });
    console.log('System prompt data:', { 
      apsResults: apsResults,
      userSubjects: userSubjects.length > 0 ? userSubjects.join(', ') : 'Not selected yet',
      personalityType: personalityType || 'Not determined yet'
    });

          try {
        // Prepare conversation history for Gemini
        // Only include the last 6 messages to prevent API overload and maintain context
        const recentMessages = messages.slice(-6);
        
        // Build the conversation history properly
        const conversationHistory = [];
        
        // Add system prompt as the first message
        conversationHistory.push({
          role: "user",
          parts: [{ text: createSystemPrompt() }]
        });
        
        // Add conversation history in proper format
        recentMessages.forEach(msg => {
          conversationHistory.push({
            role: msg.isUser ? "user" : "model",
            parts: [{ text: msg.content }]
          });
        });
        
        // Add the current user message
        conversationHistory.push({
          role: "user",
          parts: [{ text: currentInput }]
        });

        const requestBody = {
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800, // Reduced to prevent issues
            topP: 0.8,
            topK: 40
          }
        };

      console.log('Sending request to Gemini:', requestBody);
      console.log('Conversation history length:', conversationHistory.length);
      console.log('First few conversation messages:', conversationHistory.slice(0, 3));

              const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // Reduced timeout to 12 seconds for faster recovery

      const currentAPIKey = getCurrentAPIKey();
      if (!currentAPIKey) {
        throw new Error("No available API keys - all keys are rate limited");
      }
      
      const response = await fetch(`${GEMINI_API_URL}?key=${currentAPIKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Gemini response status:', response.status);
      console.log('Gemini response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini response data:', data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error("Invalid response format from Gemini API");
      }
      
      // Add the bot response message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.candidates[0].content.parts[0].text,
        isUser: false,
        timestamp: new Date()
      };
      
      console.log('Created bot message:', botMessage);
      setLocalMessages(prev => [...prev, botMessage]);
      setRetryCount(0); // Reset retry count on success
      
      // Reset conversation health on success
      setIsHealthy(true);
    } catch (error) {
      console.error("Gemini API error:", error);
      
      let errorContent = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
      
              if (error.name === 'AbortError') {
          errorContent = "Request timed out after 12 seconds. Please try again with a shorter question.";
        } else if (error.message.includes('Failed to fetch')) {
        errorContent = "Network error. Please check your connection and try again.";
      } else if (error.message.includes('JSON')) {
        errorContent = "Invalid response received. Please try again.";
      } else if (error.message.includes('HTTP 429')) {
        // Handle rate limiting specifically
        const currentKey = getCurrentAPIKey();
        if (currentKey) {
          // Mark current key as rate limited and try to rotate
          apiKeyManager.markKeyAsRateLimited(currentKey);
          
          // Check if we have other keys available
          if (apiKeyManager.hasAvailableKeys()) {
            errorContent = `🔄 **Key Rate Limited** - Switching to backup API key and retrying...`;
            
            // Add the error message
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: errorContent,
              isUser: false,
              timestamp: new Date()
            };
            
            setLocalMessages(prev => [...prev, errorMessage]);
            
            // Retry immediately with new key
            setTimeout(() => {
              sendMessage(retryAttempt);
            }, 1000);
            
            return; // Don't increment retry count yet
          }
        }
        
        // If no keys available or all keys are rate limited
        if (retryAttempt < RETRY_DELAYS.length) {
          const delay = RETRY_DELAYS[retryAttempt];
          errorContent = `🔄 **All Keys Rate Limited** - Retrying in ${delay/1000} seconds...`;
          
          // Add the error message
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: errorContent,
            isUser: false,
            timestamp: new Date()
          };
          
          setLocalMessages(prev => [...prev, errorMessage]);
          
          // Retry after delay
          setTimeout(() => {
            sendMessage(retryAttempt + 1);
          }, delay);
          
          return; // Don't increment retry count yet
        } else {
          errorContent = "⚠️ **All API Keys Rate Limited** - Please wait a few minutes before asking another question, or try refreshing the conversation.";
        }
      } else if (error.message.includes('HTTP')) {
        errorContent = `Server error (${error.message}). Please try again in a moment.`;
      }
      
      // Add an error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        isUser: false,
        timestamp: new Date()
      };
      
      setLocalMessages(prev => [...prev, errorMessage]);
      
      // Increment retry count for potential retry logic
      setRetryCount(prev => prev + 1);
      
      // If we've had too many failures, provide a fallback response
      if (retryCount >= 2) {
        const fallbackMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: `💡 **Fallback Response**\n\nSince I'm having technical difficulties, here's some general advice based on your profile:\n\n🎯 **APS Scores ${apsResults.wits}, ${apsResults.uj}, ${apsResults.up}**: You qualify for many courses across all universities! Consider:\n• **Engineering** (if you have Mathematics + Physical Science)\n• **Commerce** (Accounting, Business Management)\n• **Humanities** (Psychology, History, Languages)\n\n📚 **Your Subjects**: ${userSubjects.join(', ')}\n• **Mathematics**: Opens doors to Engineering, Science, Commerce\n• **Accounting**: Great for Business, Finance, Economics\n• **IT**: Perfect for Computer Science, Information Systems\n\n🧠 **Personality ${personalityType}**: ISTJ types excel in:\n• **Structured programs** like Engineering, Accounting\n• **Practical fields** like IT, Business\n• **Research-based** courses like Computer Science\n\n🏫 **University Recommendations**:\n• **Wits**: Strong in Engineering and Sciences\n• **UJ**: Excellent for Business and IT\n• **UP**: Top choice for Agriculture and Health Sciences\n\nTry refreshing the conversation or ask a specific question when I'm back online!`,
          isUser: false,
          timestamp: new Date()
        };
        
        setLocalMessages(prev => [...prev, fallbackMessage]);
      }
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

${apsResults.wits !== null ? `🎯 **Your Wits APS Score: ${apsResults.wits}**` : '🎯 **Calculate your Wits APS score first** for personalized advice'}
${apsResults.uj !== null ? `🎯 **Your UJ APS Score: ${apsResults.uj}**` : '🎯 **Calculate your UJ APS score first** for personalized advice'}
${apsResults.up !== null ? `🎯 **Your UP APS Score: ${apsResults.up}**` : '🎯 **Calculate your UP APS score first** for personalized advice'}
${userSubjects.length > 0 ? `📚 **Your Subjects: ${userSubjects.join(', ')}**` : '📚 **Select your subjects** to see course requirements'}
${personalityType ? `🧠 **Your Personality: ${personalityType}**` : '🧠 **Personality test available** (optional but helpful!)'}

I can help you with:
🎯 **Personalized Course Matching** - Based on your actual scores and subjects
🧠 **Course Recommendations** - Based on your interests and strengths
📚 **Subject Requirement Checking** - See if you qualify for specific courses
🏫 **University Comparisons** - Compare Wits, UJ, and UP
💡 **Course Insights** - Get real student experiences

${apsResults.wits !== null && apsResults.uj !== null && apsResults.up !== null ? `What would you like to know? You can ask me anything like:\n• "What courses can I apply for at Wits with my ${apsResults.wits} APS score?"\n• "Do my subjects qualify me for Engineering at UJ?"\n• "What courses match my personality type at UP?"` : 'Start by calculating your APS scores for the best guidance! The personality test is optional but can help find courses that match your learning style.'}

${apsResults.wits !== null && apsResults.uj !== null && apsResults.up !== null ? `\n💡 **Quick Tip**: I can now give you personalized advice based on your ${apsResults.wits}, ${apsResults.uj}, and ${apsResults.up} APS scores and ${userSubjects.join(', ')} subjects!` : ''}

💬 **Pro Tip**: For the best responses, ask complete questions like "I prefer a theoretical approach, what courses would that lead to?" instead of single words like "theoretical".

${apsResults.wits !== null && apsResults.uj !== null && apsResults.up !== null ? `\n🔍 **Debug Info**: I can see your APS scores are ${apsResults.wits}, ${apsResults.uj}, and ${apsResults.up} and subjects are ${userSubjects.join(', ')}` : ''}`,
        isUser: false,
        timestamp: new Date()
      };
      
      setLocalMessages([welcomeMessage]);
    }
  }, [isOpen, apsResults, userSubjects, personalityType, messages.length]);

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
      <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-primary">
              Campus Guide 🎓
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`} title={isHealthy ? 'Conversation healthy' : 'Conversation needs attention'} />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                🔑 {apiKeyManager.getAvailableKeysCount()}/{apiKeyManager.getKeysStatus().length}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeyManager(true)}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Manage API Keys"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetConversation}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Data Updated Notification */}
          {showDataUpdated && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/50 border-b border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                <span className="text-blue-600 dark:text-blue-400">🔄</span>
                <span className="text-sm font-medium">Your data has been updated!</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {apsResults.wits !== null && `Wits APS: ${apsResults.wits}`}
                {apsResults.uj !== null && ` • UJ APS: ${apsResults.uj}`}
                {apsResults.up !== null && ` • UP APS: ${apsResults.up}`}
                {apsResults.wits !== null && personalityType !== null && ' • '}
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
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {message.isUser ? (
                    message.content
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                          h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic text-gray-600 dark:text-gray-400">{children}</blockquote>
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-6 h-6 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-blue-400 rounded-full animate-ping"></div>
                    </div>
                                         <div className="flex space-x-1">
                       <span className="text-blue-600 dark:text-blue-400 font-medium">Thinking</span>
                       <div className="flex space-x-1">
                         <div className="w-1 h-1 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce"></div>
                         <div className="w-1 h-1 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                         <div className="w-1 h-1 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                       </div>
                     </div>
                   </div>
                   <p className="text-xs text-blue-500 dark:text-blue-400 mt-2 italic">Analyzing your data and finding the perfect courses...</p>
                   <p className="text-xs text-blue-400 dark:text-blue-500 mt-1">This may take up to 12 seconds...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

                     <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about universities... (e.g., 'What courses match my personality?')"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
                         <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
               💡 Tip: Ask complete questions for better responses • {retryCount > 0 && `Retries: ${retryCount}`}
             </div>
          </div>
        </CardContent>
      </Card>
      
      {/* API Key Manager Modal */}
      <APIKeyManagerComponent 
        isOpen={showKeyManager}
        onClose={() => setShowKeyManager(false)}
      />
    </div>
  );
};

export default ChatBot;