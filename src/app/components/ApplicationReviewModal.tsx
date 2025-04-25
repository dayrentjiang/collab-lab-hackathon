"use client";
import React, { useState } from "react";

const ApplicationReviewModal = ({ project, onClose, onAction }) => {
  const [activeApplicationId, setActiveApplicationId] = useState(
    project.applications && project.applications.length > 0
      ? project.applications[0].application_id
      : null
  );

  // Get the currently selected application
  const activeApplication = project.applications?.find(
    (app) => app.application_id === activeApplicationId
  );

  if (!project.applications || project.applications.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Applications for {project.project_title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">
              No applications have been submitted for this project yet.
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Applications for {project.project_title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left sidebar - Application list */}
          <div className="w-1/3 border-r overflow-y-auto pr-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Applications ({project.applications.length})
            </h3>
            <div className="space-y-2">
              {project.applications.map((application) => (
                <div
                  key={application.application_id}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    activeApplicationId === application.application_id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50 border border-gray-200"
                  }`}
                  onClick={() =>
                    setActiveApplicationId(application.application_id)
                  }
                >
                  <div className="font-medium">
                    {application.user.user_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {application.user.user_university}
                  </div>
                  <div className="text-xs mt-1">
                    {application.application_status === "pending" && (
                      <span className="text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                        Pending
                      </span>
                    )}
                    {application.application_status === "accepted" && (
                      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        Accepted
                      </span>
                    )}
                    {application.application_status === "rejected" && (
                      <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Application details */}
          {activeApplication ? (
            <div className="w-2/3 pl-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">
                  {activeApplication.user.user_name}
                </h3>
                {activeApplication.user.user_bio && (
                  <p className="text-gray-600 mb-2">
                    {activeApplication.user.user_bio}
                  </p>
                )}
                <div className="text-sm text-gray-500">
                  {activeApplication.user.user_university}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">
                  Application Message:
                </h4>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p>{activeApplication.application_msg}</p>
                </div>
              </div>

              {activeApplication.application_status === "pending" ? (
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() =>
                      onAction(activeApplication.application_id, "accepted")
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex-1"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      onAction(activeApplication.application_id, "rejected")
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex-1"
                  >
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-1">
                    Message
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="font-medium">
                      {activeApplication.application_status === "accepted"
                        ? "You have accepted this application."
                        : "You have rejected this application."}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Message Applicant
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-2/3 pl-6 flex items-center justify-center">
              <p className="text-gray-500">
                Select an application to view details
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReviewModal;
