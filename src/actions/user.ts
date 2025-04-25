import { ProfileFormData } from "@/types/types";
import { supabase } from "@/lib/supabase";

// Fixed createUser function
export async function createUser(formData: ProfileFormData) {
  // First create user in supabase using routes, get rid of the selected skills first
  const { selected_skills, ...userData } = formData;
  console.log("userData", userData);
  console.log("selected_skills", selected_skills);
  try {
    const user_clerk_id = userData.user_clerk_id;
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
          has_completed_personalized: false // Default value
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
    }

    //after creating the user, we need to insert the selected skills into the user_skills table
    if (selected_skills && selected_skills.length > 0) {
      const userId = user?.user_id; // Assuming user_id is the primary key in the users table
      const userSkills = selected_skills.map((skillId) => ({
        user_id: userId,
        skill_id: skillId
      }));

      await supabase.from("user_skills").insert(userSkills);
    }
    //return the user object
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return error;
  }
}
