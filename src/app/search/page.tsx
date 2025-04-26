"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Project, Skill } from "../../types/types";
import { getAllProjects, getAvailableSkills } from "../../actions/project";
import ProjectCard from "../components/ProjectCard";
import { Search, Filter, X, Loader2 } from "lucide-react";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchPage />
    </Suspense>
  );
}

function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || ""
  );

  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [skillsData, projectsData] = await Promise.all([
          getAvailableSkills(),
          getAllProjects()
        ]);

        if (Array.isArray(skillsData)) setSkills(skillsData);
        if (Array.isArray(projectsData)) {
          setProjects(projectsData);
          applyFilters(
            projectsData,
            searchTerm,
            selectedCategory,
            selectedStatus
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  const applyFilters = (
    allProjects: Project[],
    term: string,
    category: string,
    status: string
  ) => {
    let result = [...allProjects];

    if (term) {
      const lowerTerm = term.toLowerCase();
      result = result.filter(
        (p) =>
          p.project_title.toLowerCase().includes(lowerTerm) ||
          p.project_description.toLowerCase().includes(lowerTerm) ||
          p.skills?.some((s) => s.skill_name.toLowerCase().includes(lowerTerm))
      );
    }

    if (category) {
      result = result.filter((p) =>
        p.skills?.some((s) => s.skill_category === category)
      );
    }

    if (status) {
      result = result.filter((p) => p.project_status === status);
    }

    setFilteredProjects(result);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedStatus) params.set("status", selectedStatus);

    router.push(`/search?${params.toString()}`);
    applyFilters(projects, searchTerm, selectedCategory, selectedStatus);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    router.push("/search");
    applyFilters(projects, "", "", "");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Projects</h1>

      <div className="bg-white border p-4 rounded-lg shadow-sm mb-8">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, description, or skills..."
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" /> Filters
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
              >
                Search
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm mb-1">
                  Skill Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">All Categories</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="design">Design</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm mb-1">
                  Project Status
                </label>
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">All Statuses</option>
                  <option value="recruiting">Recruiting</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : filteredProjects.length ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {filteredProjects.length} Results
            </h2>
            <div className="flex gap-2 text-sm">
              {searchTerm && (
                <FilterBadge
                  label={searchTerm}
                  color="blue"
                  onClick={() => {
                    setSearchTerm("");
                    applyFilters(
                      projects,
                      "",
                      selectedCategory,
                      selectedStatus
                    );
                  }}
                />
              )}
              {selectedCategory && (
                <FilterBadge
                  label={selectedCategory}
                  color="green"
                  onClick={() => {
                    setSelectedCategory("");
                    applyFilters(projects, searchTerm, "", selectedStatus);
                  }}
                />
              )}
              {selectedStatus && (
                <FilterBadge
                  label={selectedStatus.replace("_", " ")}
                  color="purple"
                  onClick={() => {
                    setSelectedStatus("");
                    applyFilters(projects, searchTerm, selectedCategory, "");
                  }}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white border p-8 rounded-lg text-center shadow-sm">
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or search terms.
          </p>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
}

// Badge for active filters
function FilterBadge({
  label,
  color,
  onClick
}: {
  label: string;
  color: string;
  onClick: () => void;
}) {
  const bgClass = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800"
  }[color];

  const textClass = {
    blue: "text-blue-500 hover:text-blue-700",
    green: "text-green-500 hover:text-green-700",
    purple: "text-purple-500 hover:text-purple-700"
  }[color];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgClass}`}
    >
      {label}
      <button onClick={onClick} className={`ml-1 ${textClass}`}>
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
