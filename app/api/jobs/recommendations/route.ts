import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

// In a real application, you would use a proper secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: Request) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1]
    try {
      verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { linkedinUrl, conversationContext } = await req.json()

    if (!linkedinUrl) {
      return NextResponse.json({ message: "LinkedIn URL is required" }, { status: 400 })
    }

    // Here we would call the Make.com API to get job recommendations
    // This is a placeholder for the actual implementation
    // const makeResponse = await fetch('https://hook.eu1.make.com/your-webhook-id', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     linkedinUrl,
    //     conversationContext,
    //     action: 'get-job-recommendations',
    //   }),
    // })

    // if (!makeResponse.ok) {
    //   throw new Error('Failed to get job recommendations')
    // }

    // const data = await makeResponse.json()

    // For now, return mock data
    const mockJobs = [
      {
        id: 1,
        title: "Senior Product Manager",
        company: "TechCorp",
        location: "Remote",
        salary: "$120K - $150K",
        description: "Leading product strategy for our SaaS platform...",
        match: 92,
      },
      {
        id: 2,
        title: "Product Lead",
        company: "InnovateTech",
        location: "Remote (US)",
        salary: "$130K - $160K",
        description: "Driving product vision and roadmap for our AI solutions...",
        match: 88,
      },
      {
        id: 3,
        title: "Senior PM - Fintech",
        company: "FinanceAI",
        location: "Remote (Global)",
        salary: "$115K - $145K",
        description: "Managing our financial products suite with a focus on user experience...",
        match: 85,
      },
    ]

    return NextResponse.json({
      success: true,
      jobs: mockJobs,
    })
  } catch (error) {
    console.error("Job recommendations error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to get job recommendations" },
      { status: 500 },
    )
  }
}

