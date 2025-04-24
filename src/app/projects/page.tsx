import { Suspense } from 'react';
import Link from 'next/link';
import ProjectCard from '../components/ProjectCard';
import { FilterIcon, PlusIcon, SearchIcon } from 'lucide-react';
import ProjectsFilter from '../components/ProjectsFilter';
import { MOCK_PROJECTS } from '@/types/mockData';
import { Project } from '@/types/types';

// Function to get all projects with filters
async function getAllProjects(params: {
  category?: string;
  status?: 'recruiting' | 'in_progress' | 'completed';
  query?: string;
}): Promise<Project[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredProjects = [...MOCK_PROJECTS];
  
  // Apply category filter
  if (params.category) {
    filteredProjects = filteredProjects.filter(project => 
      project.required_skills.some(skill => skill.skill_category === params.category)
    );
  }
  
  // Apply status filter
  if (params.status) {
    filteredProjects = filteredProjects.filter(project => 
      project.project_status === params.status
    );
  }
  
  // Apply search query
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredProjects = filteredProjects.filter(project => 
      project.project_title.toLowerCase().includes(query) ||
      project.project_description.toLowerCase().includes(query)
    );
  }
  
  // Sort by most recent first
  return filteredProjects.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract filter parameters
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const status = typeof searchParams.status === 'string' 
    ? (searchParams.status as 'recruiting' | 'in_progress' | 'completed' | undefined)
    : undefined;
  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  
  // Fetch projects with filters
  const projects = await getAllProjects({ category, status, query });
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Explore Projects</h1>
          <p className="text-gray-600 mt-1">Find projects that match your skills and interests</p>
        </div>
        
        <Link 
          href="/projects/create" 
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Post Project
        </Link>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search projects..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition md:w-auto w-full"
          >
            Search
          </button>
        </form>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 w-full">
          <Suspense fallback={<div className="animate-pulse h-72 bg-gray-100 rounded-lg"></div>}>
            <ProjectsFilter
              selectedCategory={category}
              selectedStatus={status}
            />
          </Suspense>
        </aside>
        
        {/* Projects Grid */}
        <div className="flex-grow">
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          }>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <ProjectCard key={project.project_id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h2>
                <p className="text-gray-600 mb-6">
                  {query 
                    ? `No results for "${query}"`
                    : category
                      ? `No ${category} projects found`
                      : status
                        ? `No projects with status "${status}"`
                        : "No projects available at this time"}
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
        </div>
      </div>
    </main>
  );
}