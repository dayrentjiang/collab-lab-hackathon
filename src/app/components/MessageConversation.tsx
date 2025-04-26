"use client"

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { getAllMessages } from '../../actions/message'; // Adjust import path as needed
import { formatDistanceToNow } from 'date-fns'; // You may need to install this package

type Message = {
  msg_id: number;
  msg_sender_id: string;
  msg_receiver_id: string;
  project_id?: number;
  msg_content: string;
  sent_at: string;
  is_read: boolean;
};

type MessageConversationProps = {
  recipientId: string;
  projectId?: number;
  className?: string;
};

export default function MessageConversation({ 
  recipientId, 
  projectId,
  className = '' 
}: MessageConversationProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when component mounts or when recipient/project changes
  useEffect(() => {
    async function fetchMessages() {
      if (!user?.id || !recipientId) return;
      
      try {
        setLoading(true);
        
        const fetchedMessages = await getAllMessages(
          user.id,        // Current user ID (sender)
        );
        
        console.log("Fetched messages:", fetchedMessages);
        setMessages(fetchedMessages);
      } catch (err: any) {
        console.error("Error fetching messages:", err);
        setError(err.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    }
    
    fetchMessages();
    
    // Set up a polling interval to check for new messages
    const intervalId = setInterval(fetchMessages, 30000); // Check every 30 seconds
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [user?.id, recipientId, projectId]);
  
  // Scroll to bottom when new messages are loaded
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <p className="text-gray-500">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {messages.map((message) => {
            const isCurrentUser = message.msg_sender_id === user?.id;
            
            return (
              <div 
                key={message.msg_id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] rounded-lg p-3 ${
                    isCurrentUser 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.msg_content}</p>
                  <div 
                    className={`text-xs mt-1 ${
                      isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.sent_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
        </div>
      </div>
    </div>
  );
}