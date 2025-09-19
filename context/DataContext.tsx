'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  User, 
  // UserRole, 
  Project, 
  // ProjectStatus, 
  Allocation, 
  ProgressReport 
} from '@/types';

interface DataContextType {
  // State
  currentUser: User | null;
  users: User[];
  projects: Project[];
  allocations: Allocation[];
  progressReports: ProgressReport[];
  
  // Auth
  login: (email: string, password: string) => User | null;
  logout: () => void;
  registerStudent: (studentData: Omit<User, 'id' | 'role'>) => User | null;
  
  // Project CRUD
  createProject: (projectData: Omit<Project, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Project | null;
  updateProject: (id: string, updates: Partial<Project>) => Project | null;
  deleteProject: (id: string) => boolean;
  
  // User Management
  getUsers: () => User[];
  updateUser: (id: string, updates: Partial<User>) => User | null;
  deleteUser: (id: string) => boolean;
  
  // Progress Reports
  submitReport: (allocationId: string, reportText: string) => ProgressReport | null;
  giveFeedback: (reportId: string, feedback: string) => ProgressReport | null;
  
  // Allocation
  runAllocation: () => void;
  
  // Helper functions
  getStudentAllocation: (studentId: string) => Allocation | undefined;
  getProjectById: (projectId: string) => Project | undefined;
  getUserById: (userId: string) => User | undefined;
  getSupervisorProjects: (supervisorId: string) => Project[];
  getStudentReports: (studentId: string) => ProgressReport[];
  getSupervisorStudents: (supervisorId: string) => User[];
  getPendingReports: (supervisorId: string) => ProgressReport[];
  getStudents: () => User[];
  getSupervisors: () => User[];
  getProjects: () => Project[];
  getAllocations: () => Allocation[];
  getReports: () => ProgressReport[];
}

const DataContext = createContext<DataContextType>({
  currentUser: null,
  users: [],
  projects: [],
  allocations: [],
  progressReports: [],
  login: () => null,
  logout: () => {},
  registerStudent: () => null,
  getStudents: () => [],
  getSupervisors: () => [],
  getProjects: () => [],
  getAllocations: () => [],
  getReports: () => [],
  createProject: () => null,
  updateProject: () => null,
  submitReport: () => null,
  giveFeedback: () => null,
  runAllocation: () => {},
  getStudentAllocation: () => undefined,
  getProjectById: () => undefined,
  getUserById: () => undefined,
  getSupervisorProjects: () => [],
  getStudentReports: () => [],
  getSupervisorStudents: () => [],
  getPendingReports: () => [],
});

// Mock initial data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
  },
  {
    id: '2',
    name: 'Dr. Smith',
    email: 'smith@example.com',
    password: 'supervisor123',
    role: 'SUPERVISOR',
    department: 'Computer Science',
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'student123',
    role: 'STUDENT',
    department: 'Computer Science',
    matricNumber: 'CS001',
  },
];

const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'Blockchain-based Voting System',
    description: 'A secure and transparent voting system using blockchain technology.',
    status: 'Available',
    supervisorId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    title: 'AI-Powered Chatbot',
    description: 'Building an intelligent chatbot using natural language processing.',
    status: 'Available',
    supervisorId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialAllocations: Allocation[] = [];
const initialProgressReports: ProgressReport[] = [];

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spams_users');
      return saved ? JSON.parse(saved) : initialUsers;
    }
    return initialUsers;
  });
  
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spams_projects');
      return saved ? JSON.parse(saved) : initialProjects;
    }
    return initialProjects;
  });
  
  const [allocations, setAllocations] = useState<Allocation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spams_allocations');
      return saved ? JSON.parse(saved) : initialAllocations;
    }
    return initialAllocations;
  });
  
  const [progressReports, setProgressReports] = useState<ProgressReport[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spams_reports');
      return saved ? JSON.parse(saved) : initialProgressReports;
    }
    return initialProgressReports;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spams_users', JSON.stringify(users));
      localStorage.setItem('spams_projects', JSON.stringify(projects));
      localStorage.setItem('spams_allocations', JSON.stringify(allocations));
      localStorage.setItem('spams_reports', JSON.stringify(progressReports));
    }
  }, [users, projects, allocations, progressReports]);

  // Auth functions
  const login = (email: string, password: string): User | null => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      // Don't store password in currentUser
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return userWithoutPassword;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerStudent = (studentData: Omit<User, 'id' | 'role'>): User | null => {
    if (users.some(u => u.email === studentData.email)) {
      return null; // Email already exists
    }
    
    const newStudent: User = {
      ...studentData,
      id: uuidv4(),
      role: 'STUDENT',
    };
    
    setUsers(prev => [...prev, newStudent]);
    return newStudent;
  };

  // Project CRUD
  const createProject = (projectData: Omit<Project, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Project | null => {
    if (!currentUser || currentUser.role !== 'SUPERVISOR') return null;
    
    const newProject: Project = {
      ...projectData,
      id: `p${Date.now()}`,
      status: 'Available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>): Project | null => {
    if (!currentUser || (currentUser.role !== 'SUPERVISOR' && currentUser.role !== 'ADMIN')) return null;
    
    setProjects(prev => 
      prev.map(project => 
        project.id === id 
          ? { 
              ...project, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : project
      )
    );
    
    const updated = projects.find(p => p.id === id);
    return updated ? { ...updated, ...updates } : null;
  };

  // Progress Reports
  const submitReport = (allocationId: string, reportText: string): ProgressReport | null => {
    if (!currentUser || currentUser.role !== 'STUDENT') return null;
    
    const allocation = allocations.find(a => a.id === allocationId);
    if (!allocation || allocation.studentId !== currentUser.id) return null;
    
    const newReport: ProgressReport = {
      id: `r${Date.now()}`,
      allocationId,
      reportText,
      submissionDate: new Date().toISOString(),
      feedback: null,
      feedbackDate: null,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    
    setProgressReports(prev => [...prev, newReport]);
    return newReport;
  };

  const giveFeedback = (reportId: string, feedback: string): ProgressReport | null => {
    if (!currentUser || currentUser.role !== 'SUPERVISOR') return null;
    
    const report = progressReports.find(r => r.id === reportId);
    if (!report) return null;
    
    const allocation = allocations.find(a => a.id === report.allocationId);
    if (!allocation) return null;
    
    const project = projects.find(p => p.id === allocation.projectId);
    if (!project || project.supervisorId !== currentUser.id) return null;
    
    const updatedReport = {
      ...report,
      feedback,
      feedbackDate: new Date().toISOString(),
    };
    
    setProgressReports(prev => 
      prev.map(r => (r.id === reportId ? updatedReport : r))
    );
    
    return updatedReport;
  };

  // Allocation
  const runAllocation = (): void => {
    if (!currentUser || currentUser.role !== 'ADMIN') return;
    
    // Get all unassigned students
    const unassignedStudents = users.filter(
      user => user.role === 'STUDENT' && 
      !allocations.some(a => a.studentId === user.id)
    );
    
    // Get all available projects
    const availableProjects = projects.filter(
      project => project.status === 'Available' &&
      !allocations.some(a => a.projectId === project.id)
    );
    
    // Simple allocation: assign first available project to each student
    const newAllocations: Allocation[] = [];
    
    unassignedStudents.forEach((student, index) => {
      if (index < availableProjects.length) {
        const project = availableProjects[index];
        
        const newAllocation: Allocation = {
          id: `a${Date.now() + index}`,
          studentId: student.id,
          projectId: project.id,
          createdAt: new Date().toISOString(),
        };
        
        newAllocations.push(newAllocation);
        
        // Update project status
        updateProject(project.id, { status: 'Assigned' });
      }
    });
    
    if (newAllocations.length > 0) {
      setAllocations(prev => [...prev, ...newAllocations]);
    }
  };

  // Helper functions
  const getStudentAllocation = (studentId: string): Allocation | undefined => {
    return allocations.find(a => a.studentId === studentId);
  };

  const getProjectById = (projectId: string): Project | undefined => {
    return projects.find(p => p.id === projectId);
  };

  const getUserById = (userId: string): User | undefined => {
    return users.find(u => u.id === userId);
  };

  const getSupervisorProjects = (supervisorId: string): Project[] => {
    return projects.filter(p => p.supervisorId === supervisorId);
  };

  const getStudentReports = (studentId: string): ProgressReport[] => {
    const studentAllocation = allocations.find(a => a.studentId === studentId);
    if (!studentAllocation) return [];
    
    return progressReports.filter(r => r.allocationId === studentAllocation.id);
  };

  const getSupervisorStudents = (supervisorId: string): User[] => {
    const supervisorProjects = projects.filter(p => p.supervisorId === supervisorId);
    const projectIds = new Set(supervisorProjects.map(p => p.id));
    
    const studentIds = allocations
      .filter(a => projectIds.has(a.projectId))
      .map(a => a.studentId);
    
    return users.filter(u => studentIds.includes(u.id));
  };

  const getPendingReports = (supervisorId: string): ProgressReport[] => {
    const supervisorProjects = projects.filter(p => p.supervisorId === supervisorId);
    const projectIds = new Set(supervisorProjects.map(p => p.id));
    
    const allocationIds = allocations
      .filter(a => projectIds.has(a.projectId))
      .map(a => a.id);
    
    return progressReports.filter(
      report => allocationIds.includes(report.allocationId) && report.status === 'PENDING'
    );
  };

  const getUsers = () => {
    return users;
  };

  const updateUser = (id: string, updates: Partial<User>): User | null => {
    setUsers(prevUsers => {
      const userIndex = prevUsers.findIndex(u => u.id === id);
      if (userIndex === -1) return prevUsers;
      
      const updatedUser = {
        ...prevUsers[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const newUsers = [...prevUsers];
      newUsers[userIndex] = updatedUser;
      return newUsers;
    });
    
    return users.find(u => u.id === id) || null;
  };

  const deleteUser = (id: string): boolean => {
    if (id === currentUser?.id) return false; // Prevent deleting self
    
    setUsers(prevUsers => {
      const userIndex = prevUsers.findIndex(u => u.id === id);
      if (userIndex === -1) return prevUsers;
      
      // Remove any allocations for this user
      setAllocations(prevAllocations => 
        prevAllocations.filter(a => a.studentId !== id)
      );
      
      // Remove user
      const newUsers = [...prevUsers];
      newUsers.splice(userIndex, 1);
      return newUsers;
    });
    
    return true;
  };

  const getStudents = () => {
    return users.filter(user => user.role === 'STUDENT');
  };

  const getSupervisors = () => {
    return users.filter(user => user.role === 'SUPERVISOR');
  };

  const getProjects = (): Project[] => {
    return projects;
  };

  const getAllocations = (): Allocation[] => {
    return allocations;
  };

  const getReports = (): ProgressReport[] => {
    return progressReports;
  };

  const deleteProject = (id: string): boolean => {
    if (!currentUser || (currentUser.role !== 'SUPERVISOR' && currentUser.role !== 'ADMIN')) {
      return false;
    }

    setProjects(prevProjects => {
      const projectIndex = prevProjects.findIndex(p => p.id === id);
      if (projectIndex === -1) return prevProjects;
      
      // Remove any allocations for this project
      setAllocations(prevAllocations => 
        prevAllocations.filter(a => a.projectId !== id)
      );
      
      // Remove project
      const newProjects = [...prevProjects];
      newProjects.splice(projectIndex, 1);
      return newProjects;
    });
    
    return true;
  };

  const value: DataContextType = {
    // State
    currentUser,
    users,
    projects,
    allocations,
    progressReports,
    
    // Auth
    login,
    logout,
    registerStudent,
    
    // Project CRUD
    createProject,
    updateProject,
    deleteProject,
    
    // User Management
    getUsers,
    updateUser,
    deleteUser,
    
    // Progress Reports
    submitReport,
    giveFeedback,
    
    // Allocation
    runAllocation,
    
    // Helper functions
    getStudentAllocation,
    getProjectById,
    getUserById,
    getSupervisorProjects,
    getStudentReports,
    getSupervisorStudents,
    getPendingReports,
    getStudents,
    getSupervisors,
    getProjects,
    getAllocations,
    getReports,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
