export type UserRole = 'STUDENT' | 'SUPERVISOR' | 'ADMIN';
export type ProjectStatus = 'Available' | 'Assigned' | 'Completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  department?: string;
  matricNumber?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  supervisorId: string;
  skillsRequired: string[];
  objectives: string[];
  expectedOutcomes: string;
  prerequisites: string;
  maxStudents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Supervisor extends User {
  officeLocation?: string;
  phone?: string;
  website?: string;
  bio?: string;
  officeHours?: string;
  researchInterests?: string;
}

export interface Allocation {
  id: string;
  studentId: string;
  projectId: string;
  supervisorId: string;
  createdAt: string;
}

export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ProgressReport {
  id: string;
  allocationId: string;
  reportText: string;
  submissionDate: string;
  feedback: string | null;
  feedbackDate: string | null;
  status: ReportStatus;
  createdAt: string;
}
