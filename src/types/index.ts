// Types globaux pour l'application

export interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
  department_id: number | null;
  department_name: string | null;
  is_hr: boolean;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  department_id: number;
  department: Department;
  requirements?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  application_count?: number;
}

export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  application_count?: number;
}

export interface Application {
  id: number;
  candidate_id: number;
  job_id: number;
  status: ApplicationStatus;
  cover_letter?: string;
  cv_filename?: string;
  ai_analysis?: string;
  ai_score?: number;
  created_at: string;
  updated_at: string;
  candidate: Candidate;
  job: Job;
}

export enum ApplicationStatus {
  SUBMITTED = 1,
  UNDER_REVIEW = 2,
  INTERVIEW = 3,
  REJECTED = 4,
  ACCEPTED = 5
}

export interface InterviewRequest {
  id: number;
  application_id: number;
  manager_id: number;
  requested_date: string;
  status: InterviewStatus;
  comments?: string;
  created_at: string;
  updated_at: string;
  application: Application;
  manager: User;
}

export enum InterviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REFUSED = 'REFUSED',
  COMPLETED = 'COMPLETED'
}