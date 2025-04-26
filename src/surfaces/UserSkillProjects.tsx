'use client';

import { useEffect, useState } from 'react';
import { getUserSkillProjects } from './getUserSkillProjects';
import { ProjectWithRelations } from '@/types/types';
import { FolderOpen, Users } from 'lucide-react';
import Link from 'next/link';

export default function UserSkillProjects({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await getUserSkillProjects(userId);
        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        setError('Error loading projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
  if (error) return (
    <div className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
      {error}
    </div>
  );
  if (projects.length === 0) return (
    <div className="text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm text-center">
      <div className="text-gray-400 mb-4">
        <FolderOpen className="h-12 w-12 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No related projects found
      </h3>
      <p className="text-gray-500">
        There are currently no projects that match your skills. Check back later or try expanding your skill set!
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.project_id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {project.project_title}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  project.project_status === "in_progress"
                    ? "bg-green-100 text-green-800"
                    : project.project_status === "completed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {project.project_status}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              {project.project_description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.required_skills?.map((skill) => (
                <span
                  key={skill.skill_id}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs"
                >
                  {skill.skill_name}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                <span>
                  {project.members?.length || 0} member
                  {project.members?.length !== 1 ? "s" : ""}
                </span>
              </div>
              <Link
                href={`/projects/${project.project_id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 