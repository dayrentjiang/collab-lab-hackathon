
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const skillSchema = z.object({
  skill_name: z.string().min(1),
  skill_category: z.string().min(1),
});

// GET /api/skills/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: skill, error } = await supabase
      .from('skills')
      .select()
      .eq('skill_id', parseInt(params.id))
      .single();

    if (error || !skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
      { status: 500 }
    );
  }
}

// PUT /api/skills/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validatedData = skillSchema.parse(body);

    const { data: updated, error } = await supabase
      .from('skills')
      .update(validatedData)
      .eq('skill_id', parseInt(params.id))
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid skill data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating skill:', error);
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE /api/skills/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('skill_id', parseInt(params.id));

    if (error) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Skill deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
} 