'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createApplication } from '../../../../actions/application';
import { getAllProjects } from '@/actions/project';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';

export default function ApplyToProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [applicationMsg, setApplicationMsg] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert id from string to number
  const projectId = parseInt(params.id, 10);

  // Load project data
  useState(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const projects = await getAllProjects();
        
        if (Array.isArray(projects)) {
          const project = projects.find(p => p.project_id === projectId);
          if (project) {
            setProjectData(project);
          } else {
            setError('Project not found');
          }
        } else {
          setError('Failed to load project data');
        }
      } catch (err) {
        setError('An error occurred while loading project data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Handle text area input
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = e.target.value;
    setApplicationMsg(message);
    setCharCount(message.length);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !isSignedIn || !user) {
      setError('You must be signed in to apply for a project');
      return;
    }

    if (!applicationMsg.trim()) {
      setError('Please enter an application message');
      return;
    }

    if (applicationMsg.length < 50) {
      setError('Your application message should be at least 50 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create application
      await createApplication(
        projectId,
        user.id,
        applicationMsg
      );
      
      // Redirect to success page or project page
      router.push(`/projects/${projectId}/apply/success`);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  // If user is not signed in
  if (isLoaded && !isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">
            You need to be signed in to apply for projects.
          </p>
          <Link
            href={`/sign-in?redirect=/projects/${projectId}/apply`}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error && !projectData) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            href="/projects"
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            Browse Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">
            The project you're trying to apply for doesn't exist or has been removed.
          </p>
          <Link
            href="/projects"
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            Browse Projects
          </Link>
        </div>
      </div>
    );
  }

  // If project is not recruiting
  if (projectData.project_status !== 'recruiting') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Applications Closed</h1>
          <p className="text-gray-600 mb-8">
            This project is no longer accepting applications.
          </p>
          <Link
            href={`/projects/${projectId}`}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            View Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back button */}
      <Link 
        href={`/projects/${projectId}`} 
        className="inline-flex items-center text-sm text-blue-500 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to project
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Apply to Join: {projectData.project_title}
          </h1>
          <p className="text-gray-600">
            Tell the project creator why you're interested and what skills you can bring to the team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Project Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Project Summary</h2>
            <p className="text-gray-600 text-sm mb-3">{projectData.project_description}</p>
            
            <div className="flex flex-wrap gap-2">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Looking for: </span>
                <span className="text-gray-600">{projectData.project_vacancy} team members</span>
              </div>
              
              {projectData.skills && projectData.skills.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Skills needed: </span>
                  <span className="text-gray-600">
                    {projectData.skills.map(s => s.skill_name).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Application Message */}
          <div className="mb-6">
            <label htmlFor="application_msg" className="block text-sm font-medium text-gray-700 mb-1">
              Your Application <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Explain why you're interested in this project, what skills and experience you bring, 
              and how you can contribute to its success.
            </p>
            <textarea
              id="application_msg"
              name="application_msg"
              rows={8}
              value={applicationMsg}
              onChange={handleMessageChange}
              className={`w-full px-3 py-2 border ${
                error && !applicationMsg.trim() ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Share your relevant experience, skills, and why you're excited about this project..."
              disabled={isSubmitting}
            ></textarea>
            
            <div className="flex justify-between mt-1">
              <div>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>
              <div className={`text-xs ${
                charCount < 50 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {charCount}/500 characters (minimum 50)
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for a Great Application</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-inside list-disc">
              <li>Be specific about your relevant experience and skills</li>
              <li>Mention projects you've worked on that are similar</li>
              <li>Explain why you're interested in this particular project</li>
              <li>Share your availability and commitment level</li>
              <li>Ask thoughtful questions to show your interest</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/projects/${projectId}`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || applicationMsg.length < 50}
              className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                (isSubmitting || applicationMsg.length < 50) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}