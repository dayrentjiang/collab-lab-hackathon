import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/applications
export async function GET() {
  try {
    const { data: applications, error } = await supabase
      .from('applications')
      .select('*');

    if (error) {
      throw error;
    }

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST /api/applications
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project_id, user_id, application_msg } = body;

    // Validate required fields
    if (!project_id || !user_id || !application_msg) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: result, error } = await supabase
      .from('applications')
      .insert({ project_id, user_id, application_msg })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
} 