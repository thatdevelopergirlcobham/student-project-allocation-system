'use client';

import { useEffect, useState, useCallback } from 'react';
import { useData } from '@/context/DataContext';
import { Project, Allocation } from '@/types';
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  BarChart2
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    getStudents,
    getSupervisors,
    getProjects,
    getAllocations,
    getReports,
    currentUser 
  } = useData();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSupervisors: 0,
    totalProjects: 0,
    allocatedProjects: 0,
    pendingReports: 0,
    approvedReports: 0,
    rejectedReports: 0,
  });

  const [recentAllocations, setRecentAllocations] = useState<Allocation[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  const loadDashboardData = useCallback(() => {
    try {
      // Get all users, projects, allocations, and reports
      const students = getStudents();
      const supervisors = getSupervisors();
      const projects = getProjects();
      const allocations = getAllocations();
      const reports = getReports();

      // Calculate statistics
      const totalStudents = students.length;
      const totalSupervisors = supervisors.length;
      const totalProjects = projects.length;
      const allocatedProjects = allocations.length;
      
      const pendingReports = reports.filter(report => report.status === 'PENDING').length;
      const approvedReports = reports.filter(report => report.status === 'APPROVED').length;
      const rejectedReports = reports.filter(report => report.status === 'REJECTED').length;

      // Get recent allocations and projects
      const recentAllocs = [...allocations]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      const recentProjs = [...projects]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalStudents,
        totalSupervisors,
        totalProjects,
        allocatedProjects,
        pendingReports,
        approvedReports,
        rejectedReports,
      });

      setRecentAllocations(recentAllocs);
      setRecentProjects(recentProjs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  }, [getStudents, getSupervisors, getProjects, getAllocations, getReports]);

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      loadDashboardData();
    }
  }, [currentUser, loadDashboardData]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 md:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      
      {/* Stats Grid */}
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Students Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.totalStudents}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Supervisors Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Supervisors</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.totalSupervisors}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.totalProjects}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {stats.allocatedProjects} allocated
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Progress Reports</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stats.pendingReports + stats.approvedReports + stats.rejectedReports}
                      </div>
                      <div className="ml-2 flex items-baseline text-xs font-semibold">
                        <span className="text-yellow-500">{stats.pendingReports} pending</span>
                        <span className="text-green-500 ml-2">{stats.approvedReports} approved</span>
                        <span className="text-red-500 ml-2">{stats.rejectedReports} rejected</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Projects */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Allocations */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Allocations</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest project allocations to students</p>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-b-lg">
            <ul className="divide-y divide-gray-200">
              {recentAllocations.length > 0 ? (
                recentAllocations.map((allocation) => (
                  <li key={allocation.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Student ID: {allocation.studentId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Project: {allocation.projectId}
                        </div>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        {new Date(allocation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-4 text-center text-gray-500">
                  No recent allocations found
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Projects</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Newly added projects</p>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-b-lg">
            <ul className="divide-y divide-gray-200">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <li key={project.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {project.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.supervisorId ? `Supervisor: ${project.supervisorId}` : 'No supervisor'}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : project.status === 'Assigned' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-4 text-center text-gray-500">
                  No projects found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
