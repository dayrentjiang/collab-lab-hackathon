"use client";
import React, { useEffect, useState } from "react";
import { Application } from "../../../types/types"; // You may need to create this type
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  MessageCircle,
  CheckCircle,
  XCircle,
  Users,
  Star,
  Trash2,
  X,
  ChevronDown
} from "lucide-react";
import {
  getApplicationsByProjectId,
  updateApplicationStatus
} from "../../../actions/application"; // Adjust the import path as necessary
import {
  getProjectUsers,
  removeUserFromProject
} from "../../../actions/user-projects"; // Add this import
import {
  removeProjectById,
  updateProjectStatus
} from "../../../actions/project"; // Added updateProjectStatus import
import { getUserByClerkId } from "../../../actions/user"; // Adjust the import path as necessary
import { ProjectCard } from "../../../types/types"; // Adjust the import path as necessary

// Define the skill category color mapping
const getSkillCategoryColor = (category: string | undefined) => {
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

// Status display names
const statusDisplayNames: Record<string, string> = {
  "recruiting": "Recruiting",
  "in_progress": "In Progress",
  "completed": "Completed"
};

// Application status color mapping
const applicationStatusColors = {
  "pending": "bg-yellow-100 text-yellow-800",
  "accepted": "bg-green-100 text-green-800",
  "rejected": "bg-red-100 text-red-800"
};

interface ProjectUser {
  user_project_id: string;
  user_id: string;
  project_id: number;
  user_role: string;
  joined_at: string;
  userDetails?: {
    user_name: string;
    user_email: string;
    user_university?: string;
    user_bio?: string;
    skills?: Array<{ skill_name: string }>;
  };
}

export default function UserProjectCard({ project }: { project: ProjectCard }) {
  const {
    project_id,
    project_title,
    project_description,
    project_status,
    project_vacancy,
    project_timeline,
    created_at,
    projectSkills,
    project_creator_id
  } = project;
  const [applications, setApplications] = useState<Application[]>([]);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [expandedApplications, setExpandedApplications] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(project_status);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [statusUpdateInProgress, setStatusUpdateInProgress] = useState(false);
  interface ProjectCreator {
    user_id: string;
    user_name: string;
    user_email: string;
    user_university?: string;
    user_bio?: string;
  }

  const [projectCreator, setProjectCreator] = useState<ProjectCreator | null>(
    null
  );

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const apps = await getApplicationsByProjectId(project_id);
        console.log("Fetched applications:", apps);
        setApplications(apps || []);
      } catch (error) {
        console.error("Failed to load applications:", error);
      }
    };

    const fetchProjectMembers = async () => {
      try {
        // This gets all members of the project
        const members = await getProjectUsers(project_id);
        console.log("Fetched project members:", members);
        setProjectUsers(members);
      } catch (error) {
        console.error("Failed to load project members:", error);
      }
    };

    // Fetch project creator details
    const fetchProjectCreator = async () => {
      try {
        if (project_creator_id) {
          const creator = await getUserByClerkId(project_creator_id);
          console.log("Fetched project creator:", creator);
          setProjectCreator(creator);
        }
      } catch (error) {
        console.error("Failed to load project creator:", error);
      }
    };

    fetchApplications();
    fetchProjectMembers(); // Fetch all team members
    fetchProjectCreator(); // Fetch project creator details
  }, [project_id, project_creator_id]);

  // Format the creation date
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  // Format application date
  const formatApplicationDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get first letter of user name for avatar
  const getUserInitials = (name: string | undefined | null): string => {
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
    statusColors[currentStatus as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800";

  // Toggle applications view
  const toggleApplicationsView = () => {
    setExpandedApplications(!expandedApplications);
  };

  // Toggle members view
  const toggleMembersView = () => {
    setExpandedMembers(!expandedMembers);
  };

  // Toggle status dropdown
  const toggleStatusDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  // Close status dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = () => {
      setStatusDropdownOpen(false);
    };

    if (statusDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [statusDropdownOpen]);

  // Handle project status change
  const handleStatusChange = async (
    newStatus: keyof typeof statusDisplayNames
  ) => {
    if (newStatus === currentStatus) {
      setStatusDropdownOpen(false);
      return;
    }

    try {
      setStatusUpdateInProgress(true);
      await updateProjectStatus(project_id, newStatus, project_creator_id);
      setCurrentStatus(newStatus);
      console.log(`Project status updated to ${newStatus}`);
      // You could add a toast notification here
    } catch (error) {
      console.error(`Failed to update project status:`, error);
      // You could add an error toast notification here
    } finally {
      setStatusUpdateInProgress(false);
      setStatusDropdownOpen(false);
    }
  };

  // Handle application status update
  const handleStatusUpdate = async (
    applicationId: number,
    newStatus: "pending" | "accepted" | "rejected"
  ) => {
    try {
      setUpdateInProgress(true);
      await updateApplicationStatus(applicationId, newStatus);

      // Update UI by refetching applications
      const updatedApps = await getApplicationsByProjectId(project_id);
      setApplications(updatedApps || []);

      // If we accepted someone, refresh the members list too
      if (newStatus === "accepted") {
        const updatedMembers = await getProjectUsers(project_id);
        setProjectUsers(updatedMembers || []);
      }
    } catch (error) {
      console.error(`Failed to ${newStatus} application:`, error);
      // You could add toast notification here
    } finally {
      setUpdateInProgress(false);
    }
  };

  // Handle project deletion
  const handleDeleteProject = async () => {
    try {
      setIsDeleting(true);
      await removeProjectById(project_id);
      console.log("Project deleted successfully");
      // You would update UI or redirect here after successful deletion
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 relative">
      {/* Delete Button at the top right */}
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
        title="Delete Project"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Project
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this project? This action cannot
              be undone and all project data will be permanently lost.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-3 mt-4">
          {" "}
          {/* Added margin top for delete button space */}
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {project_title}
          </h3>
          {/* Project Status with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleStatusDropdown}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} flex items-center`}
              disabled={statusUpdateInProgress}
            >
              {statusUpdateInProgress ? (
                <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
              ) : null}
              {statusDisplayNames[currentStatus] || currentStatus}
              <ChevronDown className="h-3 w-3 ml-1" />
            </button>

            {statusDropdownOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  {Object.entries(statusDisplayNames).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(value);
                      }}
                      className={`${
                        value === currentStatus
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      } block px-4 py-2 text-sm w-full text-left`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
          {projectCreator && (
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-1.5">
                {getUserInitials(projectCreator.user_name)}
              </div>
              <span>{projectCreator.user_name || "Unknown"}</span>
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
          {currentStatus === "recruiting"
            ? "View Project"
            : currentStatus === "in_progress"
            ? "View Details"
            : "View Project"}
        </Link>
      </div>

      {/* Project Members Section with Toggle */}
      <div className="border-t border-gray-200">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          onClick={toggleMembersView}
        >
          <h3 className="text-md font-medium flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            Team Members ({projectUsers.length})
          </h3>
          <span className="text-blue-500 text-sm">
            {expandedMembers ? "Hide" : "Show"}
          </span>
        </div>

        {/* Project Members List */}
        {expandedMembers && (
          <div className="px-4 pb-4">
            {projectUsers.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {projectUsers.map((member) => (
                  <div
                    key={member.user_project_id || `member-${member.user_id}`}
                    className="p-3 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm mr-3">
                          {getUserInitials(member.userDetails?.user_name)}
                        </div>
                        <div>
                          <div className="font-medium">
                            {member.userDetails?.user_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {member.userDetails?.user_email}
                          </div>
                          {member.userDetails?.user_university && (
                            <div className="text-xs text-gray-500 mt-1">
                              {member.userDetails.user_university}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.user_role === "creator"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {member.user_role === "creator" && (
                            <Star className="h-3 w-3 mr-1" />
                          )}
                          {member.user_role.charAt(0).toUpperCase() +
                            member.user_role.slice(1)}
                        </span>

                        {member.user_role !== "creator" && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                console.log(
                                  "Removing user from project...",
                                  member.user_id,
                                  member.project_id
                                );
                                await removeUserFromProject(
                                  member.user_id,
                                  member.project_id.toString()
                                );
                                // Update UI by refetching project members
                                const updatedMembers = await getProjectUsers(
                                  project_id
                                );
                                setProjectUsers(updatedMembers || []);
                              } catch (error) {
                                console.error(
                                  "Failed to remove member from project:",
                                  error
                                );
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                            title="Remove Member"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {member.userDetails?.user_bio && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                          {member.userDetails.user_bio.length > 100
                            ? `${member.userDetails.user_bio.substring(
                                0,
                                100
                              )}...`
                            : member.userDetails.user_bio}
                        </p>
                      </div>
                    )}

                    {member.userDetails?.skills &&
                      member.userDetails.skills.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">
                            Skills:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {member.userDetails.skills
                              .slice(0, 3)
                              .map(
                                (
                                  skill: { skill_name: string },
                                  index: number
                                ) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {skill.skill_name || "Skill"}
                                  </span>
                                )
                              )}
                            {member.userDetails.skills.length > 3 && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{member.userDetails.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                    <div className="mt-2 text-xs text-gray-500">
                      Joined: {formatApplicationDate(member.joined_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No team members yet.
              </div>
            )}
          </div>
        )}
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
            {updateInProgress && (
              <div className="flex justify-center items-center py-2 mb-3 bg-blue-50 text-blue-700 rounded-md">
                <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating application status...
              </div>
            )}

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
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                            className="flex items-center text-xs text-green-600 hover:text-green-800 disabled:opacity-50"
                            onClick={() =>
                              handleStatusUpdate(app.application_id, "accepted")
                            }
                            disabled={updateInProgress}
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Accept
                          </button>
                          <button
                            className="flex items-center text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                            onClick={() =>
                              handleStatusUpdate(app.application_id, "rejected")
                            }
                            disabled={updateInProgress}
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
