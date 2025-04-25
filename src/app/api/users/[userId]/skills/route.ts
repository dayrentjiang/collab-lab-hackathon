import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET: Fetch all skills for a specific user
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = await auth();
    
    // if (!currentUserId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const { data: userSkills, error } = await supabase
      .from('user_skills')
      .select('*, skills(*)')
      .eq('user_id', params.userId);

    if (error) throw error;
    return NextResponse.json(userSkills);
  } catch (error) {
    console.error("[USER_SKILLS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 

// POST: Add a new skill to a user
export async function POST(req: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId: currentUserId } = await auth();
        const { skillId } = await req.json();
        
        // if (!currentUserId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        if (!skillId) {
            return new NextResponse("Skill ID is required", { status: 400 });
        }

        //add the skill to user skill {user_id, skill_id}
        const { data: userSkill, error } = await supabase
            .from('user_skills')
            .insert([{ user_id: currentUserId, skill_id: skillId }])
            .select()
            .single();
            
        if (error) throw error;
        return NextResponse.json(userSkill);
    } catch (error) {
        console.error("[USER_SKILLS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
