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
    // Step 1: Create the user
    const response = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const user = await response.json();
    const userId = user.user_id; // Assuming the response contains the user ID

    // Step 2: If there are selected skills, create user_skills entries
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
            user_id: userId,
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
