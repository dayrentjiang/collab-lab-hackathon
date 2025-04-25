'use client';

import { useEffect, useState } from 'react';
import { ApplicationWithRelations } from '@/types/types';
import { getUserApplications, deleteApplication } from '@/actions/application';
import { useUser } from '@clerk/nextjs';
import { Loader2, X } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [applications, setApplications] = useState<ApplicationWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadApplications() {
      if (!isLoaded || !clerkUser) return;

      try {
        const applicationsData = await getUserApplications(clerkUser.id);
        console.log("Applications Data:", applicationsData);
        if (applicationsData) {
          setApplications(applicationsData);
        } else {
          setError("Could not find applications");
        }
      } catch (err) {
        setError("Error loading applications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [clerkUser, isLoaded]);

  // Handle application deletion
  const handleDelete = async (applicationId: number) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(applicationId);
      await deleteApplication(applicationId);
      setApplications(applications.filter(app => app.application_id !== applicationId));
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Failed to delete application');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter applications based on selected status
  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.application_status === selectedStatus);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Error: {error}</h1>
        <p>We couldn't load your applications. Please try again later.</p>
      </div>
    );
  }

  if (!clerkUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Please sign in to view your applications
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      
      {/* Status Filter */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedStatus === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedStatus('pending')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedStatus === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setSelectedStatus('accepted')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedStatus === 'accepted'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Accepted
        </button>
        <button
          onClick={() => setSelectedStatus('rejected')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedStatus === 'rejected'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Rejected
        </button>
      </div>
      
      {filteredApplications.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            {selectedStatus === 'all'
              ? "You haven't applied to any projects yet."
              : `No ${selectedStatus} applications found.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <div
              key={application.application_id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm relative"
            >
              {/* Delete Button - Only show for non-accepted applications */}
              {application.application_status !== 'accepted' && (
                <button
                  onClick={() => handleDelete(application.application_id)}
                  disabled={deletingId === application.application_id}
                  className="absolute -top-2 -right-2 p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                  title="Delete application"
                >
                  {deletingId === application.application_id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </button>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link 
                    href={`/projects/${application.project_id}`}
                    className="text-xl font-semibold mb-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {application.project?.project_title}
                  </Link>
                  <p className="text-gray-600 mb-4">
                    {application.project?.project_description}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    application.application_status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : application.application_status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {application.application_status}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Your Application Message:</h3>
                <p className="text-gray-600">{application.application_msg}</p>
              </div>
              
              <div className="text-sm text-gray-500">
                Applied on: {new Date(application.applied_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
