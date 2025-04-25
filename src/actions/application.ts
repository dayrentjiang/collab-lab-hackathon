import { supabase } from "@/lib/supabase";

// Create a new application
export async function createApplication(
  projectId: number,
  userId: string,
  applicationMsg: string
) {
  try {
    const { data: application, error } = await supabase
      .from("applications")
      .insert([
        {
          project_id: projectId,
          user_id: userId,
          application_msg: applicationMsg,
          application_status: "pending",
          applied_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating application:", error);
      throw error;
    }

    return application;
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
}

// Get all applications for a project
export async function getProjectApplications(projectId: number) {
  try {
    const { data: applications, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        user:users(*)
      `
      )
      .eq("project_id", projectId);

    if (error) {
      console.error("Error fetching project applications:", error);
      throw error;
    }

    return applications;
  } catch (error) {
    console.error("Error fetching project applications:", error);
    throw error;
  }
}

// Get all applications for a user
export async function getUserApplications(userId: string) {
  try {
    const { data: applications, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        project:projects(*)
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user applications:", error);
      throw error;
    }

    return applications;
  } catch (error) {
    console.error("Error fetching user applications:", error);
    throw error;
  }
}

// Update application status
export async function updateApplicationStatus(
  applicationId: number,
  status: "pending" | "accepted" | "rejected"
) {
  try {
    const { data: application, error } = await supabase
      .from("applications")
      .update({ application_status: status })
      .eq("application_id", applicationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating application status:", error);
      throw error;
    }

    return application;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
}

// Delete an application
export async function deleteApplication(applicationId: number) {
  try {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("application_id", applicationId);

    if (error) {
      console.error("Error deleting application:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
}

// get all applications by project id to show the owner of the project
export async function getApplicationsByProjectId(projectId: number) {
  try {
    const { data: applications, error } = await supabase
      .from("applications")
      .select("*")
      .eq("project_id", projectId);

    if (error) {
      console.error("Error fetching applications by project ID:", error);
      throw error;
    }

    return applications;
  } catch (error) {
    console.error("Error fetching applications by project ID:", error);
    throw error;
  }
}
