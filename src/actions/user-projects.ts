import { supabase } from "@/lib/supabase";

// Get all projects for a user
export const getUserProjects = async (userId: string) => {
  try {
    const { data: userProjects } = await supabase
      .from('user_projects')
      .select('*, project:projects(*)')
      .eq('user_id', userId);

    return userProjects;
  } catch (error) {
    console.error("[GET_USER_PROJECTS]", error);
    throw new Error("Failed to fetch user projects");
  }
};

// Join a project
export const joinProject = async (userId: string, projectId: string) => {
  try {
    const { data: existingUserProject } = await supabase
      .from('user_projects')
      .select()
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single();

    if (existingUserProject) {
      throw new Error("User is already in this project");
    }

    const { data: userProject } = await supabase
      .from('user_projects')
      .insert([
        { user_id: userId, project_id: projectId }
      ])
      .select()
      .single();

    return userProject;
  } catch (error) {
    console.error("[JOIN_PROJECT]", error);
    throw error;
  }
};

// Leave a project
export const leaveProject = async (userId: string, projectId: string) => {
  try {
    const { data: userProject } = await supabase
      .from('user_projects')
      .delete()
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .select()
      .single();

    return userProject;
  } catch (error) {
    console.error("[LEAVE_PROJECT]", error);
    throw new Error("Failed to leave project");
  }
}; 