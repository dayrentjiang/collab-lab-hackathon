import Link from 'next/link';
import { Suspense } from 'react';
import { MOCK_PROJECTS } from '@/types/mockData';
import { Project } from '@/types/types';

import ProjectCard from './components/ProjectCard';
import SkillCategoryTabs from './components/SkillCategoryTabs';
import { PlusIcon, SearchIcon } from 'lucide-react';

// Add the getRecommendedProjects function here
async function getRecommendedProjects(category?: string): Promise<Project[]> {
  // Add a slight delay to simulate fetching data
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredProjects = [...MOCK_PROJECTS];
  
  // Apply category filter if provided
  if (category) {
    filteredProjects = filteredProjects.filter(project => 
      project.required_skills.some(skill => skill.skill_category === category)
    );
  }
  
  // Sort by most recent first and show recruiting projects first
  return filteredProjects
    .sort((a, b) => {
      // Status priority: recruiting > in_progress > completed
      if (a.project_status !== b.project_status) {
        if (a.project_status === 'recruiting') return -1;
        if (b.project_status === 'recruiting') return 1;
        if (a.project_status === 'in_progress') return -1;
        if (b.project_status === 'in_progress') return 1;
      }
      
      // Then sort by date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, 6); // Return top 6 recommended projects
}

export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  
  // Fetch recommended projects with the selected category filter
  const projects = await getRecommendedProjects(category);
  
  return (
    // Rest of your component remains unchanged
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Next Collaboration</h1>
          <p className="text-xl text-gray-600 mb-6">
            Connect with students and early-career developers to collaborate on meaningful projects
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Browse by Skill</h2>
        <SkillCategoryTabs />
      </div>
      
      {/* Recommended Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {category 
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Projects`
            : 'Recommended Projects'}
        </h2>
        
        <Suspense fallback={<p className="text-center py-8 text-gray-500">Loading projects...</p>}>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard key={project.project_id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {category 
                  ? `There are no ${category} projects available right now.`
                  : 'There are no recommended projects available right now.'}
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
      
      {/* Recent Activity Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          {/* This would typically come from a database */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 flex items-start">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm mr-4">
                US
              </div>
              <div>
                <p className="text-gray-800">
                  <span className="font-medium">User {item}</span>
                  {' '}{item === 1 ? 'created a new project' : item === 2 ? 'joined a project' : 'completed a project'}
                </p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
   
 