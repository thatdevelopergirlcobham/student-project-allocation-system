'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Allocation, Project, User } from '@/types';
import { RefreshCw, Search, User as UserIcon, BookOpen } from 'lucide-react';

export default function AdminAllocationsPage() {
  const { getAllocations, getProjects, getStudents, getSupervisors, runAllocation } = useData();
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    setAllocations(getAllocations());
    setProjects(getProjects());
    setStudents(getStudents());
    setSupervisors(getSupervisors());
  };

  const filteredAllocations = allocations.filter(allocation => {
    const student = students.find(s => s.id === allocation.studentId);
    const project = projects.find(p => p.id === allocation.projectId);
    
    const studentName = student?.name.toLowerCase() || '';
    const projectTitle = project?.title.toLowerCase() || '';
    
    return (
      studentName.includes(searchTerm.toLowerCase()) ||
      projectTitle.includes(searchTerm.toLowerCase())
    );
  });

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getProjectTitle = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : 'Unknown Project';
  };

  const getProjectSupervisor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return 'Unknown';
    
    const supervisor = supervisors.find(s => s.id === project.supervisorId);
    return supervisor ? supervisor.name : 'Unassigned';
  };

  const handleRunAllocation = async () => {
    if (confirm('This will run the allocation algorithm. Are you sure?')) {
      setIsLoading(true);
      try {
        await runAllocation();
        loadData();
      } catch (error) {
        console.error('Error running allocation:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 md:px-0">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Project Allocations</h1>
          <button
            onClick={handleRunAllocation}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Running...
              </>
            ) : (
              'Run Allocation'
            )}
          </button>
        </div>

        <div className="mt-6">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search allocations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredAllocations.length > 0 ? (
                filteredAllocations.map((allocation) => (
                  <li key={allocation.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-blue-600">
                              {getStudentName(allocation.studentId)}
                            </h3>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Allocated
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <BookOpen className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {getProjectTitle(allocation.projectId)}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>Supervisor: {getProjectSupervisor(allocation.projectId)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No allocations found</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper function to get supervisors (moved here to fix the error)
  // function getSupervisors() {
  //   return []; // This should be replaced with actual implementation
  // }
}
