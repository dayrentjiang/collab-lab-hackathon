import { ProfileFormData } from "@/types/types";
import { supabase } from "@/lib/supabase";

//get the user skills from the user_skills table
export async function getUserSkills(userId: string) {
  try {
    const { data: userSkills, error } = await supabase
      .from("user_skills")
      .select("skill_id:skills(*)")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user skills:", error);
      return [];
    }
    console.log("userSkills", userSkills);

    return userSkills || [];
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return [];
  }
}

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
              user_id: user_clerk_id,
              skill_id: skillId
            }
          ])
          .select();

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

export async function updateUser(
  user_clerk_id: string,
  input: Partial<ProfileFormData>
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(input)
      .eq("user_clerk_id", user_clerk_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message };
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

// Get user's projects (both created and joined)
export async function getUserProjects(userId: string) {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select(
        `
          *,
          creator:users!projects_project_creator_id_fkey(*),
          members:user_projects!user_projects_project_id_fkey(
            user:users(*)
          ),
          applications:applications(*)
        `
      )
      .or(`project_creator_id.eq.${userId},user_projects.user_id.eq.${userId}`);

    if (error) {
      console.error("Error fetching user projects:", error);
      return [];
    }

    return projects || [];
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return [];
  }
}

// Get project details with relations
export async function getProjectDetails(projectId: number) {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select(
        `
          *,
          creator:users!projects_project_creator_id_fkey(*),
          members:user_projects!user_projects_project_id_fkey(
            user:users(*)
          ),
          applications:applications(*)
        `
      )
      .eq("project_id", projectId)
      .single();

    if (error) {
      console.error("Error fetching project details:", error);
      return null;
    }

    return project;
  } catch (error) {
    console.error("Error fetching project details:", error);
    return null;
  }
}

export async function updateUserSkills(userId: string, newSkills: number[]) {
  try {
    // Step 1: Fetch current user skills
    const { data: currentSkills, error: fetchError } = await supabase
      .from("user_skills")
      .select("skill_id")
      .eq("user_id", userId);

    if (fetchError) {
      console.error("Error fetching current user skills:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // Step 2: Find skills to add (not already present)
    const skillsToAdd = newSkills.filter(
      (skillId) => !currentSkills.some((skill) => skill.skill_id === skillId)
    );

    // Step 3: Find skills to remove (present in currentSkills but not in newSkills)
    const skillsToRemove = currentSkills
      .filter((skill) => !newSkills.includes(skill.skill_id))
      .map((skill) => skill.skill_id);

    // Step 4: Add new skills
    const addPromises = skillsToAdd.map(async (skillId) => {
      const { error: addError } = await supabase.from("user_skills").insert([
        {
          user_id: userId,
          skill_id: skillId
        }
      ]);
      if (addError) {
        console.error(`Error adding skill ${skillId}:`, addError);
        return { success: false, error: addError.message };
      }
      return { success: true };
    });

    // Step 5: Remove skills that are no longer selected
    const removePromises = skillsToRemove.map(async (skillId) => {
      const { error: removeError } = await supabase
        .from("user_skills")
        .delete()
        .eq("user_id", userId)
        .eq("skill_id", skillId);

      if (removeError) {
        console.error(`Error removing skill ${skillId}:`, removeError);
        return { success: false, error: removeError.message };
      }
      return { success: true };
    });

    // Step 6: Wait for both add and remove promises to resolve
    const results = await Promise.all([...addPromises, ...removePromises]);

    // Check if any operation failed
    if (results.some((result) => result.success === false)) {
      return { success: false, error: "Some operations failed" };
    }

    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating user skills:", error);
    return { success: false, error: error.message };
  }
}

//get user by user_clerk_id
export async function getUserByClerkId(user_clerk_id: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_clerk_id", user_clerk_id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    //for the user get the skills
    const { data: userSkills, error: skillsError } = await supabase
      .from("user_skills")
      .select("skill_id:skills(*)")
      .eq("user_id", user_clerk_id);

    if (skillsError) {
      console.error("Error fetching user skills:", skillsError);
      return null;
    }
    //return the user with the skills
    return {
      ...data,
      skills: userSkills
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
export async function updateUserSkill(id: string, skill_id: number) {
  try {
    const { data, error } = await supabase
      .from("user_skills")
      .update({
        skill_id
      })
      .eq("id", id)
      .select(
        `
          id,
          user_id,
          skill_id,
        
          created_at,
          skills (
            id,
            name
          )
        `
      )
      .single();

    if (error) {
      console.error("Error updating user skill:", error);
      return { success: false, error: error.message };
    }

    const processedSkill = {
      id: data.id,
      user_id: data.user_id,
      skill_id: data.skill_id,
      skill_name: data.skills[0].name,

      created_at: data.created_at
    };

    return { success: true, data: processedSkill };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating user skill:", error);
    return { success: false, error: error.message };
  }
}

// Delete user skill
export async function deleteUserSkill(id: string) {
  try {
    const { error } = await supabase.from("user_skills").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user skill:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting user skill:", error);
    return { success: false, error: error.message };
  }
}
