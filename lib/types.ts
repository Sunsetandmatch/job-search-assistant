export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  postedDate: string;
  isRemote?: boolean;
};

export type UserPreferences = {
  location?: string;
  industry?: string;
  minSalary?: number;
  maxSalary?: number;
  remoteOnly?: boolean;
  jobTypes?: string[];
  experienceLevel?: string;
}; 