import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hash } from "bcrypt";

// GET /api/users - Get all users
export async function GET() {
  console.log("Fetching all users...");
  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      throw error;
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      user_email,
      user_password,
      user_name,
      user_bio,
      user_linkedin_link,
      user_university
    } = body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_email", user_email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(user_password, 10);

    // Insert new user
    const { data: result, error } = await supabase
      .from("users")
      .insert({
        user_email,
        user_password: hashedPassword,
        user_name,
        user_bio,
        user_linkedin_link,
        user_university,
        user_role: "user"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
