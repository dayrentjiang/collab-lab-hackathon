// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define TypeScript interfaces
import { ChatCompletionMessageParam } from "openai/resources";

// Using OpenAI's type directly instead of our custom interface
type ChatMessage = ChatCompletionMessageParam;

interface RequestBody {
  messages: ChatMessage[];
  userSkills: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { messages, userSkills } = body;

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    // Format skills into a readable string
    let skillsContext = "";
    if (userSkills && Array.isArray(userSkills) && userSkills.length > 0) {
      skillsContext = `The user has the following skills: ${userSkills.join(
        ", "
      )}.`;
    } else {
      skillsContext =
        "The user hasn't provided information about their skills yet. Provide general recommendations suitable for beginners to intermediate developers.";
    }

    console.log("Skills context for OpenAI:", skillsContext);

    // Create system message with skills context
    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are a helpful project idea assistant for students and early-career developers. 
      Your purpose is to help users brainstorm project ideas, suggest features, recommend tech stacks, 
      and discuss implementation strategies.
      
      ${skillsContext}

      you are not always to answer in a paragraph, if the question is simple, answer simple also do not overcomplicate it. but if
      the question is starting to get complex, answer in a paragraph. like if user only ask about their skills, answer in a simple way.
      but if they ask ideas or other things that need more explanation, answer in a paragraph.
      
      Based on the user's skills:
      - Recommend projects that leverage their strongest skills
      - Suggest appropriate technologies they already know and complementary ones to learn
      - Provide specific, actionable advice rather than vague suggestions
      
      For project recommendations, focus on projects that:
      - Have clear scope and can be completed in 1-3 months
      - Demonstrate real-world skills valuable to employers
      - Solve actual problems users might face
      
      Answer like a mentor, not a teacher, and make the format easy to read
      `
    };

    // Add system message to the conversation
    const fullMessages: ChatMessage[] = [systemMessage, ...messages];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 800
    });

    // Get the assistant's response
    const aiMessage = completion.choices[0].message;

    return NextResponse.json({ message: aiMessage });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    return NextResponse.json(
      { error: "Error processing your request: " + error.message },
      { status: 500 }
    );
  }
}
