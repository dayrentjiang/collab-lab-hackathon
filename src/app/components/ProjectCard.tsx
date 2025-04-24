import Link from 'next/link';
import { CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';
import { ProjectWithRelations } from '@/types/types';

type ProjectCardProps = {
  project: ProjectWithRelations;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const {
    project_id,
    project_title,
    project_description,
    project_status,
    project_vacancy,
    project_timeline,
    created_at,
    required_skills,
    creator,
    members
  } = project;

  // Status badge color
  const statusColors = {
    'recruiting': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-green-100 text-green-800',
    'completed': 'bg-gray-100 text-gray-800'
  };

  // Format the creation date
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Function to get skill category color
  const getSkillCategoryColor = (category: string) => {
    switch(category) {
      case 'frontend':
        return 'bg-purple-100 text-purple-800';
      case 'backend':
        return 'bg-green-100 text-green-800';
      case 'design':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Current team size
  const teamSize = members ? `${members.length}/${members.length + project_vacancy}` : `0/${project_vacancy}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{project_title}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project_status]}`}>
            {project_status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project_description}</p>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {required_skills && required_skills.slice(0, 3).map(skill => (
            <span 
              key={skill.skill_id}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSkillCategoryColor(skill.skill_category)}`}
            >
              {skill.skill_name}
            </span>
          ))}
          {required_skills && required_skills.length > 3 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{required_skills.length - 3} more
            </span>
          )}
        </div>
        
        {/* Project Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs text-gray-500">
          {creator && (
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] mr-1.5">
                {creator.user_name.substring(0, 2).toUpperCase()}
              </div>
              <span>{creator.user_name}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <UsersIcon className="h-3.5 w-3.5 mr-1" />
            <span>{teamSize} members</span>
          </div>
          
          {project_timeline && (
            <div className="flex items-center">
              <ClockIcon className="h-3.5 w-3.5 mr-1" />
              <span>{project_timeline}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
            <span>Posted {formattedDate}</span>
          </div>
        </div>
        
        {/* Action Button */}
        <Link 
          href={`/projects/${project_id}`}
          className="block w-full py-2 bg-blue-500 text-white text-center rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          {project_status === 'recruiting' 
            ? 'View & Apply' 
            : project_status === 'in_progress'
              ? 'View Details'
              : 'View Project'}
        </Link>
      </div>
    </div>
  );
}