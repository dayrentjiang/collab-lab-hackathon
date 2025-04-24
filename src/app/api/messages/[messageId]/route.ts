import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/messages/[messageId] - Get a specific message
export async function GET(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .select(`
        *,
        user:users(*),
        room:rooms(*)
      `)
      .eq('id', params.messageId)
      .single();

    if (error) throw error;
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

// PATCH /api/messages/[messageId] - Update a message
export async function PATCH(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const { data: message, error } = await supabase
      .from('messages')
      .update({ content })
      .eq('id', params.messageId)
      .select(`
        *,
        user:users(*),
        room:rooms(*)
      `)
      .single();

    if (error) throw error;
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/[messageId] - Delete a message
export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', params.messageId);

    if (error) throw error;
    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
} 