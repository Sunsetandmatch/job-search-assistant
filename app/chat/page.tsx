"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Send,
  User,
  Sparkles,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
  LayoutDashboard,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import JobCard from "@/components/job-card"
import ProfileSummary from "@/components/profile-summary"
import { KonaiiLogo } from "@/components/konaii-logo"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Message, JobListing, UserPreferences } from "@/lib/types"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatInput } from "@/components/chat/ChatInput"
import { useToast } from "@/components/ui/use-toast"

interface SuggestedReply {
  text: string
  onClick: () => void
}

export default function ChatPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [jobSuggestions, setJobSuggestions] = useState<any[]>([])
  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReply[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({})
  const [jobListings, setJobListings] = useState<JobListing[]>([])

  const [userProfile, setUserProfile] = useState({
    linkedinUrl: "",
    email: "",
    profileComplete: false,
  })

  const { messages: aiMessages, input, handleInputChange, handleSubmit, isLoading: aiLoading, append } = useChat({
    api: "/api/chat",
    initialMessages: [],
    onResponse: () => {
      setIsTyping(false)

      // Generate suggested replies based on the conversation context
      if (messages.length > 0) {
        generateSuggestedReplies()
      }

      // Simulate job search via Make.com
      if (messages.length >= 2 && userProfile.profileComplete) {
        fetchJobRecommendations()
      }
    },
    onFinish: () => {
      setIsTyping(false)
    },
  })

  const fetchJobRecommendations = async () => {
    try {
      // In a real implementation, this would call your Make.com integration
      // For now, we'll simulate a delay and return mock data
      const response = await fetch("/api/jobs/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          linkedinUrl: userProfile.linkedinUrl,
          conversationContext: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch job recommendations")
      }

      const data = await response.json()
      setJobSuggestions(data.jobs)

      // Notify the user about new job matches
      toast({
        title: "New Job Matches Found",
        description: `We found ${data.jobs.length} jobs that match your profile.`,
      })
    } catch (error) {
      console.error("Error fetching job recommendations:", error)
    }
  }

  const generateSuggestedReplies = () => {
    // In a real implementation, this would be based on AI analysis of the conversation
    // For now, we'll use static suggestions based on conversation length
    const lastMessage = messages[messages.length - 1]

    if (lastMessage.role === "assistant") {
      if (messages.length <= 3) {
        setSuggestedReplies([
          {
            text: "Tell me about product manager roles",
            onClick: () => handleInputChange({ target: { value: "Tell me about product manager roles" } } as any),
          },
          {
            text: "What skills are in demand?",
            onClick: () =>
              handleInputChange({ target: { value: "What skills are in demand for tech jobs right now?" } } as any),
          },
          {
            text: "Find remote jobs",
            onClick: () => handleInputChange({ target: { value: "Find me remote jobs in my field" } } as any),
          },
        ])
      } else {
        setSuggestedReplies([
          {
            text: "Show me more details",
            onClick: () =>
              handleInputChange({ target: { value: "Can you show me more details about these jobs?" } } as any),
          },
          {
            text: "Salary expectations?",
            onClick: () =>
              handleInputChange({ target: { value: "What are the salary expectations for these positions?" } } as any),
          },
          {
            text: "How to prepare for interviews?",
            onClick: () =>
              handleInputChange({ target: { value: "How should I prepare for interviews in this field?" } } as any),
          },
        ])
      }
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsTyping(true)
    setSuggestedReplies([])
    handleSubmit(e)
  }

  // Check authentication on component mount
  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth not initialized. Redirecting to login...');
      router.push('/login');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Initialize chat with welcome message when profile is loaded
  useEffect(() => {
    if (userProfile.profileComplete && messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        append({
          role: "assistant",
          content: `Welcome to Konaii.ai! I've analyzed your LinkedIn profile and I'm ready to help you find the perfect job. What kind of position are you looking for? You can specify role, industry, location preferences, or any other details.`,
        })
        setIsTyping(false)
      }, 1000)
    }
  }, [userProfile.profileComplete, messages.length, append])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping, suggestedReplies])

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, newMessage])
    setIsLoading(true)

    try {
      // Get the stored LinkedIn URL
      const linkedinUrl = localStorage.getItem("linkedinUrl")

      // Prepare the request to Make.com webhook
      const response = await fetch("https://hook.eu2.make.com/4enjoiwvv2tv5wivqdphpspy5e1gjnta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({
          message: content,
          linkedinUrl,
          userPreferences,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()
      
      // Update job listings if they're included in the response
      if (data.jobListings) {
        setJobListings(data.jobListings)
      }

      // Update user preferences if they're included in the response
      if (data.userPreferences) {
        setUserPreferences(data.userPreferences)
      }

      // Add AI response to messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex h-14 items-center border-b px-4">
            <KonaiiLogo />
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setActiveTab("chat")
                  setSidebarOpen(false)
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                AI Assistant
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setActiveTab("jobs")
                  setSidebarOpen(false)
                }}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Saved Jobs
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setActiveTab("profile")
                  setSidebarOpen(false)
                }}
              >
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setActiveTab("dashboard")
                  setSidebarOpen(false)
                }}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Job Alerts
              </Button>
              <Button variant="ghost" className="justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
          <div className="border-t p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium leading-none">User</p>
                <p className="text-xs text-muted-foreground truncate">{userProfile.email || "user@example.com"}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  localStorage.removeItem("authToken")
                  router.push("/login")
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r">
        <div className="flex h-14 items-center border-b px-4">
          <KonaiiLogo />
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Button
              variant="ghost"
              className={cn("justify-start", activeTab === "chat" && "bg-muted")}
              onClick={() => setActiveTab("chat")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              AI Assistant
            </Button>
            <Button
              variant="ghost"
              className={cn("justify-start", activeTab === "jobs" && "bg-muted")}
              onClick={() => setActiveTab("jobs")}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Saved Jobs
            </Button>
            <Button
              variant="ghost"
              className={cn("justify-start", activeTab === "profile" && "bg-muted")}
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Button>
            <Button
              variant="ghost"
              className={cn("justify-start", activeTab === "dashboard" && "bg-muted")}
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start">
              <Bell className="mr-2 h-4 w-4" />
              Job Alerts
            </Button>
            <Button variant="ghost" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium leading-none">User</p>
              <p className="text-xs text-muted-foreground truncate">{userProfile.email || "user@example.com"}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                localStorage.removeItem("authToken")
                router.push("/login")
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              {/* Add your sheet content here */}
            </SheetContent>
          </Sheet>
          <div className="md:hidden">
            <KonaiiLogo />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <div className="md:hidden border-b">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="chat"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="jobs"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
              >
                Jobs
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
              >
                Dashboard
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 overflow-hidden p-0">
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                      <div className="rounded-full bg-primary/10 p-4 mb-4">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-center mb-2">Your Konaii.ai Assistant</h2>
                      <p className="text-muted-foreground text-center max-w-md mb-8">
                        {userProfile.profileComplete
                          ? "I'm analyzing your LinkedIn profile. Please wait a moment..."
                          : "I can help you find jobs, provide career advice, and track your professional growth."}
                      </p>
                      {!userProfile.profileComplete && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg">
                          <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() =>
                              handleInputChange({ target: { value: "Find me a product manager job" } } as any)
                            }
                          >
                            Find me a job
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleInputChange({ target: { value: "Help me improve my resume" } } as any)}
                          >
                            Improve my resume
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() =>
                              handleInputChange({ target: { value: "What skills should I learn?" } } as any)
                            }
                          >
                            Skill recommendations
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() =>
                              handleInputChange({ target: { value: "What's a fair salary for my role?" } } as any)
                            }
                          >
                            Salary insights
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))
                  )}
                  {isLoading && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}

                  {/* Suggested Replies */}
                  {suggestedReplies.length > 0 && !isLoading && (
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {suggestedReplies.map((reply, index) => (
                        <Button key={index} variant="outline" size="sm" className="text-xs" onClick={reply.onClick}>
                          {reply.text}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {jobSuggestions.length > 0 && (
                <div className="border-t p-4 bg-muted/30">
                  <h3 className="text-sm font-medium mb-3">Recommended Jobs Based on Your Profile</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {jobSuggestions.map((job) => (
                      <Card key={job.id} className="min-w-[280px] max-w-[280px]">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-sm">{job.title}</h4>
                              <p className="text-xs text-muted-foreground">{job.company}</p>
                            </div>
                            <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                              {job.match}% Match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.salary}</span>
                          </div>
                          <p className="text-xs line-clamp-2 mb-2">{job.description}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="default" className="w-full text-xs">
                              Apply
                            </Button>
                            <Button size="sm" variant="outline" className="px-2">
                              <Bookmark className="h-4 w-4" />
                              <span className="sr-only">Save</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t p-4">
                <ChatInput onSend={handleSendMessage} disabled={isLoading || !input.trim()} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="flex-1 overflow-auto p-4">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold">Saved Jobs</h2>
              <div className="grid gap-4">
                {jobSuggestions.length > 0 ? (
                  jobSuggestions.map((job) => <JobCard key={job.id} job={job} />)
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No saved jobs yet</h3>
                      <p className="text-muted-foreground mb-4">
                        When you find jobs you're interested in, save them here for easy access.
                      </p>
                      <Button onClick={() => setActiveTab("chat")}>Start Searching</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="flex-1 overflow-auto p-4">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold">My Profile</h2>
              <ProfileSummary linkedinUrl={userProfile.linkedinUrl} email={userProfile.email} />
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="flex-1 overflow-auto p-4">
            <div className="space-y-6 max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold">Dashboard</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Job Applications</h3>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Jobs applied to this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Job Matches</h3>
                    <p className="text-3xl font-bold">{jobSuggestions.length}</p>
                    <p className="text-sm text-muted-foreground">Matching your profile</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Profile Strength</h3>
                    <p className="text-3xl font-bold">85%</p>
                    <p className="text-sm text-muted-foreground">Complete your profile for better matches</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Recent Job Activity</h3>
                    {jobSuggestions.length > 0 ? (
                      <div className="space-y-4">
                        {jobSuggestions.slice(0, 3).map((job) => (
                          <div key={job.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              View <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No recent job activity</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Career Insights</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">Top Skills in Demand</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">Product Management</Badge>
                          <Badge variant="secondary">Data Analysis</Badge>
                          <Badge variant="secondary">UX Research</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Salary Range</p>
                        <p className="text-sm">$120K - $150K for your experience level</p>
                      </div>
                      <div>
                        <p className="font-medium">Job Market Trend</p>
                        <p className="text-sm">Growing demand for your skills in the current market</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}

