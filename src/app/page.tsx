import React from "react";
import Link from "next/link";
import { getAllProjects } from "../actions/project";
import FilteredProjectGrid from "./components/FilteredProjectGrid";
import { PlusIcon, SearchIcon } from "lucide-react";
import { ProjectWithRelations } from "../types/types";

export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Await the searchParams object before accessing its properties
  const params = await searchParams;
  const category =
    typeof params.category === "string" ? params.category : undefined;

  // Fetch all projects with their skills
  const projects = (await getAllProjects()) as ProjectWithRelations[];

  // Filter projects by category if needed
  // Sort projects by created_at in descending order (newest first)
  const sortedProjects = projects.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  //only show projects that do not have complete status
  const filteredProjects = sortedProjects.filter(
    (project) => project.project_status !== "completed"
  );
  console.log(filteredProjects);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12 mt-6 mx-4 sm:mx-8 lg:mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find Your Next Collaboration
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with students and early-career developers to collaborate on
            meaningful projects
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
          {category
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Projects`
            : "All Projects"}
        </h2>

        <FilteredProjectGrid projects={filteredProjects} />
      </section>
    </main>
  );
}
