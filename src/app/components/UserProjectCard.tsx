"use client";

import React from "react";

const ProjectCard = ({
  project,
  isCreator = false,
  isPast = false,
  onViewApplications,
  applicationCount = 0
}) => {
  const statusColors = {
    recruiting: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800"
  };

  const statusLabels = {
    recruiting: "Recruiting",
    in_progress: "In Progress",
    completed: "Completed"
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-xl text-gray-900 truncate">
            {project.project_title}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[project.project_status]
            }`}
          >
            {statusLabels[project.project_status]}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.project_description}
        </p>

        {/* Project details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          {project.project_timeline && (
            <div>
              <span className="text-gray-500">Timeline:</span>
              <span className="ml-1 font-medium">
                {project.project_timeline}
              </span>
            </div>
          )}

          {project.project_vacancy > 0 && !isPast && (
            <div>
              <span className="text-gray-500">Vacancies:</span>
              <span className="ml-1 font-medium">
                {project.project_vacancy}
              </span>
            </div>
          )}

          {!isCreator && project.creator && (
            <div className="col-span-2">
              <span className="text-gray-500">Created by:</span>
              <span className="ml-1 font-medium">
                {project.creator.user_name}
              </span>
            </div>
          )}

          <div className="col-span-2">
            <span className="text-gray-500">Created:</span>
            <span className="ml-1 font-medium">
              {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Required skills */}
        {project.required_skills && project.required_skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Required Skills:
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.required_skills.map((skill) => (
                <span
                  key={skill.skill_id}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {skill.skill_name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Current members */}
        {project.members && project.members.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Team Members:
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.members.map((member, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                    {member.user_name
                      ? member.user_name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <span className="ml-1 text-sm text-gray-700">
                    {member.user_name}
                  </span>
                  {index < project.members.length - 1 && (
                    <span className="mx-1 text-gray-300">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          {isCreator && !isPast && (
            <div className="flex justify-between">
              <div>
                {applicationCount > 0 && (
                  <button
                    onClick={onViewApplications}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  >
                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-600 w-5 h-5 rounded-full mr-2">
                      {applicationCount}
                    </span>
                    Review Applications
                  </button>
                )}
              </div>
              <button className="text-gray-600 hover:text-gray-800 text-sm">
                Edit Project
              </button>
            </div>
          )}

          {!isCreator && !isPast && (
            <div className="flex justify-end">
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View Project Details
              </button>
            </div>
          )}

          {isPast && (
            <div className="flex justify-end">
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View Project Archive
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
