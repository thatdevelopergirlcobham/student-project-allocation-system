'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { User, Mail, BookOpen, Clock, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SupervisorDetails() {
  const { currentUser, getStudentAllocation, getProjectById, getUserById } = useData();
  const [supervisor, setSupervisor] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (currentUser?.id) {
      const allocation = getStudentAllocation(currentUser.id);
      if (allocation) {
        const projectData = getProjectById(allocation.projectId);
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

  if (!supervisor) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">No Supervisor Assigned</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You have not been assigned a supervisor yet. Please check back later or contact the administrator.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{supervisor.name}</h2>
              <div className="mt-1 text-sm text-gray-500">
                {supervisor.title || 'Supervisor'}
                {supervisor.department && ` • ${supervisor.department}`}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('about')}
              className={`${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`${
                activeTab === 'contact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Contact
            </button>
            <button
              onClick={() => setActiveTab('office-hours')}
              className={`${
                activeTab === 'office-hours'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Office Hours
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`${
                activeTab === 'project'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Our Project
            </button>
          </nav>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Biography</h3>
                <div className="mt-2 text-sm text-gray-600">
                  {supervisor.bio || 'No biography available.'}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Research Interests</h3>
                <div className="mt-2">
                  {supervisor.researchInterests && supervisor.researchInterests.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {supervisor.researchInterests.map((interest: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{interest}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No research interests specified.</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Education</h3>
                <div className="mt-2">
                  {supervisor.education && supervisor.education.length > 0 ? (
                    <ul className="space-y-4">
                      {supervisor.education.map((edu: any, index: number) => (
                        <li key={index}>
                          <div className="text-sm font-medium text-gray-900">{edu.degree}</div>
                          <div className="text-sm text-gray-600">{edu.institution}</div>
                          <div className="text-xs text-gray-500">{edu.year}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No education information available.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-blue-600">
                        <a href={`mailto:${supervisor.email}`}>{supervisor.email}</a>
                      </p>
                    </div>
                  </div>
                  
                  {supervisor.phone && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{supervisor.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {supervisor.office && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Office</p>
                        <p className="text-sm text-gray-600">{supervisor.office}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Preferred Communication</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {supervisor.preferredContactMethod || 'Please contact via email for the quickest response.'}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Response Time</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {supervisor.responseTime || 'Typically responds within 24-48 hours on weekdays.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'office-hours' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Scheduled Office Hours</h3>
                <div className="mt-4">
                  {supervisor.officeHours ? (
                    <div className="space-y-4">
                      {typeof supervisor.officeHours === 'string' ? (
                        <p className="text-sm text-gray-600">{supervisor.officeHours}</p>
                      ) : (
                        supervisor.officeHours.map((hours: any, index: number) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{hours.day}</p>
                              <p className="text-sm text-gray-600">{hours.time}</p>
                              {hours.location && (
                                <p className="text-xs text-gray-500 mt-1">Location: {hours.location}</p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No scheduled office hours. Please contact to schedule a meeting.</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Scheduling a Meeting</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {supervisor.meetingInstructions || 
                      'To schedule a meeting outside of office hours, please send an email with your availability and the purpose of the meeting.'}
                  </p>
                </div>
              </div>
              
              {supervisor.calendarLink && (
                <div>
                  <a
                    href={supervisor.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Calendar className="-ml-1 mr-2 h-5 w-5" />
                    Schedule a Meeting
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'project' && project ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
                <div className="mt-2">
                  <h4 className="text-md font-medium text-gray-700">{project.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Project Status</h3>
                <div className="mt-2">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : project.status === 'Assigned' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                    }`}>
                      {project.status}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {project.status === 'Available' 
                        ? 'This project is available for selection.' 
                        : project.status === 'Assigned' 
                          ? 'This project is currently assigned to you.' 
                          : 'This project has been completed.'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Next Steps</h3>
                <div className="mt-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li className="text-sm text-gray-600">
                      Schedule a meeting with your supervisor to discuss the project in detail
                    </li>
                    <li className="text-sm text-gray-600">
                      Review the project requirements and objectives
                    </li>
                    <li className="text-sm text-gray-600">
                      Prepare any questions or topics you'd like to discuss
                    </li>
                    <li className="text-sm text-gray-600">
                      Begin working on your first progress report
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Link
                  href="/student/project-details"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <BookOpen className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  View Project Details
                </Link>
                
                <Link
                  href="/student/submit-progress"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <MessageSquare className="-ml-1 mr-2 h-5 w-5" />
                  Submit Progress Report
                </Link>
              </div>
            </div>
          ) : activeTab === 'project' ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No project assigned</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have an assigned project yet. Please check back later.
              </p>
            </div>
          ) : null}
        </div>
      </div>
      
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
