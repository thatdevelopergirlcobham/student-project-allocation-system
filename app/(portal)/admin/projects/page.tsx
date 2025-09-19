/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useDataContext } from '@/context/DataContext';
import { Project, User } from '@/types';
import { Plus, Search, BookOpen } from 'lucide-react';

export default function AdminProjectsPage() {
  const { getProjects, getSupervisors } = useDataContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [supervisors, setSupervisors] = useState<User[]>([]);
  
  useEffect(() => {
    setSupervisors(getSupervisors());
  }, [getSupervisors]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    setProjects(getProjects());
  };

  const filteredProjects = projects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    const projectTitle = project.title?.toLowerCase() || '';
    const projectDesc = project.description?.toLowerCase() || '';
    const supervisor = supervisors.find(s => s.id === project.supervisorId);
    const supervisorName = supervisor?.name?.toLowerCase() || '';
    
    return (
      projectTitle.includes(searchLower) ||
      projectDesc.includes(searchLower) ||
      supervisorName.includes(searchLower)
    );
  });

  const getSupervisorName = (supervisorId: string) => {
    const supervisor = supervisors.find(s => s.id === supervisorId);
    return supervisor ? supervisor.name : 'Unassigned';
  };

  // const handleDelete = (projectId: string) => {
  //   if (confirm('Are you sure you want to delete this project?')) {
  //     deleteProject(projectId);
  //     loadProjects();
  //   }
  // };

  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 md:px-0">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Project
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <li key={project.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-blue-600">
                              {project.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {project.description}
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {project.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Supervisor: {getSupervisorName(project.supervisorId)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Created on{' '}
                            <time dateTime={project.createdAt}>
                              {new Date(project.createdAt).toLocaleDateString()}
                            </time>
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          // onClick={() => handleDelete(project.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No projects found</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
