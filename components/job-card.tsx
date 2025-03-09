import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bookmark, ExternalLink } from "lucide-react"

interface JobCardProps {
  job: {
    id: number
    title: string
    company: string
    location: string
    salary: string
    description: string
    match: number
  }
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-lg">{job.title}</h3>
            <p className="text-muted-foreground">{job.company}</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {job.match}% Match
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>{job.location}</span>
          <span>•</span>
          <span>{job.salary}</span>
        </div>
        <p className="mb-6">{job.description}</p>
        <div className="flex gap-2">
          <Button className="flex-1">Apply Now</Button>
          <Button variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
            <span className="sr-only">Save Job</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

