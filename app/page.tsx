"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { KonaiiLogo } from "@/components/konaii-logo"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function Home() {
  const router = useRouter()
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/chat');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!linkedinUrl || !email) return

    setIsSubmitting(true)

    try {
      // Call the API route that will trigger the Make.com workflow
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          linkedinUrl,
          email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      // Store the profile data in localStorage
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          linkedinUrl,
          email,
          timestamp: new Date().toISOString(),
        }),
      )

      // Show success message
      toast({
        title: "Check your email",
        description: "We've sent you a login link to access your account.",
      })

      // Redirect to the login page
      router.push("/login")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <KonaiiLogo />
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your AI Co-Pilot Will Search & Match Jobs For You
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Chat with our AI assistant to find your perfect job, get career advice, and track your professional
                    growth.
                  </p>
                </div>
                <div className="flex flex-col gap-4 max-w-md">
                  <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="LinkedIn Profile URL"
                        className="flex-1"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Email Address"
                        type="email"
                        className="flex-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Button type="submit" className="gap-1" disabled={isSubmitting}>
                        {isSubmitting ? (
                          "Processing..."
                        ) : (
                          <>
                            Search <Search className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Share your LinkedIn profile and email to start your personalized job search journey.
                    </p>
                  </form>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="relative overflow-hidden rounded-xl border bg-background p-2">
                  <div className="rounded-lg border bg-muted p-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            AI
                          </div>
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden">
                          <p className="text-sm font-medium leading-none">Konaii.ai</p>
                          <div className="rounded-lg bg-muted-foreground/10 p-3">
                            <p className="text-sm">
                              Hi there! I'm your AI career assistant. I can help you find jobs, provide career advice,
                              and track your professional growth. What are you looking for today?
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-secondary/10 p-2">
                          <div className="h-6 w-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                            U
                          </div>
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden">
                          <p className="text-sm font-medium leading-none">You</p>
                          <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-sm">
                              I'm looking for a senior product manager role in tech, preferably remote.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            AI
                          </div>
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden">
                          <p className="text-sm font-medium leading-none">Konaii.ai</p>
                          <div className="rounded-lg bg-muted-foreground/10 p-3">
                            <p className="text-sm">
                              Great! I'll search for senior product manager roles that offer remote work. To provide the
                              most relevant matches, could you share a bit about your experience and skills?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered assistant helps you navigate your career journey with personalized guidance.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Share Your LinkedIn</h3>
                  <p className="text-muted-foreground">
                    Connect your LinkedIn profile to let our AI analyze your experience and skills.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Secure Login</h3>
                  <p className="text-muted-foreground">
                    Receive a secure login link via email to access your personalized dashboard.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Get Personalized Matches</h3>
                  <p className="text-muted-foreground">
                    Receive job recommendations tailored to your unique profile and preferences.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Apply With Ease</h3>
                  <p className="text-muted-foreground">
                    Apply to jobs directly through our platform with one-click applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Konaii.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}

