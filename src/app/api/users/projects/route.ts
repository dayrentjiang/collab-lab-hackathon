import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// GET: Fetch user's projects
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProjects = await supabase
      .from('user_projects')
      .select('*, project:projects(*)')
      .eq('user_id', userId);

    return NextResponse.json(userProjects.data);
  } catch (error) {
    console.error("[USER_PROJECTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: Join a project
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { projectId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!projectId) {
      return new NextResponse("Project ID is required", { status: 400 });
    }

    // Check if user is already in the project
    const existingUserProject = await supabase
      .from('user_projects')
      .select()
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single();

    if (existingUserProject) {
      return new NextResponse("User is already in this project", { status: 400 });
    }

    const userProject = await supabase
      .from('user_projects')
      .insert([
        { user_id: userId, project_id: projectId }
      ])
      .select()
      .single();

    return NextResponse.json(userProject);
  } catch (error) {
    console.error("[USER_PROJECTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 