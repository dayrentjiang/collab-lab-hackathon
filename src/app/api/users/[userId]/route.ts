import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hash } from 'bcrypt';

// GET /api/users/[userId] - Get a specific user
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const user = await db.query(
      'SELECT user_id, user_email, user_name, user_bio, user_role, user_linkedin_link, user_university, created_at, updated_at FROM users WHERE user_id = $1',
      [userId]
    );

    if (user.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.rows[0]);
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
    const { user_email, user_password, user_name, user_bio, user_linkedin_link, user_university } = body;

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

    updates.push(`updated_at = NOW()`);

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(userId);
    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING user_id, user_email, user_name, user_bio, user_role, user_linkedin_link, user_university, created_at, updated_at
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
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
    const result = await db.query('DELETE FROM users WHERE user_id = $1 RETURNING user_id', [userId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
} 