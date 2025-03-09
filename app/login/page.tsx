"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { sendSignInLinkToEmail, onAuthStateChanged, Auth } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth not initialized. Please check your configuration.');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
      if (user) {
        router.push('/chat');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!auth) {
        throw new Error('Firebase auth not initialized');
      }

      const actionCodeSettings = {
        url: `${window.location.origin}/chat`,
        handleCodeInApp: true,
      }

      await sendSignInLinkToEmail(auth as Auth, email, actionCodeSettings)
      
      // Save the email and LinkedIn URL to localStorage for later use
      localStorage.setItem("emailForSignIn", email)
      localStorage.setItem("linkedinUrl", linkedinUrl)
      
      toast({
        title: "Success",
        description: "Magic link sent! Please check your email.",
      })
    } catch (error) {
      console.error("Error sending sign-in link:", error)
      toast({
        title: "Error",
        description: "Failed to send login link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Job Search Assistant</CardTitle>
          <CardDescription>
            Enter your email and LinkedIn profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="linkedin" className="text-sm font-medium">
                LinkedIn Profile URL
              </label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending Login Link..." : "Get Magic Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

