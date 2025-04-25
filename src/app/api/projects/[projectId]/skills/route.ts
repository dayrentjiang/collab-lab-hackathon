import { NextResponse } from "next/server";
import { getProjectSkills, createProjectSkill } from "@/actions/project-skills";
import { CreateProjectSkillInput } from "@/types/types";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = await Promise.resolve(params.projectId);
    const projectSkills = await getProjectSkills(projectId);
    return NextResponse.json(projectSkills);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project skills" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = await Promise.resolve(params.projectId);
    const body = await request.json();
    const input: CreateProjectSkillInput = {
      project_id: Number(projectId),
      skill_id: Number(body.skill_id),
    };
    const projectSkill = await createProjectSkill(input);
    return NextResponse.json(projectSkill);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project skill" },
      { status: 500 }
    );
  }
} 