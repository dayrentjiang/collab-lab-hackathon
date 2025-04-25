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

//user_clerk_id
// user_email,
//       user_password,
//       user_name,
//       user_bio,
//       user_linkedin_link,
//       user_university

import { ProfileFormData } from "@/types/types";

//we will create action to create user in supabase (create user first and then the selected skills)
export async function createUser(formData: ProfileFormData) {
  //first create user in supabase using routes
}
