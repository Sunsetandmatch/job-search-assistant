import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Here we would call the Make.com API to trigger the login code workflow
    // This is a placeholder for the actual implementation
    const makeResponse = await fetch("https://hook.eu1.make.com/your-webhook-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        action: "send-login-code",
      }),
    })

    if (!makeResponse.ok) {
      throw new Error("Failed to send login code")
    }

    return NextResponse.json({
      success: true,
      message: "Login code sent successfully",
    })
  } catch (error) {
    console.error("Login code error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to send login code" },
      { status: 500 },
    )
  }
}

