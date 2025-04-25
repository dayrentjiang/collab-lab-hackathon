import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const { data: projects, error } = await supabase.from("projects").select(`
        *,
        project_creator:users(*)
      `);

    if (error) throw error;
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      project_title,
      project_description,
      project_creator_id,
      project_status,
      project_vacancy,
      project_timeline
    } = body;

    const { data: project, error } = await supabase
      .from("projects")
      .insert([
        {
          project_title,
          project_description,
          project_creator_id,
          project_status,
          project_vacancy,
          project_timeline
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
