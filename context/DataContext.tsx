import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, Project, Allocation, ProgressReport } from '@/types';

// Define your DataContextType interface
export interface DataContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerStudent: (data: Omit<User, 'id' | 'role'>) => Promise<User>;
  registerSupervisor: (data: Omit<User, 'id' | 'role'>) => Promise<User>;
  
  // Allocations
  allocateSupervisor: (studentId: string, supervisorId: string, projectId: string) => Promise<void>;
  runAllocation: () => Promise<void>;
  getStudentAllocation: (studentId: string) => Allocation | undefined;
  
  // Reports
  submitReport: (reportData: Omit<ProgressReport, 'id' | 'createdAt' | 'status'>) => Promise<ProgressReport>;
  getReportById: (id: string) => ProgressReport | undefined;
  updateReport: (id: string, reportData: Partial<ProgressReport>) => Promise<ProgressReport>;
  
  // Getters
  getUsers: () => User[];
  getSupervisorAllocations: (supervisorId?: string) => Allocation[];
  getSupervisorReports: (supervisorId?: string) => ProgressReport[];
  getStudents: () => User[];
  getSupervisors: () => User[];
  getProjects: () => Project[];
  getAllocations: () => Allocation[];
  getProjectById: (id: string) => Project | undefined;
  getUserById: (id: string) => User | undefined;
  deleteUser: (id: string) => Promise<void>;
}

// Default context with proper types
const defaultContext: DataContextType = {
  // Auth
  login: async () => { throw new Error('Not implemented'); },
  logout: () => { throw new Error('Not implemented'); },
  registerStudent: async () => { throw new Error('Not implemented'); },
  registerSupervisor: async () => { throw new Error('Not implemented'); },
  
  // Allocations
  allocateSupervisor: async () => { throw new Error('Not implemented'); },
  runAllocation: async () => { throw new Error('Not implemented'); },
  
  // Reports
  submitReport: async () => { throw new Error('Not implemented'); },
  getReportById: () => { throw new Error('Not implemented'); },
  updateReport: async () => { throw new Error('Not implemented'); },
  
  // Getters
  getSupervisorAllocations: () => { throw new Error('Not implemented'); },
  getSupervisorReports: () => { throw new Error('Not implemented'); },
  getStudents: () => { throw new Error('Not implemented'); },
  getSupervisors: () => { throw new Error('Not implemented'); },
  getProjects: () => { throw new Error('Not implemented'); },
  getAllocations: () => { throw new Error('Not implemented'); },
  getProjectById: () => { throw new Error('Not implemented'); },
  getUserById: () => { throw new Error('Not implemented'); },
};

const DataContext = createContext<DataContextType>(defaultContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects] = useState<Project[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [reports, setReports] = useState<ProgressReport[]>([]);

  // Auth functions
  const login = async (email: string, password: string): Promise<void> => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }
    setUser(foundUser);
  };

  const logout = (): void => {
    setUser(null);
  };

  const registerStudent = async (data: Omit<User, 'id' | 'role'>): Promise<User> => {
    const newStudent: User = {
      ...data,
      id: `user_${Date.now()}`,
      role: 'STUDENT',
    };
    setUsers(prev => [...prev, newStudent]);
    return newStudent;
  };

  const registerSupervisor = async (data: Omit<User, 'id' | 'role'>): Promise<User> => {
    const newSupervisor: User = {
      ...data,
      id: `user_${Date.now()}`,
      role: 'SUPERVISOR',
    };
    setUsers(prev => [...prev, newSupervisor]);
    return newSupervisor;
  };

  // Allocation functions
  const allocateSupervisor = async (studentId: string, supervisorId: string, projectId: string): Promise<void> => {
    const allocation: Allocation = {
      id: `alloc_${Date.now()}`,
      studentId,
      supervisorId,
      projectId,
      createdAt: new Date().toISOString(),
    };
    setAllocations(prev => [...prev, allocation]);
  };

  const runAllocation = async (): Promise<void> => {
    // Implementation for automatic allocation
    console.log('Running allocation algorithm');
  };

  // Report functions
  const submitReport = async (reportData: Omit<ProgressReport, 'id' | 'createdAt' | 'status'>): Promise<ProgressReport> => {
    const newReport: ProgressReport = {
      ...reportData,
      id: `report_${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [...prev, newReport]);
    return newReport;
  };

  const getReportById = (id: string): ProgressReport | undefined => {
    return reports.find(r => r.id === id);
  };

  const updateReport = async (id: string, updates: Partial<ProgressReport>): Promise<ProgressReport> => {
    const reportIndex = reports.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      throw new Error('Report not found');
    }
    
    const updatedReport = {
      ...reports[reportIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    setReports(prev => [
      ...prev.slice(0, reportIndex),
      updatedReport,
      ...prev.slice(reportIndex + 1)
    ]);
    
    return updatedReport;
  };

  // Getter functions
  const getSupervisorAllocations = (supervisorId?: string): Allocation[] => {
    if (supervisorId) {
      return allocations.filter(a => a.supervisorId === supervisorId);
    }
    return [...allocations];
  };

  const getSupervisorReports = (supervisorId?: string): ProgressReport[] => {
    if (supervisorId) {
      const supervisorAllocations = allocations.filter(a => a.supervisorId === supervisorId);
      return reports.filter(r => 
        supervisorAllocations.some(a => a.id === r.allocationId)
      );
    }
    return [...reports];
  };

  const getStudents = (): User[] => {
    return users.filter(u => u.role === 'STUDENT');
  };

  const getSupervisors = (): User[] => {
    return users.filter(u => u.role === 'SUPERVISOR');
  };

  const getProjects = (): Project[] => {
    return [...projects];
  };

  const getAllocations = (): Allocation[] => {
    return [...allocations];
  };

  const getProjectById = (id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  };

  const getUserById = (id: string): User | undefined => {
    return users.find(u => u.id === id);
  };

  const contextValue: DataContextType = {
    login,
    logout,
    registerStudent,
    registerSupervisor,
    allocateSupervisor,
    runAllocation,
    submitReport,
    getReportById,
    updateReport,
    getSupervisorAllocations,
    getSupervisorReports,
    getStudents,
    getSupervisors,
    getProjects,
    getAllocations,
    getProjectById,
    getUserById,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
