import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Schema for skill validation
const skillSchema = z.object({
  skill_name: z.string().min(1),
  skill_category: z.string().min(1),
});

// GET /api/skills
export async function GET() {
  try {
    const { data: skills, error } = await supabase
      .from('skills')
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST /api/skills
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = skillSchema.parse(body);

    const { data: skill, error } = await supabase
      .from('skills')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid skill data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
} 