// types.ts

// Base types that correspond directly to database tables
export type User = {
  userId: string;
  email: string;
  password?: string; // Optional, usually not returned from database
  name: string;
  bio?: string;
  role: "students" | "admins" | "mentors";
  linkedinLink?: string;
  university?: string;
  createdAt: string;
  updatedAt: string;
};

export type Skill = {
  skillId: string;
  name: string;
  category: string;
};

export type Project = {
  projectId: string;
  title: string;
  description: string;
  creatorId: string; // Foreign key to User.userId
  status: "recruiting" | "in_progress" | "completed";
  vacancy: number;
  timeline?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserSkill = {
  userSkillId: string;
  userId: string; // Foreign key to User.userId
  skillId: string; // Foreign key to Skill.skillId
};

export type ProjectSkill = {
  projectSkillId: string;
  projectId: string; // Foreign key to Project.projectId
  skillId: string; // Foreign key to Skill.skillId
};

export type UserProject = {
  userProjectId: string;
  userId: string; // Foreign key to User.userId
  projectId: string; // Foreign key to Project.projectId
  role: "creator" | "member";
  joinedAt: string;
};

export type Application = {
  applicationId: string;
  projectId: string; // Foreign key to Project.projectId
  userId: string; // Foreign key to User.userId
  message: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
};

export type Message = {
  messageId: string;
  senderId: string; // Foreign key to User.userId
  receiverId?: string; // Foreign key to User.userId (for direct messages)
  projectId?: string; // Foreign key to Project.projectId (for project messages)
  content: string;
  sentAt: string;
  isRead: boolean;
};

// Extended types that include related data (for API responses)
export type UserWithRelations = User & {
  skills?: Skill[];
  projects?: Project[];
};

export type ProjectWithRelations = Project & {
  creator?: User;
  requiredSkills?: Skill[];
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
