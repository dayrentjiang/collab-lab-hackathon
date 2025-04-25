import { createClient } from '@supabase/supabase-js';
import { UserSkill, ProjectWithRelations } from '@/types/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getUserSkillProjects(userId: string) {
  try {
    // 1. Get user's skills
    const { data: userSkills, error: skillsError } = await supabase
      .from('user_skills')
      .select('skill_id')
      .eq('user_id', userId);

    if (skillsError) throw skillsError;

    if (!userSkills || userSkills.length === 0) {
      return { data: [], error: null };
    }

    const skillIds = userSkills.map(skill => skill.skill_id);

    // 2. Get projects that require these skills
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(`
        *,
        required_skills:project_skills (
          skill_id,
          skill_name,
          skill_category
        )
      `)
      .contains('project_skills.skill_id', skillIds);

    if (projectsError) throw projectsError;

    return { data: projects, error: null };
  } catch (error) {
    console.error('Error fetching user skill projects:', error);
    return { data: null, error };
  }
} 