'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuIcon } from 'lucide-react';
import { JobListing } from '@/lib/types';
import { JobListingsProvider, useJobListings } from '@/lib/contexts/JobListingsContext';
import { ThemeToggle } from '@/components/theme-toggle';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <JobListingsProvider>
      <ChatLayoutContent>{children}</ChatLayoutContent>
    </JobListingsProvider>
  );
}

function ChatLayoutContent({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Mobile sidebar trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 right-4 z-50">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <JobListingsSidebar />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 md:mr-[300px]">
        <div className="fixed top-4 left-4 z-50">
          <ThemeToggle />
        </div>
        {children}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block fixed right-0 top-0 w-[300px] h-screen border-l">
        <JobListingsSidebar />
      </div>
    </div>
  );
}

function JobListingsSidebar() {
  const { jobListings } = useJobListings();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Job Listings</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {jobListings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No job listings yet. Start chatting to get personalized recommendations!
            </p>
          ) : (
            jobListings.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 space-y-2">
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <p className="text-sm">{job.location}</p>
                {job.salary && (
                  <p className="text-sm text-muted-foreground">{job.salary}</p>
                )}
                <div className="flex items-center gap-2">
                  {job.isRemote && (
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                      Remote
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Posted {job.postedDate}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => window.open(job.url, '_blank')}
                >
                  View Job
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 