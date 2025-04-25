"use client";

import React, { useEffect, useState } from "react";
import { getUserProjectsAsCreator } from "../../../actions/user-projects";
import { UserProject, Project } from "../../../types/types";
import UserProjectCard from "./UserProjectCard"; // Assuming this path is correct

type CombinedProject = UserProject & { project: Project };

interface ProjectPageProps {
  userId: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ userId }) => {
  const [projects, setProjects] = useState<CombinedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getUserProjectsAsCreator(userId);
        console.log("Fetched projects:", data);
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        My Created Projects
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven't created any projects yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <UserProjectCard key={project.project_id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
