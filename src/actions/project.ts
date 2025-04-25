import { supabase } from "@/lib/supabase";

//fetch to /api/skills/route.ts
export const getAvailableSkills = async () => {
  try {
    const response = await fetch(`/api/skills`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch skills");
    }
    const skills = await response.json();
    return skills;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return error;
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
