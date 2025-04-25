import React from "react";
import AIChatBot from "../components/AIChatBot";
import { auth } from "@clerk/nextjs/server";

const CollabLabAI = async () => {
  const { userId } = await auth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <AIChatBot userId={userId || ""} />
    </div>
  );
};

export default CollabLabAI;
