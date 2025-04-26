import Link from "next/link";
import { CalendarIcon, ClockIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjectMembers } from "../../actions/user-projects"; // Import the action

// Define the skill category color mapping
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

// Status badge color mapping
const statusColors = {
  "recruiting": "bg-blue-100 text-blue-800",
  "in_progress": "bg-green-100 text-green-800",
  "completed": "bg-gray-100 text-gray-800"
};

export default function ProjectCard({ project }) {
  const {
    project_id,
    project_title,
    project_description,
    project_status,
    project_vacancy,
    project_timeline,
    created_at,
    skills,
    project_creator
  } = project;

  const [projectMembers, setProjectMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch project members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const members = await getProjectMembers(project_id);
        setProjectMembers(members || []);
      } catch (error) {
        console.error("Failed to fetch project members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [project_id]);

  // Format the creation date
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  // Get status color
  const statusColor =
    statusColors[project_status] || "bg-gray-100 text-gray-800";

  // Maximum number of members to display before showing "+X more"
  const MAX_DISPLAYED_MEMBERS = 3;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="p-5 flex flex-col h-full">
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

        <p className="text-gray-600 text-sm mb-4 line-clamp-1">
          {project_description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills &&
            skills.slice(0, 3).map((skill) => (
              <span
                key={skill.skill_id}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSkillCategoryColor(
                  skill.skill_category
                )}`}
              >
                {skill.skill_name}
              </span>
            ))}
          {skills && skills.length > 3 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{skills.length - 3} more
            </span>
          )}
        </div>

        {/* Project Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs text-gray-500">
          {project_creator && (
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] mr-1.5">
                {project_creator.user_name?.substring(0, 2).toUpperCase() ||
                  "UN"}
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

        <hr className="border-gray-200 my-4" />

        {/* Project Members */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-700">
              Project Members
            </h4>
            <div className="text-xs text-gray-500 flex items-center">
              <UsersIcon className="h-3.5 w-3.5 mr-1.5" />
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <span>
                  {projectMembers.length}/
                  {project_vacancy + projectMembers.length} positions filled
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {isLoading ? (
              <div className="flex space-x-1">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="h-5 w-24 rounded bg-gray-200 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : projectMembers.length > 0 ? (
              <>
                <div className="flex flex-col space-y-1">
                  {projectMembers
                    .slice(0, MAX_DISPLAYED_MEMBERS)
                    .map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center text-xs text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                        <span className="truncate">
                          {member.userDetails?.user_name || "Unknown"}
                        </span>
                      </div>
                    ))}
                </div>
                {projectMembers.length > MAX_DISPLAYED_MEMBERS && (
                  <span className="text-xs text-gray-500">
                    +{projectMembers.length - MAX_DISPLAYED_MEMBERS} more
                    members
                  </span>
                )}
              </>
            ) : (
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-500">No members yet</span>
              </div>
            )}
          </div>
        </div>

        {/* Spacer to push the button to the bottom */}
        <div className="flex-grow"></div>

        {/* Action Button */}
        <Link
          href={`/projects/${project_id}`}
          className="block w-full py-2 bg-blue-500 text-white text-center rounded-full text-sm font-medium hover:bg-blue-600 transition-colors mt-auto"
        >
          {project_status === "recruiting"
            ? "View & Apply"
            : project_status === "in_progress"
            ? "View Details"
            : "View Project"}
        </Link>
      </div>
    </div>
  );
}
