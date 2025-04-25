"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import {
  getUserProjectsAsCreator,
  getUserProjectsAsMember
} from "../../../actions/user-projects";
import { Project } from "../../../types/types";
import UserProjectCard from "./UserProjectCard";
import JoinedProjectCard from "./JoinedProjectCard"; // Import the component for joined projects
import { User, Users } from "lucide-react";

// Make sure we have a comprehensive type that matches the data structure returned by our APIs
type CombinedProject = {
  user_project_id?: string;
  user_id?: string;
  project_id: number;
  user_role?: string;
  joined_at?: string;
  project?: Project; // For joined projects
  project_title?: string; // For created projects (direct properties)
  project_description?: string;
  project_status?: string;
  project_vacancy?: number;
  project_timeline?: string;
  created_at?: string;
  updated_at?: string;
  project_creator_id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectSkills?: any[];
};

interface ProjectPageProps {
  userId: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<"created" | "joined">("created");
  const [createdProjects, setCreatedProjects] = useState<CombinedProject[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<CombinedProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Separate useEffect for each tab's data to avoid conflicts
  useEffect(() => {
    const fetchCreatedProjects = async () => {
      if (activeTab === "created") setLoading(true);
      try {
        const data = await getUserProjectsAsCreator(userId);
        console.log("Fetched created projects:", data);
        setCreatedProjects(data || []);
      } catch (err) {
        console.error("Error fetching created projects:", err);
        setCreatedProjects([]);
      } finally {
        if (activeTab === "created") setLoading(false);
      }
    };

    const fetchJoinedProjects = async () => {
      if (activeTab === "joined") setLoading(true);
      try {
        const data = await getUserProjectsAsMember(userId);
        console.log("Fetched joined projects:", data);
        setJoinedProjects(data || []);
      } catch (err) {
        console.error("Error fetching joined projects:", err);
        setJoinedProjects([]);
      } finally {
        if (activeTab === "joined") setLoading(false);
      }
    };

    // On component mount, fetch both types of projects
    // This way we have the data ready when the user switches tabs
    fetchCreatedProjects();
    fetchJoinedProjects();
  }, [userId]); // Only depends on userId, not activeTab

  // Function to handle tab change
  const handleTabChange = (tab: "created" | "joined") => {
    setActiveTab(tab);
    // We're not fetching on tab change anymore, so we just need to set loading briefly
    // while we switch to already-loaded data
    setLoading(true);
    setTimeout(() => setLoading(false), 100); // Brief loading state for UI feedback
  };

  // Get the currently active projects based on the selected tab
  const activeProjects =
    activeTab === "created" ? createdProjects : joinedProjects;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8 border-b border-gray-200">
        <button
          onClick={() => handleTabChange("created")}
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
          onClick={() => handleTabChange("joined")}
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
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : activeProjects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg mb-6">
            {activeTab === "created"
              ? "You haven't created any projects yet."
              : "You haven't joined any projects yet."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {activeTab === "created" ? (
              <>
              <Link href="/projects/create">
  <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center justify-center">
    <span>Create New Project</span>
  </button>
</Link>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition flex items-center justify-center"
                  onClick={() => (window.location.href = "/")}
                >
                  <span>Browse Projects</span>
                </button>
              </>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center justify-center"
                onClick={() => (window.location.href = "/")}
              >
                <span>Find Projects to Join</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "created"
            ? activeProjects.map((project) => (
                <UserProjectCard
                  key={`created-${project.project_id}`}
                  project={project}
                />
              ))
            : activeProjects.map((project) => (
                <JoinedProjectCard
                  key={`joined-${project.project_id}`}
                  project={project}
                />
              ))}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
