import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Edit, Briefcase, GraduationCap, Award } from "lucide-react"

interface ProfileSummaryProps {
  linkedinUrl?: string
  email?: string
}

export default function ProfileSummary({ linkedinUrl, email }: ProfileSummaryProps) {
  const skills = [
    { name: "Product Management", level: 90 },
    { name: "User Research", level: 85 },
    { name: "Agile/Scrum", level: 80 },
    { name: "Data Analysis", level: 75 },
    { name: "Stakeholder Management", level: 85 },
  ]

  const experience = [
    {
      title: "Senior Product Manager",
      company: "TechCorp",
      period: "2020 - Present",
      description: "Leading product strategy and development for SaaS platform.",
    },
    {
      title: "Product Manager",
      company: "InnovateTech",
      period: "2017 - 2020",
      description: "Managed product lifecycle for mobile applications.",
    },
  ]

  const education = [
    {
      degree: "MBA",
      institution: "Stanford University",
      year: "2017",
    },
    {
      degree: "BS in Computer Science",
      institution: "MIT",
      year: "2015",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile Completeness</CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>85% Complete</span>
              <span className="text-muted-foreground">Add LinkedIn to reach 100%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          {linkedinUrl && (
            <div className="mt-4 text-sm">
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href={linkedinUrl}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkedinUrl}
                </a>
              </p>
            </div>
          )}
          {email && (
            <div className="mt-2 text-sm">
              <p>
                <strong>Email:</strong> {email}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {experience.map((job, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{job.title}</h3>
                  <span className="text-sm text-muted-foreground">{job.period}</span>
                </div>
                <p className="text-muted-foreground">{job.company}</p>
                <p className="text-sm">{job.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{edu.degree}</h3>
                  <span className="text-sm text-muted-foreground">{edu.year}</span>
                </div>
                <p className="text-muted-foreground">{edu.institution}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <Award className="h-5 w-5 mr-2" />
          <CardTitle>Career Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Skill Recommendations</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Product Analytics</Badge>
                <Badge variant="secondary">AI/ML Product Management</Badge>
                <Badge variant="secondary">Growth Strategy</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Salary Insights</h3>
              <p className="text-sm">
                Based on your experience and skills, the average salary range for your profile is{" "}
                <strong>$120K - $150K</strong> in the current market.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Career Path</h3>
              <p className="text-sm">
                Potential next steps: <strong>Director of Product</strong>, <strong>VP of Product</strong>, or{" "}
                <strong>Chief Product Officer</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

