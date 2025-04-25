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
<<<<<<< HEAD
<<<<<<< HEAD
  const completeProject = [];
  try {
    const { data: projects, error } = await supabase.from("projects").select(`
            *,
            project_creator:users(*)
        `);

    if (error) throw error;

    //get all projects with skills, map through the projects and get the skills for each project and insert them into the completeProject object
    for (let i = 0; i < projects.length; i++) {
      const { data: projectSkills, error } = await supabase
        .from("project_skills")
        .select(
          `
                *,
                skill:skills(*)
            `
        )
        .eq("project_id", projects[i].project_id);

      if (error) throw error;

      completeProject.push({
        ...projects[i],
        skills: projectSkills
      });
    }
    return completeProject;
=======
=======
  const completeProject = [];
>>>>>>> a903bbb (get all projects with skill)
  try {
    const { data: projects, error } = await supabase.from("projects").select(`
            *,
            project_creator:users(*)
        `);

    if (error) throw error;
<<<<<<< HEAD
    return projects;
>>>>>>> 7ded68b (get all projects)
=======

    //get all projects with skills, map through the projects and get the skills for each project and insert them into the completeProject object
    for (let i = 0; i < projects.length; i++) {
      const { data: projectSkills, error } = await supabase
        .from("project_skills")
        .select(
          `
                *,
                skill:skills(*)
            `
        )
        .eq("project_id", projects[i].project_id);

      if (error) throw error;

      completeProject.push({
        ...projects[i],
        skills: projectSkills
      });
    }
    return completeProject;
>>>>>>> a903bbb (get all projects with skill)
  } catch (error) {
    console.error("Error fetching projects:", error);
    return error;
  }
};

//get recommended projects for user

//get all user projects

//create project
//we will create[]= the project and then create the project_skills
