import {
  User,
  Skill,
  Project,
  UserSkill,
  ProjectSkill,
  UserProject,
  Application,
  Message,
  UserWithRelations,
  ProjectWithRelations,
  ApplicationWithRelations,
  MessageWithRelations
} from "./types";

// Mock Skills
export const MOCK_SKILLS: Skill[] = [
  {
    skill_id: 1,
    skill_name: "React",
    skill_category: "frontend"
  },
  {
    skill_id: 2,
    skill_name: "TypeScript",
    skill_category: "frontend"
  },
  {
    skill_id: 3,
    skill_name: "Next.js",
    skill_category: "frontend"
  },
  {
    skill_id: 4,
    skill_name: "CSS/Tailwind",
    skill_category: "frontend"
  },
  {
    skill_id: 5,
    skill_name: "Node.js",
    skill_category: "backend"
  },
  {
    skill_id: 6,
    skill_name: "Express",
    skill_category: "backend"
  },
  {
    skill_id: 7,
    skill_name: "PostgreSQL",
    skill_category: "backend"
  },
  {
    skill_id: 8,
    skill_name: "MongoDB",
    skill_category: "backend"
  },
  {
    skill_id: 9,
    skill_name: "Firebase",
    skill_category: "backend"
  },
  {
    skill_id: 10,
    skill_name: "Figma",
    skill_category: "design"
  },
  {
    skill_id: 11,
    skill_name: "UI/UX Design",
    skill_category: "design"
  },
  {
    skill_id: 12,
    skill_name: "Adobe XD",
    skill_category: "design"
  },
  {
    skill_id: 13,
    skill_name: "Project Management",
    skill_category: "other"
  },
  {
    skill_id: 14,
    skill_name: "Git",
    skill_category: "other"
  },
  {
    skill_id: 15,
    skill_name: "Agile/Scrum",
    skill_category: "other"
  }
];

// Mock Users
export const MOCK_USERS: User[] = [
  {
    user_id: 1,
    user_clerk_id: "clerk_123",
    user_email: "alex@university.edu",
    user_password: "hashed_password",
    user_name: "Alex Rodriguez",
    user_bio:
      "Frontend developer passionate about creating beautiful and responsive web applications. Looking to collaborate on innovative projects.",
    user_role: "student",
    user_linkedin_link: "https://linkedin.com/in/alexr",
    user_university: "Stanford University",
    has_completed_personalized: false,
    created_at: "2023-01-15T08:00:00Z",
    updated_at: "2023-03-20T14:30:00Z"
  },
  {
    user_id: 2,
    user_clerk_id: "clerk_456",
    user_email: "taylor@university.edu",
    user_name: "Taylor Kim",
    user_bio:
      "Backend developer with experience in building RESTful APIs and database management.",
    user_role: "student",
    user_university: "MIT",
    has_completed_personalized: false,
    created_at: "2023-02-10T10:30:00Z",
    updated_at: "2023-02-10T10:30:00Z"
  },
  {
    user_id: 3,
    user_clerk_id: "clerk_789",
    user_email: "jordan@university.edu",
    user_name: "Jordan Smith",
    user_bio:
      "UI/UX designer focused on creating intuitive and accessible user experiences.",
    user_role: "student",
    user_linkedin_link: "https://linkedin.com/in/jordans",
    user_university: "UCLA",
    has_completed_personalized: false,
    created_at: "2023-01-22T15:45:00Z",
    updated_at: "2023-03-15T11:20:00Z"
  },
  {
    user_id: 4,
    user_clerk_id: "clerk_101112",
    user_email: "prof.chen@university.edu",
    user_name: "Dr. Morgan Chen",
    user_bio:
      "Computer Science Professor specializing in AI and machine learning. Mentoring students on innovative projects.",
    user_role: "mentor",
    user_linkedin_link: "https://linkedin.com/in/dr-chen",
    user_university: "Stanford University",
    has_completed_personalized: false,
    created_at: "2022-11-05T09:15:00Z",
    updated_at: "2023-04-01T16:30:00Z"
  },
  {
    user_id: 5,
    user_clerk_id: "clerk_131415",
    user_email: "jamie@university.edu",
    user_name: "Jamie Wilson",
    user_bio:
      "Full-stack developer interested in educational technology and accessibility.",
    user_role: "student",
    user_university: "UC Berkeley",
    has_completed_personalized: false,
    created_at: "2023-01-30T13:20:00Z",
    updated_at: "2023-03-25T09:45:00Z"
  },
  {
    user_id: 6,
    user_clerk_id: "clerk_161718",
    user_email: "admin@collablab.edu",
    user_name: "System Administrator",
    user_role: "admin",
    has_completed_personalized: false,
    created_at: "2022-10-01T00:00:00Z",
    updated_at: "2022-10-01T00:00:00Z"
  }
];

// User Skills (junction table)
export const MOCK_USER_SKILLS: UserSkill[] = [
  { user_id: "1", skill_id: 1 }, // Alex - React
  { user_id: "1", skill_id: 2 }, // Alex - TypeScript
  { user_id: "1", skill_id: 3 }, // Alex - Next.js
  { user_id: "1", skill_id: 14 }, // Alex - Git

  { user_id: "2", skill_id: 5 }, // Taylor - Node.js
  { user_id: "2", skill_id: 6 }, // Taylor - Express
  { user_id: "2", skill_id: 8 }, // Taylor - MongoDB
  { user_id: "2", skill_id: 14 }, // Taylor - Git

  { user_id: "3", skill_id: 10 }, // Jordan - Figma
  { user_id: "3", skill_id: 11 }, // Jordan - UI/UX Design
  { user_id: "3", skill_id: 12 }, // Jordan - Adobe XD

  { user_id: "4", skill_id: 13 }, // Dr. Chen - Project Management
  { user_id: "4", skill_id: 15 }, // Dr. Chen - Agile/Scrum

  { user_id: "5", skill_id: 1 }, // Jamie - React
  { user_id: "5", skill_id: 3 }, // Jamie - Next.js
  { user_id: "5", skill_id: 5 }, // Jamie - Node.js
  { user_id: "5", skill_id: 7 } // Jamie - PostgreSQL
];

// Mock Projects
export const MOCK_PROJECTS: Project[] = [
  {
    project_id: 1,
    project_title: "Student Portal Redesign",
    project_description:
      "Redesign the university student portal with a modern UI and improved user experience. Focus on mobile responsiveness and accessibility features.",
    project_creator_id: 1, // Alex
    project_status: "recruiting",
    project_vacancy: 2,
    project_timeline: "4-6 weeks",
    created_at: "2023-04-10T11:30:00Z",
    updated_at: "2023-04-10T11:30:00Z"
  },
  {
    project_id: 2,
    project_title: "Campus Event Finder App",
    project_description:
      "Develop a mobile app that helps students discover and RSVP to campus events. Implementation will include personalized recommendations based on interests.",
    project_creator_id: 2, // Taylor
    project_status: "in_progress",
    project_vacancy: 1,
    project_timeline: "2-3 months",
    created_at: "2023-03-15T09:45:00Z",
    updated_at: "2023-04-20T14:30:00Z"
  },
  {
    project_id: 3,
    project_title: "Academic Research Database",
    project_description:
      "Create a searchable database of academic research papers with filtering options and citation tools for students and researchers.",
    project_creator_id: 4, // Dr. Chen
    project_status: "recruiting",
    project_vacancy: 3,
    project_timeline: "3-4 months",
    created_at: "2023-04-18T16:20:00Z",
    updated_at: "2023-04-18T16:20:00Z"
  },
  {
    project_id: 4,
    project_title: "Student Budget Tracker",
    project_description:
      "Build a financial tool to help students track expenses, set savings goals, and get insights on spending habits with data visualization.",
    project_creator_id: 3, // Jordan
    project_status: "recruiting",
    project_vacancy: 2,
    project_timeline: "6-8 weeks",
    created_at: "2023-04-22T10:15:00Z",
    updated_at: "2023-04-22T10:15:00Z"
  },
  {
    project_id: 5,
    project_title: "Campus Navigation AR App",
    project_description:
      "Develop an augmented reality app to help new students navigate campus buildings and find classrooms, offices, and facilities.",
    project_creator_id: 5, // Jamie
    project_status: "recruiting",
    project_vacancy: 3,
    project_timeline: "4-5 months",
    created_at: "2023-04-25T08:30:00Z",
    updated_at: "2023-04-25T08:30:00Z"
  },
  {
    project_id: 6,
    project_title: "Study Group Finder",
    project_description:
      "Create a platform that helps students find and create study groups for specific courses, with scheduling and resource sharing features.",
    project_creator_id: 2, // Taylor
    project_status: "completed",
    project_vacancy: 0,
    project_timeline: "Completed in 2 months",
    created_at: "2023-02-05T08:30:00Z",
    updated_at: "2023-04-10T15:45:00Z"
  }
];

// Project Skills (junction table)
export const MOCK_PROJECT_SKILLS: ProjectSkill[] = [
  { project_id: 1, skill_id: 1 }, // Portal Redesign - React
  { project_id: 1, skill_id: 2 }, // Portal Redesign - TypeScript
  { project_id: 1, skill_id: 10 }, // Portal Redesign - Figma
  { project_id: 1, skill_id: 11 }, // Portal Redesign - UI/UX Design

  { project_id: 2, skill_id: 1 }, // Event Finder - React
  { project_id: 2, skill_id: 3 }, // Event Finder - Next.js
  { project_id: 2, skill_id: 5 }, // Event Finder - Node.js
  { project_id: 2, skill_id: 9 }, // Event Finder - Firebase

  { project_id: 3, skill_id: 5 }, // Research DB - Node.js
  { project_id: 3, skill_id: 6 }, // Research DB - Express
  { project_id: 3, skill_id: 7 }, // Research DB - PostgreSQL

  { project_id: 4, skill_id: 1 }, // Budget Tracker - React
  { project_id: 4, skill_id: 3 }, // Budget Tracker - Next.js
  { project_id: 4, skill_id: 8 }, // Budget Tracker - MongoDB

  { project_id: 5, skill_id: 1 }, // Navigation AR - React
  { project_id: 5, skill_id: 5 }, // Navigation AR - Node.js
  { project_id: 5, skill_id: 11 }, // Navigation AR - UI/UX Design

  { project_id: 6, skill_id: 1 }, // Study Group Finder - React
  { project_id: 6, skill_id: 5 }, // Study Group Finder - Node.js
  { project_id: 6, skill_id: 10 } // Study Group Finder - Figma
];

// User Projects (junction table with role)
export const MOCK_USER_PROJECTS: UserProject[] = [
  {
    user_project_id: "1",
    user_id: "1",
    project_id: 1,
    user_role: "creator",
    joined_at: "2023-04-10T11:30:00Z"
  },
  {
    user_project_id: "2",
    user_id: "2",
    project_id: 2,
    user_role: "creator",
    joined_at: "2023-03-15T09:45:00Z"
  },
  {
    user_project_id: "3",
    user_id: "1",
    project_id: 2,
    user_role: "member",
    joined_at: "2023-03-20T14:30:00Z"
  },
  {
    user_project_id: "4",
    user_id: "4",
    project_id: 3,
    user_role: "creator",
    joined_at: "2023-04-18T16:20:00Z"
  },
  {
    user_project_id: "5",
    user_id: "3",
    project_id: 4,
    user_role: "creator",
    joined_at: "2023-04-22T10:15:00Z"
  },
  {
    user_project_id: "6",
    user_id: "5",
    project_id: 5,
    user_role: "creator",
    joined_at: "2023-04-25T08:30:00Z"
  },
  {
    user_project_id: "7",
    user_id: "2",
    project_id: 6,
    user_role: "creator",
    joined_at: "2023-02-05T08:30:00Z"
  },
  {
    user_project_id: "8",
    user_id: "1",
    project_id: 6,
    user_role: "member",
    joined_at: "2023-02-10T09:15:00Z"
  },
  {
    user_project_id: "9",
    user_id: "3",
    project_id: 6,
    user_role: "member",
    joined_at: "2023-02-12T11:45:00Z"
  }
];

// Mock Applications
export const MOCK_APPLICATIONS: Application[] = [
  {
    application_id: 1,
    project_id: 1,
    user_id: "3",
    application_msg:
      "I'm very interested in this project as I have extensive experience in UI/UX design. I've worked on similar portal redesigns and would love to contribute my skills to improve the student experience.",
    application_status: "pending",
    applied_at: "2023-04-12T09:20:00Z"
  },
  {
    application_id: 2,
    project_id: 1,
    user_id: "5",
    application_msg:
      "I'd like to join this project to contribute my frontend development skills. I've worked with React and Next.js extensively and am passionate about creating accessible interfaces.",
    application_status: "accepted",
    applied_at: "2023-04-11T14:45:00Z"
  },
  {
    application_id: 3,
    project_id: 3,
    user_id: "2",
    application_msg:
      "I have experience building database systems and would love to contribute to this research database project. My backend skills would be a great fit for this team.",
    application_status: "pending",
    applied_at: "2023-04-19T11:30:00Z"
  },
  {
    application_id: 4,
    project_id: 4,
    user_id: "1",
    application_msg:
      "As someone who struggles with budgeting, I'm excited about this project! I can contribute my React and Next.js skills to build a great frontend for this tool.",
    application_status: "rejected",
    applied_at: "2023-04-23T16:10:00Z"
  },
  {
    application_id: 5,
    project_id: 5,
    user_id: "3",
    application_msg:
      "I'd love to help design the user interface for this AR app. I have some experience with AR design principles and can ensure the app is intuitive and visually appealing.",
    application_status: "pending",
    applied_at: "2023-04-26T10:05:00Z"
  }
];

// Mock Messages
export const MOCK_MESSAGES: Message[] = [
  {
    msg_id: 1,
    msg_sender_id: "1",
    msg_receiver_id: "3",
    msg_content:
      "Hi Jordan, I saw your application for the Student Portal Redesign. Would you be available for a quick chat this week to discuss your design ideas?",
    sent_at: "2023-04-13T15:30:00Z",
    is_read: true
  },
  {
    msg_id: 2,
    msg_sender_id: "3",
    msg_receiver_id: "1",
    msg_content:
      "Hi Alex, I'd be happy to chat! How about Thursday at 3pm? I can share some of my initial thoughts for the redesign.",
    sent_at: "2023-04-13T16:45:00Z",
    is_read: true
  },
  {
    msg_id: 3,
    msg_sender_id: "4",
    msg_receiver_id: "4", // Self (project message)
    project_id: 3,
    msg_content:
      "Welcome to the Academic Research Database project! I've created a shared document with the project requirements and initial database schema. Let's schedule our first team meeting next week.",
    sent_at: "2023-04-20T09:15:00Z",
    is_read: false
  },
  {
    msg_id: 4,
    msg_sender_id: "2",
    msg_receiver_id: "1",
    msg_content:
      "Hey Alex, how's your part of the Campus Event Finder coming along? Let me know if you need any help with the API integration.",
    sent_at: "2023-04-22T14:20:00Z",
    is_read: false
  },
  {
    msg_id: 5,
    msg_sender_id: "5",
    msg_receiver_id: "5", // Self (project message)
    project_id: 5,
    msg_content:
      "I've pushed the initial project setup to our GitHub repo. Everyone please clone it and make sure you can run it locally. Let me know if you encounter any issues.",
    sent_at: "2023-04-26T11:30:00Z",
    is_read: true
  }
];

// Get user with related data
export async function getUserWithRelations(
  userId: number
): Promise<UserWithRelations | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const user = MOCK_USERS.find((u) => u.user_id === userId);
  if (!user) return null;

  // Get user skills
  const userSkillIds = MOCK_USER_SKILLS.filter(
    (us) => us.user_id === userId.toString()
  ).map((us) => us.skill_id);

  const skills = MOCK_SKILLS.filter((skill) =>
    userSkillIds.includes(skill.skill_id)
  );

  // Get user projects
  const userProjects = MOCK_USER_PROJECTS.filter(
    (up) => up.user_id === userId.toString()
  );

  const projectIds = userProjects.map((up) => up.project_id);
  const projects = MOCK_PROJECTS.filter((project) =>
    projectIds.includes(project.project_id)
  );

  return {
    ...user,
    skills,
    projects,
    user_projects: userProjects
  };
}

// Get project with related data
export async function getProjectWithRelations(
  projectId: number
): Promise<ProjectWithRelations | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const project = MOCK_PROJECTS.find((p) => p.project_id === projectId);
  if (!project) return null;

  // Get creator
  const creator = MOCK_USERS.find(
    (u) => u.user_id === project.project_creator_id
  );

  // Get required skills
  const projectSkillIds = MOCK_PROJECT_SKILLS.filter(
    (ps) => ps.project_id === projectId
  ).map((ps) => ps.skill_id);

  const required_skills = MOCK_SKILLS.filter((skill) =>
    projectSkillIds.includes(skill.skill_id)
  );

  // Get members
  const userProjects = MOCK_USER_PROJECTS.filter(
    (up) => up.project_id === projectId
  );
  const memberIds = userProjects.map((up) => up.user_id);
  const members = MOCK_USERS.filter((user) =>
    memberIds.includes(user.user_id.toString())
  );

  // Get applications
  const applications = MOCK_APPLICATIONS.filter(
    (app) => app.project_id === projectId
  );

  return {
    ...project,
    creator: creator!,
    required_skills,
    members,
    user_projects: userProjects,
    applications
  };
}

// Get application with related data
export async function getApplicationWithRelations(
  applicationId: number
): Promise<ApplicationWithRelations | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const application = MOCK_APPLICATIONS.find(
    (a) => a.application_id === applicationId
  );
  if (!application) return null;

  const user = MOCK_USERS.find(
    (u) => u.user_id.toString() === application.user_id
  );
  const project = MOCK_PROJECTS.find(
    (p) => p.project_id === application.project_id
  );

  return {
    ...application,
    user: user!,
    project: project!
  };
}

// Get message with related data
export async function getMessageWithRelations(
  messageId: number
): Promise<MessageWithRelations | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  const message = MOCK_MESSAGES.find((m) => m.msg_id === messageId);
  if (!message) return null;

  const sender = MOCK_USERS.find(
    (u) => u.user_id.toString() === message.msg_sender_id
  );
  const receiver = message.msg_receiver_id
    ? MOCK_USERS.find((u) => u.user_id.toString() === message.msg_receiver_id)
    : undefined;

  const project = message.project_id
    ? MOCK_PROJECTS.find((p) => p.project_id === message.project_id)
    : undefined;

  return {
    ...message,
    sender: sender!,
    receiver,
    project
  };
}

// Helper Functions for listing data
// Get recommended projects with optional category filter
export async function getRecommendedProjects(
  category?: string
): Promise<ProjectWithRelations[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // First get projects with skills
  const projectRelations = await Promise.all(
    MOCK_PROJECTS.map(async (project) => {
      return await getProjectWithRelations(project.project_id);
    })
  );

  // Filter null values and explicitly type as non-null array
  const nonNullProjects: ProjectWithRelations[] = projectRelations.filter(
    (project): project is ProjectWithRelations => project !== null
  );

  // Apply category filter if provided
  let filteredProjects = nonNullProjects;
  if (category) {
    filteredProjects = nonNullProjects.filter((project) =>
      project.required_skills?.some(
        (skill) => skill.skill_category === category
      )
    );
  }

  // Sort by most recent first and show recruiting projects first
  return filteredProjects
    .sort((a, b) => {
      // Status priority: recruiting > in_progress > completed
      if (a.project_status !== b.project_status) {
        if (a.project_status === "recruiting") return -1;
        if (b.project_status === "recruiting") return 1;
        if (a.project_status === "in_progress") return -1;
        if (b.project_status === "in_progress") return 1;
      }

      // Then sort by date (newest first)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    })
    .slice(0, 6); // Return top 6 recommended projects
}

export async function getAllProjects(params: {
  category?: string;
  status?: "recruiting" | "in_progress" | "completed";
  query?: string;
}): Promise<ProjectWithRelations[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // First get projects with skills
  const projectRelations = await Promise.all(
    MOCK_PROJECTS.map(async (project) => {
      return await getProjectWithRelations(project.project_id);
    })
  );

  // Filter null values and explicitly type as non-null array
  const nonNullProjects: ProjectWithRelations[] = projectRelations.filter(
    (project): project is ProjectWithRelations => project !== null
  );

  // Start with all non-null projects
  let filteredProjects = nonNullProjects;

  // Apply category filter
  if (params.category) {
    filteredProjects = filteredProjects.filter((project) =>
      project.required_skills?.some(
        (skill) => skill.skill_category === params.category
      )
    );
  }

  // Apply status filter
  if (params.status) {
    filteredProjects = filteredProjects.filter(
      (project) => project.project_status === params.status
    );
  }

  // Apply search query
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredProjects = filteredProjects.filter(
      (project) =>
        project.project_title.toLowerCase().includes(query) ||
        project.project_description.toLowerCase().includes(query)
    );
  }

  // Sort by most recent first
  return filteredProjects.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// Get user applications with project data
export async function getUserApplicationsWithRelations(userId: number) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const applications = MOCK_APPLICATIONS.filter(
    (app) => app.user_id === userId.toString()
  );

  return Promise.all(
    applications.map(async (application) => {
      return await getApplicationWithRelations(application.application_id);
    })
  );
}

// Get user messages with sender/receiver/project data
export async function getUserMessagesWithRelations(userId: number) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 250));

  const messages = MOCK_MESSAGES.filter(
    (msg) =>
      msg.msg_sender_id === userId.toString() ||
      msg.msg_receiver_id === userId.toString()
  );

  return Promise.all(
    messages.map(async (message) => {
      return await getMessageWithRelations(message.msg_id);
    })
  );
}
