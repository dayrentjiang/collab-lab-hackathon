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

//get all projects
export const getAllProjects = async () => {
  try {
    const { data: projects, error } = await supabase.from("projects").select(`
        *,
        project_creator:users(*)
      `);

    if (error) throw error;
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return error;
  }
};

//get recommended projects for user

//get all user projects

//create project
//we will create[]= the project and then create the project_skills
