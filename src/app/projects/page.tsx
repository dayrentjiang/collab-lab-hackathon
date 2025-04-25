"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // Assuming you have a hook to get the current user
import ProjectCard from "../components/UserProjectCard";
import ApplicationReviewModal from "../components/ApplicationReviewModal";
import { fetchMyProjects } from "../../actions/user";
import { fetchJoinedProjects } from "../../actions/user";
import { fetchPastProjects } from "../../actions/user";

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState("my-projects");
  const [myProjects, setMyProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [pastProjects, setPastProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!user) return null;

  useEffect(() => {
    async function loadProjects() {
      console.log("Loading projects for user:", user.user_id);
      setIsLoading(true);

      // Fetch data for all tabs simultaneously
      const [myProjectsResponse, joinedProjectsResponse, pastProjectsResponse] =
        await Promise.all([
          fetchMyProjects(user.user_id),
          fetchJoinedProjects(user.user_id),
          fetchPastProjects(user.user_id)
        ]);

      if (myProjectsResponse.data) {
        setMyProjects(myProjectsResponse.data);
      }

      if (joinedProjectsResponse.data) {
        setJoinedProjects(joinedProjectsResponse.data);
      }

      if (pastProjectsResponse.data) {
        setPastProjects(pastProjectsResponse.data);
      }

      setIsLoading(false);
    }

    loadProjects();
  }, []);

  const handleViewApplications = (project) => {
    setSelectedProject(project);
    setShowApplicationModal(true);
  };

  const handleCloseModal = () => {
    setShowApplicationModal(false);
    setSelectedProject(null);
  };

  const handleApplicationAction = async (applicationId, action) => {
    // This would be implemented with a server action to update the application status
    console.log(`Application ${applicationId} ${action}`);

    // For now, we'll update the UI optimistically
    const updatedProject = { ...selectedProject };
    updatedProject.applications = updatedProject.applications.map((app) =>
      app.application_id === applicationId
        ? { ...app, application_status: action }
        : app
    );

    setSelectedProject(updatedProject);
    setMyProjects(
      myProjects.map((p) =>
        p.project_id === selectedProject.project_id ? updatedProject : p
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>

      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            className={`px-4 py-2 border-b-2 ${
              activeTab === "my-projects"
                ? "border-blue-500 font-medium"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("my-projects")}
          >
            My Projects
          </button>
          <button
            className={`px-4 py-2 border-b-2 ${
              activeTab === "joined-projects"
                ? "border-blue-500 font-medium"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("joined-projects")}
          >
            Projects Joined
          </button>
          <button
            className={`px-4 py-2 border-b-2 ${
              activeTab === "past-projects"
                ? "border-blue-500 font-medium"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("past-projects")}
          >
            Past Projects
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          {activeTab === "my-projects" && (
            <>
              {myProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProjects.map((project) => (
                    <ProjectCard
                      key={project.project_id}
                      project={project}
                      isCreator={true}
                      onViewApplications={() => handleViewApplications(project)}
                      applicationCount={project.applications?.length || 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-600">
                    You haven't created any projects yet
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Get started by creating your first project
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Create New Project
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "joined-projects" && (
            <>
              {joinedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {joinedProjects.map((project) => (
                    <ProjectCard
                      key={project.project_id}
                      project={project}
                      isCreator={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-600">
                    You haven't joined any projects yet
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Browse projects to find opportunities to collaborate
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Browse Projects
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "past-projects" && (
            <>
              {pastProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastProjects.map((project) => (
                    <ProjectCard
                      key={project.project_id}
                      project={project}
                      isPast={true}
                      isCreator={project.project_creator_id === user?.user_id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-600">
                    No completed projects yet
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Your completed projects will appear here
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Application Review Modal */}
      {showApplicationModal && selectedProject && (
        <ApplicationReviewModal
          project={selectedProject}
          onClose={handleCloseModal}
          onAction={handleApplicationAction}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
