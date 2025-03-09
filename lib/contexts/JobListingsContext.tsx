'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { JobListing } from '@/lib/types';

interface JobListingsContextType {
  jobListings: JobListing[];
  setJobListings: (listings: JobListing[]) => void;
}

const JobListingsContext = createContext<JobListingsContextType | undefined>(undefined);

export function JobListingsProvider({ children }: { children: ReactNode }) {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);

  return (
    <JobListingsContext.Provider value={{ jobListings, setJobListings }}>
      {children}
    </JobListingsContext.Provider>
  );
}

export function useJobListings() {
  const context = useContext(JobListingsContext);
  if (context === undefined) {
    throw new Error('useJobListings must be used within a JobListingsProvider');
  }
  return context;
} 