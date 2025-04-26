import React from "react";
import Link from "next/link";
import { getAllProjects } from "../actions/project";
import FilteredProjectGrid from "./components/FilteredProjectGrid";
import { PlusIcon, SearchIcon } from "lucide-react";

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
  const projects = (await getAllProjects()) as Array<{
    id: string;
    skills?: Array<{ skill_category: string }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;

  // Filter projects by category if needed
  const filteredProjects = category
    ? projects.filter((project) =>
        project.skills?.some((skill) => skill.skill_category === category)
      )
    : projects;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find Your Next Collaboration
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Connect with students and early-career developers to collaborate on
            meaningful projects
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects/create"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Post Project
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-blue-500 text-blue-500 font-medium rounded-full hover:bg-blue-50 transition"
            >
              <SearchIcon className="h-5 w-5 mr-2" />
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {category
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Projects`
            : "All Projects"}
        </h2>

        <FilteredProjectGrid projects={filteredProjects} />
      </section>
    </main>
  );
}
