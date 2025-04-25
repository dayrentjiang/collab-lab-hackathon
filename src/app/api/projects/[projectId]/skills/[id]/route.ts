import { NextResponse } from "next/server";
import { updateProjectSkill, deleteProjectSkill } from "@/actions/project-skills";
import { UpdateProjectSkillInput } from "@/types/types";

export async function PUT(
  request: Request,
  { params }: { params: { projectId: string; id: string } }
) {
  try {
    const body = await request.json();
    const input: UpdateProjectSkillInput = {
      skill_id: body.skill_id,
    };
    const projectSkill = await updateProjectSkill(params.id, input);
    return NextResponse.json(projectSkill);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string; id: string } }
) {
  try {
    await deleteProjectSkill(params.id);
    return NextResponse.json({ message: "Project skill deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project skill" },
      { status: 500 }
    );
  }
} 