"use client"

import React, { useState } from 'react';
import { createMessage } from '../../actions/message'; // Adjust this import path as needed

type DirectMessageFormProps = {
  senderData: any;
  recipientData: any;
  onMessageSent?: () => void;
};

export default function DirectMessageForm({ 
  senderData, 
  recipientData, 
  onMessageSent 
}: DirectMessageFormProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      setSending(true);
      setError(null);
      
      console.log("Sending direct message:");
      console.log("- From:", senderData.user_name, "(", senderData.user_clerk_id, ")");
      console.log("- To:", recipientData.user_name, "(", recipientData.user_clerk_id, ")");
      console.log("- Content:", message);

      // Call your createMessage function
      const result = await createMessage(
        recipientData.user_clerk_id, // message_receiver_id
        senderData.user_clerk_id,    // message_sender_id
        message,                     // message_content
        null                         // No project ID for direct messages
      );
      
      console.log("Message sent successfully:", result);
      
      setMessage('');
      setSuccess(true);
      
      // Call callback after a short delay to show success message
      if (onMessageSent) {
        setTimeout(() => {
          onMessageSent();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-semibold">To:</span>
          <span className="text-gray-800">
            {recipientData.user_name} 
            {recipientData.user_email && <span className="text-gray-500 ml-1">({recipientData.user_email})</span>}
          </span>
        </div>
        {recipientData.user_role && (
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {recipientData.user_role.charAt(0).toUpperCase() + recipientData.user_role.slice(1)}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Message sent successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
            disabled={sending}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending || !message.trim()}
            className={`px-4 py-2 rounded-md text-white ${
              sending || !message.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}