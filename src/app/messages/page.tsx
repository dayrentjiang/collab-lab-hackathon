"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllMessages } from "../../actions/message";
import { getUserByClerkId } from "../../actions/user";

interface Message {
  msg_id: number;
  msg_content: string;
  msg_sender_id: string;
  msg_receiver_id: string;
  sent_at: string;
  is_read: boolean;
  project_id: number | null;
}

interface UserMap {
  [key: string]: string;
}

export default function MessagesDisplayPage() {
  const { isLoaded, user } = useUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [userMap, setUserMap] = useState<UserMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessagesAndUsers() {
      try {
        const fetchedMessages = await getAllMessages(user!.id);

        const uniqueUserIds = new Set<string>();
        fetchedMessages.forEach((msg) => {
          uniqueUserIds.add(msg.msg_sender_id);
          uniqueUserIds.add(msg.msg_receiver_id);
        });

        const userMapTemp: UserMap = {};
        await Promise.all(
          Array.from(uniqueUserIds).map(async (id) => {
            try {
              const userData = await getUserByClerkId(id);
              userMapTemp[id] = userData.user_name || id;
            } catch {
              userMapTemp[id] = id;
            }
          })
        );

        setMessages(fetchedMessages);
        setUserMap(userMapTemp);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error fetching messages or users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user?.id) {
      fetchMessagesAndUsers();
    }
  }, [isLoaded, user?.id]);

  // 🛑 Separate loading and auth check early
  if (!isLoaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center">Please sign in to view messages</div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center">Loading messages...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  const incomingMessages = messages.filter(
    (msg) => msg.msg_receiver_id === user.id
  );
  const sentMessages = messages.filter((msg) => msg.msg_sender_id === user.id);

  return (
    <div className="container mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Messages</h1>
      {/* Incoming Messages */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📥 Incoming Messages</h2>
        {incomingMessages.length === 0 ? (
          <p className="text-gray-500">No incoming messages.</p>
        ) : (
          <div className="space-y-4">
            {incomingMessages.map((msg) => (
              <div
                key={msg.msg_id}
                className="p-4 bg-green-100 rounded-2xl shadow-sm max-w-xl"
              >
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>
                    From: {userMap[msg.msg_sender_id] || msg.msg_sender_id}
                  </span>
                  <span>{new Date(msg.sent_at).toLocaleString()}</span>
                </div>
                <p className="whitespace-pre-wrap break-words">
                  {msg.msg_content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* Sent Messages */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📤 Sent Messages</h2>
        {sentMessages.length === 0 ? (
          <p className="text-gray-500">You haven’t sent any messages yet.</p>
        ) : (
          <div className="space-y-4">
            {sentMessages.map((msg) => (
              <div
                key={msg.msg_id}
                className="p-4 bg-blue-100 rounded-2xl shadow-sm max-w-xl ml-auto"
              >
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>
                    To: {userMap[msg.msg_receiver_id] || msg.msg_receiver_id}
                  </span>
                  <span>{new Date(msg.sent_at).toLocaleString()}</span>
                </div>
                <p className="whitespace-pre-wrap break-words">
                  {msg.msg_content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
         
    </div>
  );
}
