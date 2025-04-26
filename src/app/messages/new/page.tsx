"use client"

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { getUserByClerkId } from '../../../actions/user';
import DirectMessageForm from '../../components/DirectMessageForm';
import Link from 'next/link';

export default function NewMessagePage() {

  const { user: clerkUser, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const recipientId = searchParams.get('recipient');
  
  const [userData, setUserData] = useState<any>(null);
  const [recipientData, setRecipientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!isLoaded || !clerkUser) return;
      
      try {
        // Load current user data
        const user = await getUserByClerkId(clerkUser.id);
        setUserData(user);

        console.log("Current User Data:", user);
        
        // Only try to load recipient data if a recipient ID is provided
        if (recipientId) {
          const recipient = await getUserByClerkId(recipientId);
          setRecipientData(recipient);
          
          if (!recipient) {
            setError("Recipient not found");
          }
        } else {
          setError("No recipient specified");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load required data");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [clerkUser, isLoaded, recipientId]);

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!clerkUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-red-500">You must be logged in to send messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/messages" className="text-blue-500 hover:text-blue-700">
          ← Back to Messages
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">New Message</h1>
        
        {error ? (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            {error}
          </div>
        ) : null}
        
        {userData && recipientData ? (
          <DirectMessageForm 
            senderData={userData}
            recipientData={recipientData}
            onMessageSent={() => {
              // Navigate back to messages after sending
              window.location.href = '/';
            }}
          />
        ) : (
          <p className="text-gray-500">
            {!recipientId ? "Please specify a recipient" : "Loading message form..."}
          </p>
        )}
      </div>
    </div>
  );
}