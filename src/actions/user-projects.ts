import { supabase } from "@/lib/supabase";
import { checkProjectStatus } from "./project";
import { getUserByClerkId } from "./user";

// Get all projects for a user
export const getUserProjects = async (userId: string) => {
  try {
    const { data: userProjects } = await supabase
      .from("user_projects")
      .select("*, project:projects(*)")
      .eq("user_id", userId);

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
      .from("user_projects")
      .select()
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .single();

    if (existingUserProject) {
      throw new Error("User is already in this project");
    }

    const { data: userProject } = await supabase
      .from("user_projects")
      .insert([{ user_id: userId, project_id: projectId }])
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
      .from("user_projects")
      .delete()
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .select()
      .single();

    return userProject;
  } catch (error) {
    console.error("[LEAVE_PROJECT]", error);
    throw new Error("Failed to leave project");
  }
};

//get user project where they are member in that project (check by role)
export const getUserProjectsAsMember = async (userId: string) => {
  try {
    const { data: userProjects } = await supabase
      .from("user_projects")
      .select("*, project:projects(*)")
      .eq("user_id", userId)
      .eq("user_role", "member");

    //for each project get the project skills
    if (!userProjects) {
      throw new Error("No user projects found");
    }

    //get the full project list using the project id
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .in(
        "project_id",
        userProjects.map((userProject) => userProject.project_id)
      );

    if (!projects) {
      throw new Error("No projects found");
    }
    //for each project get the project skills
    const projectsWithSkills = await Promise.all(
      projects.map(async (project) => {
        const projectSkills = await getProjectSkills(project.project_id);
        return { ...project, projectSkills };
      })
    );
    return projectsWithSkills;
  } catch (error) {
    console.error("[GET_USER_PROJECTS_AS_MEMBER]", error);
    throw new Error("Failed to fetch user projects as member");
  }
};

//get user project where they are creator in that project (check by role)
export const getUserProjectsAsCreator = async (userId: string) => {
  try {
    const { data: userProjects } = await supabase
      .from("user_projects")
      .select("*")
      .eq("user_id", userId)
      .eq("user_role", "creator");

    if (!userProjects) {
      throw new Error("No user projects found");
    }
    //get the full project list using the project id
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .in(
        "project_id",
        userProjects.map((userProject) => userProject.project_id)
      );

    if (!projects) {
      throw new Error("No projects found");
    }
    //for each project get the project skills
    const projectsWithSkills = await Promise.all(
      projects.map(async (project) => {
        const projectSkills = await getProjectSkills(project.project_id);
        return { ...project, projectSkills };
      })
    );

    return projectsWithSkills;
  } catch (error) {
    console.error("[GET_USER_PROJECTS_AS_CREATOR]", error);
    throw new Error("Failed to fetch user projects as creator");
  }
};

//get all user_projects that is has complete as a status for the project use the checkProjectStatus function
//get all the project id user have and than only return the complete one using map and return an array
export const getUserProjectsAsComplete = async (userId: string) => {
  try {
    const { data: userProjects } = await supabase
      .from("user_projects")
      .select("*, project:projects(*)")
      .eq("user_id", userId)
      .eq("user_role", "member");

    if (!userProjects) {
      throw new Error("No user projects found");
    }

    //use checkProjectStatus function to get the project status and return all of the complete one
    const completeProjects = await Promise.all(
      userProjects.map(async (userProject) => {
        const projectStatus = await checkProjectStatus(userProject.project_id);
        if (projectStatus === "complete") {
          return userProject;
        }
      })
    );

    return completeProjects;
  } catch (error) {
    console.error("[GET_USER_PROJECTS_AS_COMPLETE]", error);
    throw new Error("Failed to fetch user projects as complete");
  }
};

//get all member of a project
export const getProjectMembers = async (projectId: string) => {
  try {
    const { data: projectMembers } = await supabase
      .from("user_projects")
      .select("*, user:users(*)")
      .eq("project_id", projectId);

    return projectMembers;
  } catch (error) {
    console.error("[GET_PROJECT_MEMBERS]", error);
    throw new Error("Failed to fetch project members");
  }
};

//get all creator of a project complete with the skill
export const getProjectSkills = async (project_id: number) => {
  try {
    // Then get all project-skill relationships in a single query
    const { data: projectSkills, error: skillsError } = await supabase
      .from("project_skills")
      .select(
        `
          project_id,
          skill_id,
          skills(*)
        `
      )
      .eq("project_id", project_id);

    if (skillsError) throw skillsError;

    return projectSkills;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return error;
  }
};

//get all user that work for a project based on the project id
export const getProjectUsers = async (projectId: number) => {
  try {
    const { data: projectUsers } = await supabase
      .from("user_projects")
      .select("*, user_id")
      .eq("project_id", projectId);

    if (!projectUsers) {
      throw new Error("No project users found");
    }

    //for each user get the user details using getUserByClerkId
    const usersWithDetails = await Promise.all(
      projectUsers.map(async (projectUser) => {
        const userDetails = await getUserByClerkId(projectUser.user_id);
        return { ...projectUser, userDetails };
      })
    );

    return usersWithDetails;
  } catch (error) {
    console.error("[GET_PROJECT_USERS]", error);
    throw new Error("Failed to fetch project users");
  }
};
