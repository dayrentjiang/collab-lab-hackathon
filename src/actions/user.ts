import { ProfileFormData } from "@/types/types";
import { supabase } from "@/lib/supabase";

// Fixed createUser function
// Fixed createUser function
export async function createUser(formData: ProfileFormData) {
  // First create user in supabase using routes, get rid of the selected skills first
  const { selected_skills, ...userData } = formData;
  console.log("userData", userData);
  console.log("selected_skills", selected_skills);

  try {
    const user_clerk_id = userData.user_clerk_id;
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_clerk_id", user_clerk_id)
      .single();
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser;
    }

    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          user_email: userData.user_email,
          user_name: userData.user_name,
          user_bio: userData.user_bio,
          user_linkedin_link: userData.user_linkedin_link,
          user_university: userData.user_university,
          user_role: userData.user_role,
          user_clerk_id,
          has_completed_personalized: true // Default value
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
    }

    //after creating the user, we need to insert the selected skills into the user_skills table
    if (selected_skills && selected_skills.length > 0) {
      // Map through the selected skills array and create skill associations
      const skillPromises = selected_skills.map(async (skillId) => {
        // Note: Changed from `/api/skills/${skill}` to `/api/skills/${skillId}`
        // because it seems we're already working with skill IDs

        // Create the user skill in the user_skills table
        const userSkillResponse = await supabase
          .from("user_skills")
          .insert([
            {
              user_id: user.user_id,
              skill_id: skillId
            }
          ])
          .select()
          .single(); // Assuming you want to get the inserted row back

        if (!userSkillResponse) {
          throw new Error(`Failed to associate user with skill ID: ${skillId}`);
        }

        return userSkillResponse;
      });

      // Wait for all skill associations to complete
      await Promise.all(skillPromises);
    }

    // Return the created user
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return error;
  }
}

//now get the has_completed_personalized value from the user table and return it
export async function getUserHasCompletedPersonalized(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("has_completed_personalized")
      .eq("user_clerk_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data?.has_completed_personalized;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

//get all user projects that they are part of
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

//get all user project that they are the creator
export const getUserCreatedProjects = async (userId: string) => {
  try {
    const { data: userProjects } = await supabase
      .from("projects")
      .select("*, user:user_projects(*)")
      .eq("project_creator_id", userId);

    return userProjects;
  } catch (error) {
    console.error("[GET_USER_PROJECTS]", error);
    throw new Error("Failed to fetch user projects");
  }
};

//fetch my projects
export async function fetchMyProjects(userId: string) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    // Fetch projects created by the user that are not completed
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select(
        `
          project_id,
          project_title,
          project_description,
          project_creator_id,
          project_status,
          project_vacancy,
          project_timeline,
          created_at,
          updated_at
        `
      )
      .eq("project_creator_id", userId)
      .neq("project_status", "completed")
      .order("created_at", { ascending: false });

    if (projectsError) throw projectsError;

    // For each project, fetch required skills, applications, and members
    const enhancedProjects = await Promise.all(
      projects.map(async (project) => {
        // Fetch required skills for each project
        const { data: skills, error: skillsError } = await supabase
          .from("project_skills")
          .select(
            `
              skills (
                skill_id,
                skill_name,
                skill_category
              )
            `
          )
          .eq("project_id", project.project_id);

        if (skillsError) throw skillsError;

        // Fetch applications for each project
        const { data: applications, error: appsError } = await supabase
          .from("applications")
          .select(
            `
              application_id,
              project_id,
              user_id,
              application_msg,
              application_status,
              applied_at,
              users (
                user_id,
                user_name,
                user_bio,
                user_university
              )
            `
          )
          .eq("project_id", project.project_id);

        if (appsError) throw appsError;

        // Fetch members for each project
        const { data: userProjects, error: membersError } = await supabase
          .from("user_projects")
          .select(
            `
              user_id,
              user_role,
              users (
                user_id,
                user_name
              )
            `
          )
          .eq("project_id", project.project_id);

        if (membersError) throw membersError;

        // Format the data to match the mock structure
        const formattedMembers = userProjects.map((up) => ({
          user_id: up.user_id,
          user_name:
            up.user_id === userId ? "You (Project Lead)" : up.users.user_name,
          user_role: up.user_role
        }));

        const formattedApplications = applications.map((app) => ({
          application_id: app.application_id,
          user_id: app.user_id,
          application_msg: app.application_msg,
          application_status: app.application_status,
          applied_at: app.applied_at,
          user: {
            user_name: app.users.user_name,
            user_bio: app.users.user_bio,
            user_university: app.users.user_university
          }
        }));

        const formattedSkills = skills.map((s) => ({
          skill_id: s.skills.skill_id,
          skill_name: s.skills.skill_name,
          skill_category: s.skills.skill_category
        }));

        return {
          ...project,
          required_skills: formattedSkills,
          applications: formattedApplications,
          members: formattedMembers
        };
      })
    );

    return { data: enhancedProjects };
  } catch (error) {
    console.error("Error fetching my projects:", error);
    return { error: "Failed to fetch projects" };
  }
}

//fetch joined projects
export async function fetchJoinedProjects(userId: string) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    // Fetch projects the user has joined but did not create that are not completed
    const { data: userProjects, error: userProjectsError } = await supabase
      .from("user_projects")
      .select(
        `
          project_id,
          user_role,
          projects (
            project_id,
            project_title,
            project_description,
            project_creator_id,
            project_status,
            project_vacancy,
            project_timeline,
            created_at,
            updated_at
          )
        `
      )
      .eq("user_id", userId)
      .eq("user_role", "member")
      .neq("projects.project_status", "completed");

    if (userProjectsError) throw userProjectsError;

    // Extract just the project data
    const joinedProjects = userProjects.map((up) => up.projects);

    // For each project, fetch additional data
    const enhancedProjects = await Promise.all(
      joinedProjects.map(async (project) => {
        // Fetch project creator details
        const { data: creatorData, error: creatorError } = await supabase
          .from("users")
          .select(
            `
              user_id,
              user_name,
              user_university
            `
          )
          .eq("user_id", project.project_creator_id)
          .single();

        if (creatorError) throw creatorError;

        // Fetch required skills for the project
        const { data: skills, error: skillsError } = await supabase
          .from("project_skills")
          .select(
            `
              skills (
                skill_id,
                skill_name,
                skill_category
              )
            `
          )
          .eq("project_id", project.project_id);

        if (skillsError) throw skillsError;

        // Fetch all members of the project
        const { data: members, error: membersError } = await supabase
          .from("user_projects")
          .select(
            `
              user_id,
              user_role,
              users (
                user_id,
                user_name
              )
            `
          )
          .eq("project_id", project.project_id);

        if (membersError) throw membersError;

        // Format the data to match the mock structure
        const creator = {
          user_name: creatorData.user_name,
          user_university: creatorData.user_university
        };

        const formattedMembers = members.map((member) => ({
          user_id: member.user_id,
          user_name:
            member.user_id === project.project_creator_id
              ? `${member.users.user_name} (Project Lead)`
              : member.user_id === userId
              ? "You"
              : member.users.user_name,
          user_role: member.user_role
        }));

        const formattedSkills = skills.map((s) => ({
          skill_id: s.skills.skill_id,
          skill_name: s.skills.skill_name,
          skill_category: s.skills.skill_category
        }));

        return {
          ...project,
          creator,
          required_skills: formattedSkills,
          members: formattedMembers
        };
      })
    );

    return { data: enhancedProjects };
  } catch (error) {
    console.error("Error fetching joined projects:", error);
    return { error: "Failed to fetch joined projects" };
  }
}

//fech past projects
export async function fetchPastProjects(userId: string) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    // Fetch all completed projects the user is associated with (either as creator or member)
    const { data: userProjects, error: userProjectsError } = await supabase
      .from("user_projects")
      .select(
        `
        user_id,
        user_role,
        project_id,
        projects (
          project_id,
          project_title,
          project_description,
          project_creator_id,
          project_status,
          project_timeline,
          created_at
        )
      `
      )
      .eq("user_id", userId)
      .eq("projects.project_status", "completed");

    if (userProjectsError) throw userProjectsError;

    // Extract just the project data with role info
    const pastProjects = userProjects.map((up) => ({
      ...up.projects,
      userRole: up.user_role // Add user's role in the project
    }));

    // For each project, fetch additional data
    const enhancedProjects = await Promise.all(
      pastProjects.map(async (project) => {
        // For projects where user was not the creator, fetch creator info
        let creator = null;
        if (project.project_creator_id !== userId) {
          const { data: creatorData, error: creatorError } = await supabase
            .from("users")
            .select(
              `
              user_name,
              user_university
            `
            )
            .eq("user_id", project.project_creator_id)
            .single();

          if (creatorError) throw creatorError;
          creator = creatorData;
        } else {
          // If user is the creator
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("user_university")
            .eq("user_id", userId)
            .single();

          if (userError) throw userError;
          creator = {
            user_name: "You",
            user_university: userData.user_university
          };
        }

        // Fetch required skills for the project
        const { data: skills, error: skillsError } = await supabase
          .from("project_skills")
          .select(
            `
            skills (
              skill_id,
              skill_name,
              skill_category
            )
          `
          )
          .eq("project_id", project.project_id);

        if (skillsError) throw skillsError;

        // Fetch all members of the project
        const { data: members, error: membersError } = await supabase
          .from("user_projects")
          .select(
            `
            user_id,
            user_role,
            users (
              user_id,
              user_name
            )
          `
          )
          .eq("project_id", project.project_id);

        if (membersError) throw membersError;

        // Format the data to match the mock structure
        const formattedMembers = members.map((member) => ({
          user_id: member.user_id,
          user_name:
            member.user_id === project.project_creator_id
              ? `${
                  member.user_id === userId ? "You" : member.users.user_name
                } (Project Lead)`
              : member.user_id === userId
              ? "You"
              : member.users.user_name,
          user_role: member.user_role
        }));

        const formattedSkills = skills.map((s) => ({
          skill_id: s.skills.skill_id,
          skill_name: s.skills.skill_name,
          skill_category: s.skills.skill_category
        }));

        return {
          ...project,
          creator,
          required_skills: formattedSkills,
          members: formattedMembers
        };
      })
    );

    return { data: enhancedProjects };
  } catch (error) {
    console.error("Error fetching past projects:", error);
    return { error: "Failed to fetch past projects" };
  }
}
