"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarIcon, ClockIcon, UsersIcon, Users, Star } from "lucide-react";
import { getProjectUsers } from "../../../actions/user-projects";

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

export default function JoinedProjectCard({ project }) {
  const {
    project_id,
    project_title,
    project_description,
    project_status,
    project_vacancy,
    project_timeline,
    created_at,
    projectSkills,
    project_creator,
    joined_at
  } = project;

  const [projectUsers, setProjectUsers] = useState([]);
  const [expandedMembers, setExpandedMembers] = useState(false);

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const members = await getProjectUsers(project_id);
        console.log("Fetched project members:", members);
        setProjectUsers(members);
      } catch (error) {
        console.error("Failed to load project members:", error);
      }
    };

    fetchProjectMembers();
  }, [project_id]);

  // Format the creation date
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  // Format joined date
  const formattedJoinedDate = joined_at
    ? new Date(joined_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    : "Unknown";

  // Format member date
  const formatMemberDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
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

  // Toggle members view
  const toggleMembersView = () => {
    setExpandedMembers(!expandedMembers);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {project_title}
            </h3>
            <div className="text-xs text-gray-500 mt-1">
              Joined: {formattedJoinedDate}
            </div>
          </div>
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
          View Project Details
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
                    key={member.user_project_id}
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
                      <div>
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
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {skill.skill_name || "Skill"}
                                </span>
                              ))}
                            {member.userDetails.skills.length > 3 && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{member.userDetails.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                    <div className="mt-2 text-xs text-gray-500">
                      Joined: {formatMemberDate(member.joined_at)}
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

      {/* Project role badge at bottom */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {project.user_role && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  project.user_role === "creator"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {project.user_role === "creator" && (
                  <Star className="h-3 w-3 mr-1" />
                )}
                Your role:{" "}
                {project.user_role.charAt(0).toUpperCase() +
                  project.user_role.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
