'use client';

import { useState, useEffect } from 'react';
import { useDataContext } from '@/context/DataContext';
import { Allocation, Project, User } from '@/types';
import { RefreshCw, Search, User as UserIcon, BookOpen } from 'lucide-react';

export default function AdminAllocationsPage() {
  const { 
    getAllocations, 
    getProjects, 
    getStudents, 
    getSupervisors, 
    runAllocation,
    getProjectById,
    getUserById
  } = useDataContext();
  
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [allocs, projs, studs, sups] = await Promise.all([
        getAllocations(),
        getProjects(),
        getStudents(),
        getSupervisors()
      ]);
      
      setAllocations(allocs);
      setProjects(projs);
      setStudents(studs);
      setSupervisors(sups);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAllocation = async () => {
    setIsLoading(true);
    try {
      await runAllocation();
      await loadData(); // Refresh data after allocation
    } catch (err) {
      const error = err as Error;
      console.error('Error running allocation:', error);
      setError(error.message || 'Failed to run allocation');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAllocations = allocations.filter(allocation => {
    const project = getProjectById(allocation.projectId);
    const student = getUserById(allocation.studentId);
    const supervisor = project ? getUserById(project.supervisorId) : null;

    const searchLower = searchTerm.toLowerCase();
    return (
      project?.title.toLowerCase().includes(searchLower) ||
      student?.name.toLowerCase().includes(searchLower) ||
      supervisor?.name.toLowerCase().includes(searchLower) ||
      student?.matricNumber?.toLowerCase().includes(searchLower) ||
      allocation.id.toLowerCase().includes(searchLower)
    );
  });

  const getAllocationDetails = (allocation: Allocation) => {
    const project = getProjectById(allocation.projectId);
    const student = getUserById(allocation.studentId);
    const supervisor = project ? getUserById(project.supervisorId) : null;
    
    return { project, student, supervisor };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2">Loading allocations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Project Allocations</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search allocations..."
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleRunAllocation}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-blue-300 min-w-[150px]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Run Allocation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {filteredAllocations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No allocations</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No allocations match your search.' : 'Get started by running the allocation process.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supervisor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAllocations.map((allocation) => {
                  const { project, student, supervisor } = getAllocationDetails(allocation);

                  return (
                    <tr key={allocation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student?.name || 'Unknown Student'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student?.matricNumber || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{project?.title || 'Unknown Project'}</div>
                        <div className="text-sm text-gray-500">{project?.category || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supervisor ? (
                          <>
                            <div className="text-sm text-gray-900">{supervisor.name}</div>
                            <div className="text-sm text-gray-500">{supervisor.department || 'N/A'}</div>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Allocated
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
