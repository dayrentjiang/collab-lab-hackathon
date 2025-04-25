import Link from "next/link";
import { Suspense } from "react";
import { getAllProjects } from "../actions/project";
import ProjectCard from "./components/ProjectCard";
import SkillCategoryTabs from "./components/SkillCategoryTabs";
import { PlusIcon, SearchIcon } from "lucide-react";

export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;

  // Fetch all projects with their skills
  const projects = await getAllProjects();

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
              href="/projects"
              className="inline-flex items-center px-6 py-3 border border-blue-500 text-blue-500 font-medium rounded-full hover:bg-blue-50 transition"
            >
              <SearchIcon className="h-5 w-5 mr-2" />
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Skill Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Browse by Skill
        </h2>
        <SkillCategoryTabs />
      </div>

      {/* Recommended Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {category
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Projects`
            : "Recommended Projects"}
        </h2>

        <Suspense fallback={<ProjectsLoadingSkeleton />}>
          {Array.isArray(filteredProjects) && filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.project_id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 mb-6">
                {category
                  ? `There are no ${category} projects available right now.`
                  : "There are no recommended projects available right now."}
              </p>
              <Link
                href="/projects/create"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Project
              </Link>
            </div>
          )}
        </Suspense>
      </section>
    </main>
  );
}

// Loading skeleton for projects
function ProjectsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 animate-pulse"
        >
          <div className="flex justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex gap-2 mb-6">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-14"></div>
          </div>
          <div className="flex justify-between mb-6">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-9 bg-gray-200 rounded-full w-full"></div>
        </div>
      ))}
    </div>
  );
}
