import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET: Fetch all skills for a specific user
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: userSkills, error } = await supabase
      .from('user_skills')
      .select('*, skills(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return NextResponse.json(userSkills);
  } catch (error) {
    console.error("[USER_SKILLS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: Add a new skill to user
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { skillId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!skillId) {
      return new NextResponse("Skill ID is required", { status: 400 });
    }

    // Check if the skill already exists
    const { data: existingSkill } = await supabase
      .from('user_skills')
      .select()
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .single();

    if (existingSkill) {
      return new NextResponse("Skill already exists for user", { status: 400 });
    }

    const { data: userSkill, error } = await supabase
      .from('user_skills')
      .insert([{ user_id: userId, skill_id: skillId }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(userSkill);
  } catch (error) {
    console.error("[USER_SKILLS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: Remove a skill from user
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    const { skillId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!skillId) {
      return new NextResponse("Skill ID is required", { status: 400 });
    }

    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', userId)
      .eq('skill_id', skillId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER_SKILLS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 