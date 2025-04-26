/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/projects/[projectId] - Get a specific project
export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_creator:users(*)
      `
      )
      .eq("project_id", params.projectId)
      .single();

    if (error) throw error;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[projectId] - Update a project
export async function PATCH(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const {
      project_title,
      project_description,
      project_status,
      project_vacancy
    } = body;

    const { data: project, error } = await supabase
      .from("projects")
      .update({
        project_title,
        project_description,
        project_status,
        project_vacancy
      })
      .eq("project_id", params.projectId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[projectId] - Delete a project
export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("project_id", params.projectId);

    if (error) throw error;
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
