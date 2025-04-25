//   // Default form values
//   const [formData, setFormData] = useState<ProfileFormData>({
//     user_clerk_id: user?.id,
//     user_email: user?.primaryEmailAddress?.emailAddress || '',
//     user_name: user?.fullName || '',
//     user_bio: '',
//     user_role: 'student', // Default role
//     user_linkedin_link: '',
//     user_university: '',
//     selected_skills: [],
//   });

//this is the //api/users route
//user_clerk_id
// user_email,
//       user_password,
//       user_name,
//       user_bio,
//       user_linkedin_link,
//       user_university,
// user_role

import { ProfileFormData } from "@/types/types";

//we will create action to create user in supabase (create user first and then the selected skills)
export async function createUser(formData: ProfileFormData) {
  //first create user in supabase using routes, get rid of the selected skills first
  const { selected_skills, ...userData } = formData;
  console.log("userData", userData);
  console.log("selected_skills", selected_skills);
  try {
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
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return error;
  }

  //use the user id to create the selected skills in supabase
  // const { user_id } = user;
  //get the skill ids from the selected skills array fetching to the supabase skills table
}
