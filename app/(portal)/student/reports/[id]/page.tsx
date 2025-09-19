'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { ProgressReport } from '@/types';
import { ArrowLeft, Download, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ViewReport() {
  const router = useRouter();
  const params = useParams();
  const reportId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  
  const { getReportById, currentUser, getStudentAllocation, getProjectById } = useData();
  const [report, setReport] = useState<ProgressReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [project, setProject] = useState<any>(null);

  // Load report data
  useEffect(() => {
    if (reportId && currentUser) {
      const reportData = getReportById(reportId);
      
      // Verify the report belongs to the current user
      if (reportData) {
        const allocation = getStudentAllocation(currentUser.id);
        if (allocation && reportData.allocationId === allocation.id) {
          setReport(reportData);
          
          // Load project details
          const projectData = getProjectById(allocation.projectId);
          setProject(projectData || null);
        } else {
          setError('You are not authorized to view this report');
        }
      } else {
        setError('Report not found');
      }
      setLoading(false);
    }
  }, [reportId, currentUser, getReportById, getStudentAllocation, getProjectById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error || 'An error occurred while loading the report'}
                  </h3>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <Link
                href="/student/reports"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="-ml-1 mr-2 h-5 w-5" />
                Back to Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (report.status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1.5 h-3.5 w-3.5 text-green-500" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1.5 h-3.5 w-3.5 text-red-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1.5 h-3.5 w-3.5 text-yellow-500" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/student/reports"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Reports
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Progress Report - {new Date(report.submissionDate).toLocaleDateString()}
          </h1>
          <div className="ml-4">
            {getStatusBadge()}
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Submitted on {new Date(report.submissionDate).toLocaleString()}
          {report.updatedAt && report.updatedAt !== report.submissionDate && (
            <span className="ml-2">
              (Last updated: {new Date(report.updatedAt).toLocaleString()})
            </span>
          )}
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Project Information
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {project ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Project Title</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.title}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : project.status === 'Assigned' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                  }`}>
                    {project.status}
                  </span>
                </dd>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No project information available.</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Report Content
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="prose max-w-none">
            {report.reportText ? (
              <div className="whitespace-pre-line">{report.reportText}</div>
            ) : (
              <p className="text-gray-500 italic">No content provided.</p>
            )}
          </div>
        </div>
      </div>

      {(report.attachments && report.attachments.length > 0) && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Attachments
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {report.attachments.map((fileUrl, index) => (
                <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <span className="ml-2 flex-1 w-0 truncate">
                      {fileUrl.split('/').pop()}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-500"
                      download
                    >
                      <span className="sr-only">Download</span>
                      <Download className="h-5 w-5" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {report.feedback && (
        <div className={`bg-white shadow overflow-hidden sm:rounded-lg mb-6 ${
          report.status === 'REJECTED' ? 'border-l-4 border-red-400' : ''
        }`}>
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {report.status === 'APPROVED' ? 'Supervisor Feedback' : 'Areas for Improvement'}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Feedback provided on {report.feedbackDate ? new Date(report.feedbackDate).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div className={`border-t border-gray-200 px-4 py-5 sm:p-6 ${
            report.status === 'REJECTED' ? 'bg-red-50' : 'bg-gray-50'
          }`}>
            <div className="prose max-w-none">
              <div className="whitespace-pre-line">{report.feedback}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Link
          href="/student/reports"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
          Back to Reports
        </Link>
        
        {report.status !== 'APPROVED' && (
          <div className="space-x-3">
            <Link
              href={`/student/reports/${report.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Report
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
