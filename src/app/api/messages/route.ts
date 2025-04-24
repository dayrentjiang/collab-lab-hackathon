import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/messages - Get all messages
export async function GET() {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*');

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    if (!messages) {
      return NextResponse.json(
        { error: 'No messages found' },
        { status: 404 }
      );
    }

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create a new message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, userId, roomId } = body;

    if (!content || !userId || !roomId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        content,
        user_id: userId,
        room_id: roomId
      })
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
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
} 