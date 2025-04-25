"use client";

import React, { useEffect, useState } from "react";
import {
  getUserProjectsAsCreator,
  getUserProjectsAsMember
} from "../../../actions/user-projects";
import { UserProject, Project } from "../../../types/types";
import UserProjectCard from "./UserProjectCard";
import JoinedProjectCard from "./JoinedProjectCard"; // Import the component for joined projects
import { User, Users } from "lucide-react";

type CombinedProject = UserProject & { project: Project };

interface ProjectPageProps {
  userId: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<"created" | "joined">("created");
  const [projects, setProjects] = useState<CombinedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        let data;
        if (activeTab === "created") {
          data = await getUserProjectsAsCreator(userId);
        } else {
          data = await getUserProjectsAsMember(userId);
          console.log("Joined projects data:", data);
        }
        console.log(`Fetched ${activeTab} projects:`, data);
        setProjects(data || []);
      } catch (err) {
        console.error(`Error fetching ${activeTab} projects:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId, activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Simple Navigation Bar */}
      <div className="flex justify-center mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("created")}
          className={`flex items-center px-6 py-3 font-medium text-sm ${
            activeTab === "created"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User className="h-4 w-4 mr-2" />
          My Created Projects
        </button>
        <button
          onClick={() => setActiveTab("joined")}
          className={`flex items-center px-6 py-3 font-medium text-sm ${
            activeTab === "joined"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users className="h-4 w-4 mr-2" />
          Joined Projects
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">
        {activeTab === "created" ? "My Created Projects" : "Joined Projects"}
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500 text-center">
          {activeTab === "created"
            ? "You haven't created any projects yet."
            : "You haven't joined any projects yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "created"
            ? projects.map((project) => (
                <UserProjectCard key={project.project_id} project={project} />
              ))
            : projects.map((project) => (
                <JoinedProjectCard key={project.project_id} project={project} />
                // <UserProjectCard key={project.project_id} project={project} /> // Placeholder for joined projects
              ))}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
