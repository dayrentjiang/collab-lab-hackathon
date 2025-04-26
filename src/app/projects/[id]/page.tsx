// src/app/projects/[id]/page.tsx
import { getAllProjects } from "../../../actions/project";
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Users, Tag } from "lucide-react";
import SearchBar from "../../components/SearchBar";

export default async function ProjectDetailPage({
  params
}: {
  params: { id: string };
}) {
  // Convert id from string to number
  const projectId = parseInt(params.id, 10);

  if (isNaN(projectId)) {
    notFound();
  }

  // Get all projects
  const allProjects = await getAllProjects();

  // If allProjects is an error or not an array
  if (!Array.isArray(allProjects)) {
    notFound();
  }

  // Find the specific project by ID
  const project = allProjects.find((p) => p.project_id === projectId);

  // If project is not found
  if (!project) {
    return notFound();
  }

  // Format the creation date
  const formattedDate = new Date(project.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );

  // Status badge color
  const statusColors = {
    "recruiting": "bg-blue-100 text-blue-800 border-blue-200",
    "in_progress": "bg-green-100 text-green-800 border-green-200",
    "completed": "bg-gray-100 text-gray-800 border-gray-200"
  };

  const statusColor =
    statusColors[project.project_status] || statusColors.completed;

  // Get skill category color
  const getSkillCategoryColor = (category: string) => {
    switch (category) {
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

  // Check if the user should see the Apply button
  const showApplyButton =
    project.project_status === "recruiting" && !isUserMemberOrCreator();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-blue-500 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to projects
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  {project.project_title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                >
                  {project.project_status
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {project.project_description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills &&
                  project.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillCategoryColor(
                        skill.skill_category
                      )}`}
                    >
                      {skill.skill_name}
                    </span>
                  ))}
              </div>

              {/* Project Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {project.project_timeline && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{project.project_timeline}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{project.project_vacancy} open position(s)</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Posted on {formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Project Creator */}
            {project.project_creator && (
              <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg border border-gray-100 min-w-48">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-medium mb-2">
                  {project.project_creator.user_name
                    ?.substring(0, 2)
                    .toUpperCase() || "UN"}
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-800">
                    {project.project_creator.user_name}
                  </p>
                  <p className="text-sm text-gray-500">Project Creator</p>
                  {project.project_creator.user_bio && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                      {project.project_creator.user_bio}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Team */}
            <div className="md:col-span-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Team
              </h2>

              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                {/* Skills Needed */}
                <p className="text-gray-700 mb-4">
                  This project needs {project.project_vacancy} team members with
                  the following skills:
                </p>

                <div className="space-y-2 mb-6">
                  {project.skills &&
                    project.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-white rounded-md border border-gray-200"
                      >
                        <Tag className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-sm">{skill.skill_name}</span>
                      </div>
                    ))}
                </div>

                {/* Divider */}
                <hr className="border-gray-200 my-4" />

                {/* Team Members */}
                <h3 className="font-medium text-gray-800 mb-3">
                  Current Team Members
                </h3>

                {isLoadingMembers ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="h-8 bg-gray-200 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : projectMembers.length > 0 ? (
                  <div className="space-y-2">
                    {projectMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 bg-white rounded-md border border-gray-200"
                      >
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-3">
                          {member.userDetails?.user_name
                            ?.substring(0, 2)
                            .toUpperCase() || "UN"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {member.userDetails?.user_name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.userDetails?.user_role || "Team Member"}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="text-xs text-gray-600 mt-2 flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1.5" />
                      {projectMembers.length}/
                      {project.project_vacancy + projectMembers.length}{" "}
                      positions filled
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 p-3 bg-white rounded-md border border-gray-200">
                    No team members yet
                  </div>
                )}

                {showApplyButton ? (
                  <div className="mt-4">
                    <Link
                      href={`/projects/${project.project_id}/apply`}
                      className="block w-full py-2 bg-blue-500 text-white text-center rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      Apply to Join
                    </Link>
                  </div>
                ) : isUserMemberOrCreator() ? (
                  <div className="bg-green-50 p-3 rounded-md text-sm text-green-800 mt-4">
                    You are part of this project team.
                  </div>
                ) : (
                  project.project_status === "in_progress" && (
                    <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800 mt-4">
                      This project is already in progress. Applications are
                      currently closed.
                    </div>
                  )
                )}

                {project.project_status === "completed" && (
                  <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 mt-4">
                    This project has been completed. Thanks for your interest!
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                About This Project
              </h2>

              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {project.project_description}
                </p>

                {project.project_timeline && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-800 mb-2">
                      Project Timeline
                    </h3>
                    <p className="text-gray-600">{project.project_timeline}</p>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Looking For
                  </h3>
                  <p className="text-gray-600">
                    This project is looking for {project.project_vacancy} team
                    members
                    {project.skills && project.skills.length > 0
                      ? ` with skills in ${project.skills
                          .map((s) => s.skill_name)
                          .join(", ")}`
                      : ""}
                    .
                  </p>
                </div>

                {project.project_creator &&
                  project.project_creator.user_bio && (
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-800 mb-2">
                        About the Creator
                      </h3>
                      <p className="text-gray-600">
                        {project.project_creator.user_bio}
                      </p>
                    </div>
                  )}
              </div>

              {/* Contact */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  Interested in this project?
                </h3>
                <p className="text-blue-600 mb-4">
                  Apply to join the team or message the project creator for more
                  information.
                </p>

                <div className="flex flex-wrap gap-3">
                  {showApplyButton && (
                    <Link
                      href={`/projects/${project.project_id}/apply`}
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Apply to Join
                    </Link>
                  )}

                  {project.project_creator && (
                    <Link
                      href={`/messages/new?recipient=${project.project_creator.user_id}`}
                      className="px-4 py-2 border border-blue-300 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Contact Creator
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
