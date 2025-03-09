"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface LinkedInFormProps {
  onSubmit: (linkedinUrl: string, email: string) => void
}

export default function LinkedInForm({ onSubmit }: LinkedInFormProps) {
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate processing
    setTimeout(() => {
      onSubmit(linkedinUrl, email)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Connect Your LinkedIn</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="linkedin" className="text-sm font-medium">
              LinkedIn Profile URL
            </label>
            <Input
              id="linkedin"
              placeholder="https://www.linkedin.com/in/yourprofile"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              We'll analyze your profile to provide personalized job recommendations
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">We'll use this to send you job alerts and updates</p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-center text-muted-foreground">
          By submitting, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </Card>
  )
}

