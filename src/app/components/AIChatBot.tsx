"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, Bot, User, AlertCircle } from "lucide-react";
import { getUserSkills, getUserByClerkId } from "../../actions/user"; // Import your database action

// Define TypeScript interfaces
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface Skill {
  skill_id: number;
  skill_name: string;
  skill_category?: string;
}

interface AIChatBotProps {
  userId: string;
}

const AIChatBot: React.FC<AIChatBotProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: `Hi there! I'm your project idea assistant. How can I help you today? I'll tailor my suggestions based on your skills.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user skills from database on component mount
  useEffect(() => {
    const fetchUserSkills = async () => {
      if (!userId) return;

      try {
        setIsLoadingSkills(true);
        const skillsData = await getUserSkills(userId);
        console.log("Raw skills data:", skillsData);

        // Process skills data based on the actual structure
        if (Array.isArray(skillsData)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const processedSkills = skillsData.map((skillItem: any) => {
            // Extract from nested structure
            if (
              skillItem.skill_id &&
              typeof skillItem.skill_id === "object" &&
              !Array.isArray(skillItem.skill_id)
            ) {
              return {
                skill_id: skillItem.skill_id.skill_id || 0,
                skill_name: skillItem.skill_id.skill_name || "Unknown",
                skill_category: skillItem.skill_id.skill_category || "Other"
              };
            } else {
              // Fallback for direct properties
              return {
                skill_id:
                  typeof skillItem.skill_id === "number"
                    ? skillItem.skill_id
                    : 0,
                skill_name: skillItem.skill_name || "Unknown",
                skill_category: skillItem.skill_category || "Other"
              };
            }
          });

          console.log("Processed skills:", processedSkills);
          setUserSkills(processedSkills);

          //get the user name
          const userData = await getUserByClerkId(userId);
          console.log("User Data:", userData);
          if (userData) {
            const name = userData.user_name || "User";

            // Update the greeting message with the user's name
            setMessages((prevMessages) => [
              {
                id: 1,
                role: "assistant",
                content: `Hi ${name}! I'm your project idea assistant. How can I help you today? I'll tailor my suggestions based on your skills.`
              },
              ...prevMessages.slice(1)
            ]);
          } else {
            console.error("User data not found for userId:", userId);
          }
        } else {
          console.log("Skills data is not an array:", skillsData);
          setUserSkills([]);
        }
      } catch (err) {
        console.error("Error fetching user skills:", err);
        setError(
          "Failed to load your skills. Some recommendations may not be personalized."
        );
      } finally {
        setIsLoadingSkills(false);
      }
    };

    fetchUserSkills();
  }, [userId]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Process and format skills for OpenAI
  const processSkillsForAI = () => {
    // Extract skill names for a simpler representation
    const skillNames = userSkills.map((skill) => skill.skill_name);

    // Log the skills we're sending to ensure they're formatted correctly
    console.log("Processed skills for AI:", skillNames);

    return skillNames;
  };

  // Call OpenAI API with user skills
  const callOpenAI = async (
    messageHistory: { role: string; content: string }[]
  ) => {
    try {
      // Get formatted skills
      const processedSkills = processSkillsForAI();
      console.log("Processed skills for OpenAI:", processedSkills);

      // Prepare request body with skills included
      const requestBody = {
        messages: messageHistory,
        userSkills: processedSkills // Send just the array of skill names for simplicity
      };

      console.log("Sending to API:", requestBody);

      // Add user skills to the request
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response from AI");
      }

      const data = await response.json();
      return data.message;
    } catch (err) {
      console.error("Error calling OpenAI:", err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Clear any previous errors
    setError(null);

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare messages for OpenAI - convert to format expected by API
      const formattedMessages = [
        // System message to guide the AI - we'll add this in our API
        // then all our UI messages
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content
        })),
        // Add the user's latest message
        {
          role: userMessage.role,
          content: userMessage.content
        }
      ];

      // Call OpenAI API
      const aiResponse = await callOpenAI(formattedMessages);

      // Add AI response to chat
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse.content
      };

      setMessages((prev) => [...prev, aiMessage]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isLoading) return;
    setInput(promptText);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
        Project Idea Assistant
      </h1>

      {/* Skills loading indicator */}
      {isLoadingSkills && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl mb-4 flex items-center justify-center shadow-sm border border-blue-100">
          <Loader size={16} className="animate-spin mr-2" />
          <span>Loading your skills profile...</span>
        </div>
      )}

      {/* Skills summary - shows what skills were loaded */}
      {!isLoadingSkills && userSkills.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 text-blue-800 p-6 rounded-xl mb-6 shadow-sm border border-blue-100">
          <div className="text-sm font-medium mb-3">Your skills:</div>
          <div className="flex flex-wrap gap-2">
            {userSkills.map((skill) => (
              <span
                key={skill.skill_id}
                className="bg-white text-blue-700 px-4 py-2 rounded-full text-sm shadow-sm border border-blue-100 hover:bg-blue-50 transition-all"
              >
                {skill.skill_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chat container */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col h-[600px] border border-gray-100">
        {/* Message history */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[80%] p-4 rounded-2xl
                  ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-tr-none shadow-md"
                      : "bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100"
                  }
                `}
              >
                <div className="flex items-center mb-2">
                  {message.role === "assistant" ? (
                    <Bot size={18} className="mr-2 text-blue-500" />
                  ) : (
                    <User size={18} className="mr-2 text-white" />
                  )}
                  <span className="font-medium text-sm">
                    {message.role === "assistant"
                      ? "Collab Lab Assistant"
                      : "You"}
                  </span>
                </div>
                <div className="whitespace-pre-line">{message.content}</div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center mb-4">
              <div className="bg-white text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <Bot size={18} className="mr-2 text-blue-500" />
                  <span className="font-medium text-sm">Collab Lab AI</span>
                </div>
                <div className="flex items-center mt-2">
                  <Loader size={16} className="animate-spin mr-2 text-blue-500" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex justify-center mb-4">
              <div className="bg-red-50 text-red-700 p-4 rounded-xl max-w-[90%] flex items-start shadow-sm border border-red-100">
                <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 p-6 bg-white">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about project ideas, features, or implementation..."
              className="flex-1 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-3 rounded-full hover:from-blue-600 hover:to-teal-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !input.trim()}
            >
              <Send size={20} />
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() =>
                handleQuickPrompt("Suggest a project idea based on my skills")
              }
              className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full transition-all shadow-sm border border-blue-100"
              disabled={isLoading}
            >
              Project for my skills
            </button>
            <button
              onClick={() =>
                handleQuickPrompt(
                  "What should I learn next to improve my skill set?"
                )
              }
              className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full transition-all shadow-sm border border-blue-100"
              disabled={isLoading}
            >
              What to learn next
            </button>
            <button
              onClick={() =>
                handleQuickPrompt(
                  "Recommend a tech stack that matches my skills"
                )
              }
              className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full transition-all shadow-sm border border-blue-100"
              disabled={isLoading}
            >
              Tech stack match
            </button>
            <button
              onClick={() =>
                handleQuickPrompt(
                  "What challenges might I face with my skill level?"
                )
              }
              className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full transition-all shadow-sm border border-blue-100"
              disabled={isLoading}
            >
              Potential challenges
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        This AI assistant provides project suggestions based on your skill
        profile. All recommendations are tailored to your experience level.
      </div>
    </div>
  );
};

export default AIChatBot;
