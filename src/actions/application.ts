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
    // First, get all applications for the user
    const { data: applications, error: applicationsError } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", userId)
      .order("applied_at", { ascending: false });

    if (applicationsError) {
      console.error("Error fetching applications:", applicationsError);
      throw applicationsError;
    }

    if (!applications || applications.length === 0) {
      return [];
    }

    // Then, get all related projects in a single query
    const projectIds = applications.map(app => app.project_id);
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .in("project_id", projectIds);

    if (projectsError) {
      console.error("Error fetching projects:", projectsError);
      throw projectsError;
    }

    // Combine the data
    const applicationsWithProjects = applications.map(application => ({
      ...application,
      project: projects?.find(project => project.project_id === application.project_id)
    }));

    return applicationsWithProjects;
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
  console.log("Updating application status:", applicationId, status);
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

    //if the status is accepted, add the user to the project
    if (status === "accepted") {
      const { data: userProject, error: userProjectError } = await supabase
        .from("user_projects")
        .insert([
          {
            user_id: application.user_id,
            project_id: application.project_id
          }
        ])
        .select()
        .single();

      if (userProjectError) {
        console.error("Error adding user to project:", userProjectError);
        throw userProjectError;
      }

      return userProject;
    }

    //if the status is rejected, change the application status to rejected
    if (status === "rejected") {
      const { data: rejectedApplication, error: rejectedApplicationError } =
        await supabase
          .from("applications")
          .update({ application_status: "rejected" })
          .eq("application_id", applicationId)
          .select()
          .single();

      if (rejectedApplicationError) {
        console.error(
          "Error updating application status to rejected:",
          rejectedApplicationError
        );
        throw rejectedApplicationError;
      }

      return rejectedApplication;
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

    //get the full user data for each application
    const applicationsWithUserData = await Promise.all(
      applications.map(async (application) => {
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_clerk_id", application.user_id)
          .single();

        if (error) {
          console.error("Error fetching user data for application:", error);
          throw error;
        }

        return { ...application, user };
      })
    );

    return applicationsWithUserData;
  } catch (error) {
    console.error("Error fetching applications by project ID:", error);
    throw error;
  }
}
