import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json({ message: "Email and code are required" }, { status: 400 })
    }

    // Here we would call the Make.com API to verify the login code
    // This is a placeholder for the actual implementation
    const makeResponse = await fetch("https://hook.eu1.make.com/your-webhook-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
        action: "verify-code",
      }),
    })

    if (!makeResponse.ok) {
      throw new Error("Invalid login code")
    }

    // Set a cookie to indicate the user is authenticated
    cookies().set("isAuthenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({
      success: true,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 },
    )
  }
}

