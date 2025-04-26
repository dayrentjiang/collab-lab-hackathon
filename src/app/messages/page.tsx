"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useSearchParams } from "next/navigation";
import { getAllMessages } from "../../actions/message"; // adjust path if needed

interface Message {
  msg_id: number;
  msg_content: string;
  msg_sender_id: string;
  msg_receiver_id: string;
  sent_at: string;
  is_read: boolean;
  project_id: number | null;
}

export default function MessagesDisplayPage() {
  const { isLoaded, user } = useUser();
  const params = useParams();
  const searchParams = useSearchParams();

  const recipientId =
    (params.recipientId as string) || searchParams.get("recipient");

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        const fetchedMessages = await getAllMessages(user?.id); // fetch ALL messages
        setMessages(fetchedMessages);
      } catch (err: any) {
        console.error("Error fetching messages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      fetchMessages();
    }
  }, [user?.id]);

  if (!isLoaded || loading) {
    return <div className="p-8 text-center">Loading messages...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center">Please sign in to view messages</div>
    );
  }

  // 🛠️ Filter messages between current user and recipient (optional: check project_id too)

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {messages.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No messages found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.msg_id}
              className={`p-4 rounded-lg max-w-md ${
                msg.msg_sender_id === user.id
                  ? "bg-blue-100 ml-auto"
                  : "bg-gray-100 mr-auto"
              }`}
            >
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>{msg.msg_sender_id === user.id ? "You" : "Them"}</span>
                <span>{new Date(msg.sent_at).toLocaleString()}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.msg_content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
