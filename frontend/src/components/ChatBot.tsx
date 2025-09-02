import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Settings } from "lucide-react";
import { universities, courses } from "@/data/universityData";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveApiKey = (key: string) => {
    localStorage.setItem("openai_api_key", key);
    setApiKey(key);
    setShowApiKeyInput(false);
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

    return `You are a friendly university guidance counselor helping South African students choose the right university and course. You have access to data about Wits, UJ, and UCT universities.

Available courses and requirements:
${JSON.stringify(coursesData, null, 2)}

Universities information and reviews:
${JSON.stringify(universitiesData, null, 2)}

Your role:
- Be conversational, friendly, and supportive like a helpful friend
- Ask questions to understand their interests, academic strengths, and preferences
- Use the student reviews and experiences to give authentic insights
- Help them understand APS requirements and subject prerequisites
- Share campus tips and student experiences
- Guide them through personality-based course matching
- Be encouraging and positive

Keep responses concise but helpful. Ask follow-up questions to better understand their needs.`;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !apiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: createSystemPrompt() },
            ...messages.map(msg => ({
              role: msg.isUser ? "user" : "assistant",
              content: msg.content
            })),
            { role: "user", content: inputMessage }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.choices[0].message.content,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please check your API key and try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = () => {
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }
    
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content: "Hey there! 👋 I'm here to help you find the perfect university course. I know all about Wits, UJ, and UCT - from academic requirements to what student life is really like. What are you interested in studying, or do you want to explore your options?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
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
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKeyInput(true)}
                className="h-8 w-8 p-0"
              >
                <Settings className="w-4 h-4" />
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
          {showApiKeyInput && (
            <div className="p-4 border-b bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">
                Enter your OpenAI API key to start chatting:
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => saveApiKey(apiKey)}
                  disabled={!apiKey.trim()}
                  size="sm"
                >
                  Save
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your API key is stored locally and never shared.
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
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
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
                disabled={!apiKey || isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !apiKey || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {!apiKey && (
              <p className="text-xs text-gray-500 mt-1">
                Click the settings icon to add your OpenAI API key
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;