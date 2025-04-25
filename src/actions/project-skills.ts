import { supabase } from "@/lib/supabase";
import { ProjectSkill, CreateProjectSkillInput, UpdateProjectSkillInput } from "@/types/types";

export async function createProjectSkill(input: CreateProjectSkillInput): Promise<ProjectSkill> {
  const { data: projectSkill } = await supabase
    .from('project_skills')
    .insert(input)
    .select()
    .single();
  return projectSkill!;
}

export async function getProjectSkills(projectId: string): Promise<ProjectSkill[]> {
  const { data: projectSkills } = await supabase
    .from('project_skills')
    .select()
    .eq('project_id', projectId);
  return projectSkills || [];
}

export async function updateProjectSkill(
  id: string,
  input: UpdateProjectSkillInput
): Promise<ProjectSkill> {
  const { data: projectSkill } = await supabase
    .from('project_skills')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  return projectSkill!;
}

export async function deleteProjectSkill(id: string): Promise<void> {
  await supabase
    .from('project_skills')
    .delete()
    .eq('id', id);
} 