import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/applications/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('application_id', params.id)
      .single();

    if (error || !application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// PUT /api/applications/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { application_msg } = body;

    if (!application_msg) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: result, error } = await supabase
      .from('applications')
      .update({ application_msg })
      .eq('application_id', params.id)
      .select()
      .single();

    if (error || !result) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

// DELETE /api/applications/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('application_id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
} 