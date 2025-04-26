"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getUserProjectsAsCreator,
  getUserProjectsAsMember,
  getAllCompleteProjects
} from "../../../actions/user-projects";
import { Project } from "../../../types/types";
import UserProjectCard from "./UserProjectCard";
import JoinedProjectCard from "./JoinedProjectCard"; // Import the component for joined projects
import { CheckCircle, User, Users, FolderOpen, PlusCircle } from "lucide-react";

// Make sure we have a comprehensive type that matches the data structure returned by our APIs
type CombinedProject = {
  user_project_id: string;
  user_id: string;
  project_id: number;
  user_role: string;
  joined_at: string;
  project: Project;
  project_title: string;
  project_description: string;
  project_status: "recruiting" | "in_progress" | "completed";
  project_vacancy: number;
  project_timeline: string;
  created_at: string;
  updated_at: string;
  project_creator_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectSkills: any[];
};

interface ProjectPageProps {
  userId: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<
    "created" | "joined" | "completed"
  >("created");
  const [createdProjects, setCreatedProjects] = useState<CombinedProject[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<CombinedProject[]>([]);
  const [completedProjects, setCompletedProjects] = useState<CombinedProject[]>(
    []
  );
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

    const fetchCompletedProjects = async () => {
      if (activeTab === "completed") setLoading(true);
      try {
        const data = await getAllCompleteProjects(userId);
        console.log("Fetched completed projects:", data);
        setCompletedProjects(data || []);
      } catch (err) {
        console.error("Error fetching completed projects:", err);
        setCompletedProjects([]);
      } finally {
        if (activeTab === "completed") setLoading(false);
      }
    };

    // On component mount, fetch all types of projects
    // This way we have the data ready when the user switches tabs
    fetchCreatedProjects();
    fetchJoinedProjects();
    fetchCompletedProjects();
  }, [userId]); // Only depends on userId, not activeTab

  // Function to handle tab change
  const handleTabChange = (tab: "created" | "joined" | "completed") => {
    setActiveTab(tab);
    // We're not fetching on tab change anymore, so we just need to set loading briefly
    // while we switch to already-loaded data
    setLoading(true);
    setTimeout(() => setLoading(false), 100); // Brief loading state for UI feedback
  };

  // Get the currently active projects based on the selected tab
  const activeProjects =
    activeTab === "created"
      ? createdProjects
      : activeTab === "joined"
      ? joinedProjects.filter(project => project.project_status !== "completed")
      : completedProjects;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-blue-100 mt-2">Manage and track your project progress</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6 py-4">
              <button
                onClick={() => handleTabChange("created")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "created"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Created Projects
              </button>
              <button
                onClick={() => handleTabChange("joined")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "joined"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Joined Projects
              </button>
              <button
                onClick={() => handleTabChange("completed")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "completed"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Completed Projects
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : activeProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FolderOpen className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No projects found
                </h3>
                <p className="text-gray-500">
                  {activeTab === "created"
                    ? "You haven't created any projects yet"
                    : activeTab === "joined"
                    ? "You haven't joined any projects yet"
                    : "You haven't completed any projects yet"}
                </p>
                {activeTab === "created" && (
                  <div className="mt-6">
                    <Link
                      href="/projects/create"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Create New Project
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeProjects.map((project) => (
                  activeTab === "created" ? (
                    <UserProjectCard key={project.project_id} project={project} />
                  ) : (
                    <JoinedProjectCard key={project.project_id} project={project} />
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
