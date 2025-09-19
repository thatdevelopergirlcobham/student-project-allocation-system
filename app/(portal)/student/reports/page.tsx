'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { ProgressReport, Project } from '@/types';
import { FileText, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StudentReports() {
  const { currentUser, getStudentReports, getProjectById, getStudentAllocation } = useData();
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      const studentReports = getStudentReports(currentUser.id);
      setReports(studentReports);
      setLoading(false);
      
      // If there are reports, set the first one as selected by default
      if (studentReports.length > 0) {
        setSelectedReport(studentReports[0]);
        // Get the project for the first report
        const allocation = getStudentAllocation(currentUser.id);
        if (allocation) {
          const projectData = getProjectById(allocation.projectId);
          setProject(projectData || null);
        }
      }
    }
  }, [currentUser, getStudentReports, getProjectById]);

  const getStatusBadge = (status: string) => {
    switch (status) {
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
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Progress Reports
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all your submitted progress reports.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/student/submit-progress"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileText className="-ml-1 mr-2 h-5 w-5" />
            New Report
          </Link>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven&apos;t submitted any progress reports yet.
            </p>
            <div className="mt-6">
              <Link
                href="/student/submit-progress"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="-ml-1 mr-2 h-5 w-5" />
                Submit Your First Report
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Progress Reports
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your submitted progress reports and their current status.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {reports.map((report) => (
                <li key={report.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        <p className="ml-3 text-sm font-medium text-blue-600 truncate">
                          Progress Report - {new Date(report.submissionDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        {getStatusBadge(report.status)}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span>Submitted on {new Date(report.submissionDate).toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setIsViewing(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View Details
                        </button>
                        <Link
                          href={`/student/reports/${report.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Report Detail View Modal */}
      {selectedReport && isViewing && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Progress Report - {new Date(selectedReport.submissionDate).toLocaleDateString()}
                    </h3>
                    <div className="mt-1">
                      {getStatusBadge(selectedReport.status)}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsViewing(false)}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Report Details</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {selectedReport.reportText || 'No report content available.'}
                    </p>
                  </div>
                </div>

                {selectedReport.feedback && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {selectedReport.status === 'APPROVED' ? 'Supervisor Feedback' : 'Areas for Improvement'}
                    </h4>
                    <div className={`p-4 rounded-md ${
                      selectedReport.status === 'APPROVED' 
                        ? 'bg-green-50 text-green-800' 
                        : 'bg-yellow-50 text-yellow-800'
                    }`}>
                      <p className="text-sm whitespace-pre-line">
                        {selectedReport.feedback}
                      </p>
                      {selectedReport.feedbackDate && (
                        <p className="mt-2 text-xs opacity-75">
                          Feedback provided on {new Date(selectedReport.feedbackDate).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {project && selectedReport.status === 'REJECTED' && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Next Steps</h4>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm text-blue-800">
                        Please review the feedback above and submit a revised report addressing the concerns raised by your supervisor.
                      </p>
                      <div className="mt-4">
                        <Link
                          href="/student/submit-progress"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Submit Revised Report
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setIsViewing(false)}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
