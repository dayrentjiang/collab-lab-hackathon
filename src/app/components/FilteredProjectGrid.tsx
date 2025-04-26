'use client';
import React from 'react';
import { useState, useMemo } from 'react';
import { Project } from '../../types/types';
import ProjectCard from './ProjectCard';
import { Search } from 'lucide-react';
import { ProjectWithRelations } from '../../types/types';

export default function FilteredProjectGrid({ projects }: { projects: ProjectWithRelations[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;

    const lower = searchTerm.toLowerCase();
    return projects.filter((project) =>
    project.project_title.toLowerCase().includes(lower) ||
    project.project_description.toLowerCase().includes(lower) ||
    project.required_skills?.some(
      (skill) => skill.skill_name.toLowerCase().includes(lower)
    )
    );
  }, [searchTerm, projects]);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search projects by title, description, or skills..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.project_id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No projects found.</p>
      )}
    </div>
  );
}