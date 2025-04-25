import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ApplicationSuccessPage({ params }: { params: { id: string } }) {
  const projectId = params.id;

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
        
        <p className="text-gray-600 mb-8">
          Your application has been successfully submitted. The project creator will review your application 
          and get back to you soon. You can check the status of your application in your dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/projects/${projectId}`}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back to Project
          </Link>
          
          <Link
            href="/applications"
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            View My Applications
          </Link>
        </div>
        
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2">What happens next?</h2>
          
          <div className="space-y-4 text-left mt-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium text-lg mr-3">
                1
              </div>
              <div>
                <p className="text-gray-600">
                  The project creator will review your application and qualifications.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium text-lg mr-3">
                2
              </div>
              <div>
                <p className="text-gray-600">
                  You'll receive a notification when your application status changes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium text-lg mr-3">
                3
              </div>
              <div>
                <p className="text-gray-600">
                  If accepted, you'll be added to the project team and can begin collaborating.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium text-lg mr-3">
                4
              </div>
              <div>
                <p className="text-gray-600">
                  You can check your application status or withdraw your application at any time from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}