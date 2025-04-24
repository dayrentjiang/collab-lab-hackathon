// types.ts
export type User = {
  user_id: string;
  user_email: string;
  user_password?: string; // Optional field
  user_name: string;
  user_bio?: string;
  user_role: "students" | "admins" | "mentors"; // Enum for user roles
  user_linkedin_link?: string;
  user_university?: string;
  user_skills: Skill[]; // Array of Skill objects
  created_at: string;
  updated_at: string;
};

export type Skill = {
  skill_id: string;
  skill_name: string; // e.g., React, Next.js, etc.
  skill_category: "frontend" | "backend" | "design" | "other"; // Categories
};

export type Project = {
  project_id: string;
  project_title: string;
  project_description: string;
  project_creator_id: string; // Foreign key to user_id
  required_skills: Skill[]; // Array of required skills
  project_status: "recruiting" | "in_progress" | "completed"; // Project status
  project_vacancy: number; // How many members needed
  project_members: User[]; // Array of team members
  project_timeline?: string; // Optional timeline
  created_at: string;
  updated_at: string;
};

export type Application = {
  application_id: string;
  project_id: string; // Foreign key to project_id
  user_id: string; // Foreign key to user_id
  application_msg: string; // Motivation, self-introduction
  application_status: "pending" | "accepted" | "rejected"; // Application status
  applied_at: string; // Application timestamp
};

export type Message = {
  msg_id: string;
  msg_sender_id: string; // Foreign key to user_id
  msg_receiver_id?: string; // Foreign key to user_id (optional for project messages)
  project_id?: string; // Foreign key to project_id (optional for direct messages)
  msg_content: string;
  sent_at: string;
  is_read: boolean;
};
