'use client';

import { useState, useEffect } from 'react';
import { useDataContext } from '@/context/DataContext';
import { Project, Allocation, Supervisor } from '@/types';
import { BookOpen, User, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetails() {
  const { currentUser, getStudentAllocation, getProjectById, getUserById } = useDataContext();
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      const studentAllocation = getStudentAllocation(currentUser.id);
      if (studentAllocation) {
        setAllocation(studentAllocation);
        const projectData = getProjectById(studentAllocation.projectId);
        setProject(projectData || null);
        
        if (projectData?.supervisorId) {
          const sup = getUserById(projectData.supervisorId);
          setSupervisor(sup || null);
        }
      }
      setLoading(false);
    }
  }, [currentUser, getStudentAllocation, getProjectById, getUserById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!allocation || !project) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">No Project Assigned</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You have not been allocated a project yet. Please check back later or contact the administrator.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {project.title}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <BookOpen className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {project.category || 'No category specified'}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              Allocated on {new Date(allocation.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <div className="flex-shrink-0 mr-1.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  project.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : project.status === 'Assigned' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Project Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about your assigned project.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project.description || 'No description provided.'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Objectives</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project.objectives ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {project.objectives.map((obj: string, index: number) => (
                      <li key={index}>{obj}</li>
                    ))}
                  </ul>
                ) : (
                  'No objectives specified.'
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Expected Outcomes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project.expectedOutcomes || 'No expected outcomes specified.'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Skills Required</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project.skillsRequired && project.skillsRequired.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.skillsRequired.map((skill: string, index: number) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  'No specific skills required.'
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {supervisor && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Supervisor Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Your project supervisor details.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">{supervisor.name}</h4>
                <div className="text-sm text-gray-500">{supervisor.email}</div>
                <div className="mt-1 text-sm text-gray-500">
                  {supervisor.department || 'No department specified'}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700">About</h5>
              <p className="mt-1 text-sm text-gray-600">
                {supervisor.bio || 'No additional information available.'}
              </p>
            </div>
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700">Office Hours</h5>
              <p className="mt-1 text-sm text-gray-600">
                {supervisor.officeHours || 'Please contact via email to schedule a meeting.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Link
          href="/student/dashboard"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
