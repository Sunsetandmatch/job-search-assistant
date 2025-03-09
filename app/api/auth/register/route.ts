import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { linkedinUrl, email } = await req.json()

    if (!linkedinUrl || !email) {
      return NextResponse.json({ message: "LinkedIn URL and email are required" }, { status: 400 })
    }

    // Here we would call the Make.com API to trigger the workflow
    // This is a placeholder for the actual implementation
    const makeResponse = await fetch("https://hook.eu1.make.com/your-webhook-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        linkedinUrl,
        email,
        action: "register",
      }),
    })

    if (!makeResponse.ok) {
      throw new Error("Failed to register user with Make.com")
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Check your email for login instructions.",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 },
    )
  }
}

