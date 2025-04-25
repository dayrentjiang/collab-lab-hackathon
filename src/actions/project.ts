import { supabase } from "@/lib/supabase";
import { ProjectFormData } from "@/types/types";

//fetch to using supabase
//get all skills
export const getAvailableSkills = async () => {
  try {
    const { data: skills, error } = await supabase.from("skills").select("*");

    if (error) {
      console.error("Error fetching skills:", error);
      return [];
    }

    return skills;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
};

export const getAllProjects = async () => {
  try {
    // First, get all projects with their creators
    const { data: projects, error } = await supabase.from("projects").select(`
          *,
          project_creator:users(*)
        `);

    if (error) throw error;

    // Then get all project-skill relationships in a single query
    const { data: allProjectSkills, error: skillsError } = await supabase.from(
      "project_skills"
    ).select(`
          project_id,
          skill_id,
          skills(*)
        `);

    if (skillsError) throw skillsError;

    // Map skills to their respective projects
    const completeProjects = projects.map((project) => {
      // Find all skills for this project
      const projectSkills = allProjectSkills
        .filter((ps) => ps.project_id === project.project_id)
        .map((ps) => ps.skills);

      return {
        ...project,
        skills: projectSkills
      };
    });

    return completeProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return error;
  }
};

//get recommended projects for user

//get all user projects

//create project
//we will create[]= the project and then create the project_skills
export const createProject = async (formData: ProjectFormData) => {
  try {
    const {
      project_title,
      project_description,
      project_creator_id,
      project_status,
      project_vacancy,
      project_timeline,
      required_skills: skills
    } = formData;

    // Create the project first
    const { data: project, error } = await supabase
      .from("projects")
      .insert([
        {
          project_title,
          project_description,
          project_creator_id,
          project_status,
          project_vacancy,
          project_timeline
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Now create the project-skill relationships
    if (skills && skills.length > 0) {
      const skillPromises = skills.map(async (skillId) => {
        const { error: skillError } = await supabase
          .from("project_skills")
          .insert([
            {
              project_id: project.project_id,
              skill_id: skillId
            }
          ]);

        if (skillError) throw skillError;
      });

      // Wait for all skill associations to complete
      await Promise.all(skillPromises);
    }

    //add to user_project table
    const { error: userProjectError } = await supabase
      .from("user_projects")
      .insert([
        {
          user_id: project_creator_id,
          project_id: project.project_id,
          user_role: "creator",
          joined_at: new Date().toISOString()
        }
      ]);

    if (userProjectError) throw userProjectError;

    return project;
  } catch (error) {
    console.error("Error creating project:", error);
    return error;
  }
};

//get project_creator_id from project_id
export const getProjectCreatorId = async (projectId: number) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("project_creator_id")
      .eq("project_id", projectId)
      .single();

    if (error) {
      console.error("Error fetching project creator ID:", error);
      return null;
    }

    return data?.project_creator_id;
  } catch (error) {
    console.error("Error fetching project creator ID:", error);
    return null;
  }
};

//get project by id
export const getProjectById = async (projectId: number) => {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select(
        `
            *,
            project_creator_id:users(*),
            `
      )
      .eq("project_id", projectId)
      .single();

    if (error) throw error;

    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return error;
  }
};

//check project status
export const checkProjectStatus = async (projectId: number) => {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select("project_status")
      .eq("project_id", projectId)
      .single();

    if (error) {
      console.error("Error fetching project status:", error);
      return null;
    }

    return project?.project_status;
  } catch (error) {
    console.error("Error fetching project status:", error);
    return null;
  }
};
