import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set. Please set it in your Vercel project settings.');
}

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        message: 'OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { messages } = await req.json()

    // System prompt to guide the AI assistant's behavior
    const systemPrompt = `
    You are an AI-powered job search assistant called Konaii.ai. 
    Your goal is to help users find jobs, provide career advice, and offer salary insights.

    When users first interact with you:
    - Ask clarifying questions about their career preferences, job type, location, and salary expectations
    - Explain that you'll analyze their profile to provide personalized recommendations

    When users ask about jobs:
    - Ask clarifying questions about their experience, skills, and preferences
    - Provide personalized job recommendations
    - Offer application tips and strategies

    When users ask about career advice:
    - Suggest skills to develop based on their career goals
    - Recommend career paths and growth opportunities
    - Provide industry insights and trends

    When users ask about salary:
    - Provide salary ranges based on role, experience, and location
    - Offer negotiation tips
    - Explain factors that influence compensation

    Always be helpful, professional, and encouraging.
    Refer to yourself as "Konaii.ai" or "your Konaii.ai assistant".
    
    Format your responses in a conversational, easy-to-read manner.
    Use line breaks to separate paragraphs and make your responses more readable.
    `

    // Here we would call the Make.com API to log the conversation
    // This is a placeholder for the actual implementation
    // try {
    //   await fetch('https://hook.eu1.make.com/your-webhook-id', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       messages,
    //       action: 'log-conversation',
    //     }),
    //   })
    // } catch (error) {
    //   console.error('Failed to log conversation:', error)
    // }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
    });

    return new StreamingTextResponse(OpenAIStream(response));
  } catch (error) {
    console.error("Chat error:", error)
    return new Response(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : "Chat processing failed",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

