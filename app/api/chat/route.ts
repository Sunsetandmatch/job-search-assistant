import { openai } from "@ai-sdk/openai"
import { OpenAIStream } from "ai"

export async function POST(req: Request) {
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

    const stream = await OpenAIStream({
      model: "gpt-4",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    })

    return new Response(stream)
  } catch (error) {
    console.error("Chat error:", error)
    return new Response(
      JSON.stringify({ message: error instanceof Error ? error.message : "Chat processing failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

