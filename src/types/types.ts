// types.ts

// Base types that correspond directly to database tables
export type User = {
  user_id: number;
  user_clerk_id: string;
  user_email: string;
  user_password?: string; // Optional, usually not returned from database
  user_name: string;
  user_bio?: string;
  user_role: "student" | "admin" | "mentor";
  user_linkedin_link?: string;
  user_university?: string;
  has_completed_personalized: boolean;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  skill_id: number;
  skill_name: string;
  skill_category: string;
};

export type Project = {
  project_id: number;
  project_title: string;
  project_description: string;
  project_creator_id: number; // Foreign key to User.user_id
  project_status: "recruiting" | "in_progress" | "completed";
  project_vacancy: number;
  project_timeline?: string;
  created_at: string;
  updated_at: string;
};

export type UserSkill = {
  user_id: string; // Foreign key to User.user_id
  skill_id: number; // Foreign key to Skill.skill_id
};

export type ProjectSkill = {
  project_id: number; // Foreign key to Project.project_id
  skill_id: number; // Foreign key to Skill.skill_id
};

export type CreateProjectSkillInput = {
  project_id: number;
  skill_id: number;
};

export type UpdateProjectSkillInput = {
  skill_id?: number;
};

export type UserProject = {
  user_project_id: string;
  user_id: string; // Foreign key to User.user_id
  project_id: number; // Foreign key to Project.project_id
  user_role: "creator" | "member"; // Role in the project
  joined_at: string;
};

export type Application = {
  application_id: number;
  project_id: number; // Foreign key to Project.project_id
  user_id: string; // Foreign key to User.user_id
  application_msg: string;
  application_status: "pending" | "accepted" | "rejected";
  applied_at: string;
};

export type Message = {
  msg_id: number;
  msg_sender_id: string; // Foreign key to User.user_id
  msg_receiver_id: string; // Foreign key to User.user_id
  project_id?: number; // Foreign key to Project.project_id (optional for direct messages)
  msg_content: string;
  sent_at: string;
  is_read: boolean;
};

// Extended types that include related data (for API responses)
export type UserWithRelations = User & {
  skills?: Skill[];
  projects?: Project[];
  user_projects?: UserProject[];
};

export type ProjectWithRelations = Project & {
  creator?: User;
  required_skills?: Skill[];
  members?: User[];
  user_projects?: UserProject[];
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
