"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProjects } from "../actions/project";
import FilteredProjectGrid from "./components/FilteredProjectGrid";
import { PlusIcon, SearchIcon } from "lucide-react";
import { ProjectWithRelations } from "../types/types";

export default function Home() {
  const [filteredProjects, setFilteredProjects] = useState<
    ProjectWithRelations[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        // Fetch all projects with their skills
        const projects = (await getAllProjects()) as ProjectWithRelations[];

        // Sort projects by created_at in descending order (newest first)
        const sortedProjects = projects.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Only show projects that are not completed
        const filtered = sortedProjects.filter(
          (project) => project.project_status !== "completed"
        );

        setFilteredProjects(filtered);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12 mx-4 sm:mx-8 lg:mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find Your Next Collaboration
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Turn your ideas into reality. Whether you have skills to offer or
            ideas to share, CollabLab connects you with the right people and
            projects. Build, collaborate, and grow your skills together.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Post Project
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border-2 border-blue-100 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              <SearchIcon className="h-5 w-5 mr-2" />
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended Projects */}
      <section className="mb-12 mx-4 sm:mx-8 lg:mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          All Available Projects
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <FilteredProjectGrid projects={filteredProjects} />
        )}
      </section>
    </main>
  );
}
