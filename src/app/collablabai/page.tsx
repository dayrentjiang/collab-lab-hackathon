import React from "react";
import AIChatBot from "../components/AIChatBot";
import { auth } from "@clerk/nextjs/server";

const CollabLabAI = async () => {
  const { userId } = await auth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">CollabLab AI</h1>
      <p className="text-lg mb-8">
        Your AI assistant for project collaboration.
      </p>
      <AIChatBot userId={userId || ""} />
    </div>
  );
};

export default CollabLabAI;
