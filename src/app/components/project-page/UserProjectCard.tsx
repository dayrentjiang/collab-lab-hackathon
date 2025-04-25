import { useEffect, useState } from "react";
import { getApplicationsByProjectId } from "../../../actions/application";

export default function UserProjectCard({ project }) {
  const { project_id, title, description, projectSkills, status } = project;

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const apps = await getApplicationsByProjectId(project_id);
        setApplications(apps || []);
      } catch (error) {
        console.error("Failed to load applications:", error);
      }
    };

    fetchApplications();
  }, [project_id]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {/* Project Title */}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">
        {description}
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

      {/* Applications List */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-md font-medium mb-2">Applicants</h3>
        {applications.length > 0 ? (
          <ul className="space-y-2">
            {applications.map((app) => (
              <li
                key={app.id}
                className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
                onClick={() => console.log("Open modal for:", app)} // replace with modal trigger
              >
                Applicant ID: {app.user_id}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No applicants yet.</p>
        )}
      </div>
    </div>
  );
}
