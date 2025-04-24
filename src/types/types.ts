// types.ts

// Base types that correspond directly to database tables
export type User = {
  user_id: string;
  email: string;
  password?: string; // Optional, usually not returned from database
  name: string;
  bio?: string;
  role: "students" | "admins" | "mentors";
  linkedin_link?: string;
  university?: string;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  skill_id: string;
  name: string;
  category: string;
};

export type Project = {
  project_id: string;
  title: string;
  description: string;
  creator_id: string; // Foreign key to User.user_id
  status: "recruiting" | "in_progress" | "completed";
  vacancy: number;
  timeline?: string;
  created_at: string;
  updated_at: string;
};

export type UserSkill = {
  user_skill_id: string;
  user_id: string; // Foreign key to User.user_id
  skill_id: string; // Foreign key to Skill.skill_id
};

export type ProjectSkill = {
  project_skill_id: string;
  project_id: string; // Foreign key to Project.project_id
  skill_id: string; // Foreign key to Skill.skill_id
};

export type UserProject = {
  user_project_id: string;
  user_id: string; // Foreign key to User.user_id
  project_id: string; // Foreign key to Project.project_id
  role: "creator" | "member";
  joined_at: string;
};

export type Application = {
  application_id: string;
  project_id: string; // Foreign key to Project.project_id
  user_id: string; // Foreign key to User.user_id
  message: string;
  status: "pending" | "accepted" | "rejected";
  applied_at: string;
};

export type Message = {
  message_id: string;
  sender_id: string; // Foreign key to User.user_id
  receiver_id?: string; // Foreign key to User.user_id (for direct messages)
  project_id?: string; // Foreign key to Project.project_id (for project messages)
  content: string;
  sent_at: string;
  is_read: boolean;
};

// Extended types that include related data (for API responses)
export type UserWithRelations = User & {
  skills?: Skill[];
  projects?: Project[];
};

export type ProjectWithRelations = Project & {
  creator?: User;
  required_skills?: Skill[];
  members?: User[];
  applications?: Application[];
};

export type ApplicationWithRelations = Application & {
  user?: User;
  project?: Project;
};

export type MessageWithRelations = Message & {
  sender?: User;
  receiver?: User;
  project?: Project;
};
