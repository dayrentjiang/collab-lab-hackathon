import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hash } from 'bcrypt';

// GET /api/users/[userId] - Get a specific user
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { data: user, error } = await supabase
      .from('users')
      .select('user_id, user_email, user_name, user_bio, user_role, user_linkedin_link, user_university, user_clerk_id, created_at, updated_at')
      .eq('user_id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PATCH /api/users/[userId] - Update a user
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await req.json();
    const { user_email, user_password, user_name, user_bio, user_linkedin_link, user_university, user_clerk_id, user_role } = body;

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (user_email) {
      updates.push(`user_email = $${paramCount}`);
      values.push(user_email);
      paramCount++;
    }
    if (user_password) {
      const hashedPassword = await hash(user_password, 10);
      updates.push(`user_password = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }
    if (user_name) {
      updates.push(`user_name = $${paramCount}`);
      values.push(user_name);
      paramCount++;
    }
    if (user_bio) {
      updates.push(`user_bio = $${paramCount}`);
      values.push(user_bio);
      paramCount++;
    }
    if (user_linkedin_link) {
      updates.push(`user_linkedin_link = $${paramCount}`);
      values.push(user_linkedin_link);
      paramCount++;
    }
    if (user_university) {
      updates.push(`user_university = $${paramCount}`);
      values.push(user_university);
      paramCount++;
    }
    if (user_clerk_id) {
      updates.push(`user_clerk_id = $${paramCount}`);
      values.push(user_clerk_id);
      paramCount++;
    }
    if (user_role) {
      updates.push(`user_role = $${paramCount}`);
      values.push(user_role);
      paramCount++;
    }

    updates.push(`updated_at = NOW()`);

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(userId);
    const { data: result, error } = await supabase
      .from('users')
      .update({
        ...(user_email && { user_email }),
        ...(user_password && { user_password: await hash(user_password, 10) }),
        ...(user_name && { user_name }),
        ...(user_bio && { user_bio }),
        ...(user_linkedin_link && { user_linkedin_link }),
        ...(user_university && { user_university }),
        ...(user_clerk_id && { user_clerk_id }),
        ...(user_role && { user_role }),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users/[userId] - Delete a user
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
} 