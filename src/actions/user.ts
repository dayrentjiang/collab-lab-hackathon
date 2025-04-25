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
        const userSkillResponse = await fetch(`/api/user/skills`, {
          // Changed to kebab case format
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: user_clerk_id,
            skill_id: skillId
          })
        });

        if (!userSkillResponse.ok) {
          throw new Error(`Failed to associate user with skill ID: ${skillId}`);
        }

        return userSkillResponse.json();
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
