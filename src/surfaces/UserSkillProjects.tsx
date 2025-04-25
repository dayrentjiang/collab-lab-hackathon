'use client';

import { useEffect, useState } from 'react';
import { getUserSkillProjects } from './getUserSkillProjects';
import { ProjectWithRelations } from '@/types/types';

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (projects.length === 0) return <div>No related projects found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.project_id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold mb-2">{project.project_title}</h3>
          <p className="text-gray-600 mb-4">{project.project_description}</p>
          <div className="flex flex-wrap gap-2">
            {project.required_skills?.map((skill) => (
              <span
                key={skill.skill_id}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              >
                {skill.skill_name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 