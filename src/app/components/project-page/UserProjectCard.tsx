"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  MessageCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { getApplicationsByProjectId } from "../../../actions/application"; // Adjust the import path as necessary
import { getProjectUsers } from "../../../actions/user-projects"; // Adjust the import path as necessary

// Define the skill category color mapping
const getSkillCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case "frontend":
      return "bg-purple-100 text-purple-800";
    case "backend":
      return "bg-green-100 text-green-800";
    case "design":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Status badge color mapping
const statusColors = {
  "recruiting": "bg-blue-100 text-blue-800",
  "in_progress": "bg-green-100 text-green-800",
  "completed": "bg-gray-100 text-gray-800"
};

// Application status color mapping
const applicationStatusColors = {
  "pending": "bg-yellow-100 text-yellow-800",
  "accepted": "bg-green-100 text-green-800",
  "rejected": "bg-red-100 text-red-800"
};

export default function UserProjectCard({ project }) {
  const {
    project_id,
    project_title,
    project_description,
    project_status,
    project_vacancy,
    project_timeline,
    created_at,
    projectSkills,
    project_creator
  } = project;

  const [applications, setApplications] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [expandedApplications, setExpandedApplications] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("Fetching applications for project ID:", project_id);
        const apps = await getApplicationsByProjectId(project_id);
        console.log("Fetched applications:", apps);
        setApplications(apps || []);

        const member = await getProjectUsers(project_id);
        console.log("Fetched project members:", member);
        setProjectUsers(member || []);
      } catch (error) {
        console.error("Failed to load applications:", error);
      }
    };

    fetchApplications();
  }, [project_id]);

  // Format the creation date
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  // Format application date
  const formatApplicationDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get first letter of user name for avatar
  const getUserInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "UN";
  };

  // Get status color
  const statusColor =
    statusColors[project_status] || "bg-gray-100 text-gray-800";

  // Toggle applications view
  const toggleApplicationsView = () => {
    setExpandedApplications(!expandedApplications);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {project_title}
          </h3>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
          >
            {project_status
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project_description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {projectSkills &&
            projectSkills.slice(0, 3).map((skillWrapper) => (
              <span
                key={skillWrapper.skill_id}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSkillCategoryColor(
                  skillWrapper.skills?.skill_category || ""
                )}`}
              >
                {skillWrapper.skills?.skill_name || "Unknown"}
              </span>
            ))}
          {projectSkills && projectSkills.length > 3 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{projectSkills.length - 3} more
            </span>
          )}
        </div>

        {/* Project Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs text-gray-500">
          {project_creator && (
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-1.5">
                {getUserInitials(project_creator.user_name)}
              </div>
              <span>{project_creator.user_name || "Unknown"}</span>
            </div>
          )}

          <div className="flex items-center">
            <UsersIcon className="h-3.5 w-3.5 mr-1" />
            <span>{project_vacancy} open position(s)</span>
          </div>

          {project_timeline && (
            <div className="flex items-center">
              <ClockIcon className="h-3.5 w-3.5 mr-1" />
              <span>{project_timeline}</span>
            </div>
          )}

          <div className="flex items-center">
            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
            <span>Posted {formattedDate}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/projects/${project_id}`}
          className="block w-full py-2 bg-blue-500 text-white text-center rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          {project_status === "recruiting"
            ? "View & Apply"
            : project_status === "in_progress"
            ? "View Details"
            : "View Project"}
        </Link>
      </div>

      {/* Applications Section with Toggle */}
      <div className="border-t border-gray-200">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          onClick={toggleApplicationsView}
        >
          <h3 className="text-md font-medium flex items-center">
            <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
            Applicants ({applications.length})
          </h3>
          <span className="text-blue-500 text-sm">
            {expandedApplications ? "Hide" : "Show"}
          </span>
        </div>

        {/* Applications List */}
        {expandedApplications && (
          <div className="px-4 pb-4">
            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.application_id}
                    className="p-3 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm mr-2">
                          {getUserInitials(app.user?.user_name)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {app.user?.user_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {app.user?.user_email}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          applicationStatusColors[app.application_status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {app.application_status.charAt(0).toUpperCase() +
                          app.application_status.slice(1)}
                      </span>
                    </div>

                    {app.application_msg && (
                      <div className="mb-2">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          <span>Application Message:</span>
                        </div>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                          {app.application_msg.length > 100
                            ? `${app.application_msg.substring(0, 100)}...`
                            : app.application_msg}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-500">
                        Applied: {formatApplicationDate(app.applied_at)}
                      </div>

                      {app.application_status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            className="flex items-center text-xs text-green-600 hover:text-green-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(
                                "Accept applicant:",
                                app.application_id
                              );
                              // Add your accept function here
                            }}
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Accept
                          </button>
                          <button
                            className="flex items-center text-xs text-red-600 hover:text-red-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(
                                "Reject applicant:",
                                app.application_id
                              );
                              // Add your reject function here
                            }}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No applications yet for this project.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
