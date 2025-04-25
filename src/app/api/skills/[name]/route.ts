//search skills by name

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET(req: Request, { params }: { params: { name: string } }) {
    try {
        const { name } = params;
        const { data: skills, error } = await supabase
            .from('skills')
            .select('skill_id, skill_name')
            .ilike('skill_name', `%${name}%`)

        if (error) throw error;
        return NextResponse.json(skills);
            
    } catch (error) {
        console.error("[SKILLS_SEARCH]", error);
        return NextResponse.json(
            { error: "Failed to search skills" },
            { status: 500 }
        );
    }
}
