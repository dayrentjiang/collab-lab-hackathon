import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hash } from 'bcrypt';

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await db.query('SELECT user_id, user_email, user_name, user_bio, user_role, user_linkedin_link, user_university, created_at, updated_at FROM users');
    return NextResponse.json(users.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Create a new user
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_email, user_password, user_name, user_bio, user_linkedin_link, user_university } = body;

    // Check if user already exists
    const existingUser = await db.query('SELECT user_id FROM users WHERE user_email = $1', [user_email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(user_password, 10);

    // Insert new user
    const result = await db.query(
      `INSERT INTO users (user_email, user_password, user_name, user_bio, user_linkedin_link, user_university, user_role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'user', NOW(), NOW())
       RETURNING user_id, user_email, user_name, user_bio, user_role, user_linkedin_link, user_university, created_at, updated_at`,
      [user_email, hashedPassword, user_name, user_bio, user_linkedin_link, user_university]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
} 