import { User, Skill, Project, Application, Message } from './types';

// Mock Skills
export const MOCK_SKILLS: Skill[] = [
  { 
    skill_id: 's1', 
    skill_name: 'React', 
    skill_category: 'frontend' 
  },
  { 
    skill_id: 's2', 
    skill_name: 'TypeScript', 
    skill_category: 'frontend' 
  },
  { 
    skill_id: 's3', 
    skill_name: 'Next.js', 
    skill_category: 'frontend' 
  },
  { 
    skill_id: 's4', 
    skill_name: 'CSS/Tailwind', 
    skill_category: 'frontend' 
  },
  { 
    skill_id: 's5', 
    skill_name: 'Node.js', 
    skill_category: 'backend' 
  },
  { 
    skill_id: 's6', 
    skill_name: 'Express', 
    skill_category: 'backend' 
  },
  { 
    skill_id: 's7', 
    skill_name: 'MongoDB', 
    skill_category: 'backend' 
  },
  { 
    skill_id: 's8', 
    skill_name: 'PostgreSQL', 
    skill_category: 'backend' 
  },
  { 
    skill_id: 's9', 
    skill_name: 'Figma', 
    skill_category: 'design' 
  },
  { 
    skill_id: 's10', 
    skill_name: 'UI/UX Design', 
    skill_category: 'design' 
  },
  { 
    skill_id: 's11', 
    skill_name: 'Adobe XD', 
    skill_category: 'design' 
  },
  { 
    skill_id: 's12', 
    skill_name: 'Project Management', 
    skill_category: 'other' 
  },
  { 
    skill_id: 's13', 
    skill_name: 'Git', 
    skill_category: 'other' 
  },
  { 
    skill_id: 's14', 
    skill_name: 'Agile/Scrum', 
    skill_category: 'other' 
  }
];

// Mock Users
export const MOCK_USERS: User[] = [
  {
    user_id: 'u1',
    user_email: 'alex@university.edu',
    user_password: 'hashed_password',
    user_name: 'Alex Rodriguez',
    user_bio: 'Frontend developer passionate about creating beautiful and responsive web applications. Looking to collaborate on innovative projects.',
    user_role: 'students',
    user_linkedin_link: 'https://linkedin.com/in/alexr',
    user_university: 'Stanford University',
    user_skills: [MOCK_SKILLS[0], MOCK_SKILLS[1], MOCK_SKILLS[2], MOCK_SKILLS[12]],
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-03-20T14:30:00Z'
  },
  {
    user_id: 'u2',
    user_email: 'taylor@university.edu',
    user_name: 'Taylor Kim',
    user_bio: 'Backend developer with experience in building RESTful APIs and database management.',
    user_role: 'students',
    user_university: 'MIT',
    user_skills: [MOCK_SKILLS[4], MOCK_SKILLS[5], MOCK_SKILLS[6], MOCK_SKILLS[12]],
    created_at: '2023-02-10T10:30:00Z',
    updated_at: '2023-02-10T10:30:00Z'
  },
  {
    user_id: 'u3',
    user_email: 'jordan@university.edu',
    user_name: 'Jordan Smith',
    user_bio: 'UI/UX designer focused on creating intuitive and accessible user experiences.',
    user_role: 'students',
    user_linkedin_link: 'https://linkedin.com/in/jordans',
    user_university: 'UCLA',
    user_skills: [MOCK_SKILLS[8], MOCK_SKILLS[9], MOCK_SKILLS[10], MOCK_SKILLS[3]],
    created_at: '2023-01-22T15:45:00Z',
    updated_at: '2023-03-15T11:20:00Z'
  },
  {
    user_id: 'u4',
    user_email: 'prof.chen@university.edu',
    user_name: 'Dr. Morgan Chen',
    user_bio: 'Computer Science Professor specializing in AI and machine learning. Mentoring students on innovative projects.',
    user_role: 'mentors',
    user_linkedin_link: 'https://linkedin.com/in/dr-chen',
    user_university: 'Stanford University',
    user_skills: [MOCK_SKILLS[11], MOCK_SKILLS[13]],
    created_at: '2022-11-05T09:15:00Z',
    updated_at: '2023-04-01T16:30:00Z'
  },
  {
    user_id: 'u5',
    user_email: 'jamie@university.edu',
    user_name: 'Jamie Wilson',
    user_bio: 'Full-stack developer interested in educational technology and accessibility.',
    user_role: 'students',
    user_university: 'UC Berkeley',
    user_skills: [MOCK_SKILLS[0], MOCK_SKILLS[2], MOCK_SKILLS[4], MOCK_SKILLS[7]],
    created_at: '2023-01-30T13:20:00Z',
    updated_at: '2023-03-25T09:45:00Z'
  },
  {
    user_id: 'u6',
    user_email: 'admin@collablab.edu',
    user_name: 'System Administrator',
    user_role: 'admins',
    user_skills: [],
    created_at: '2022-10-01T00:00:00Z',
    updated_at: '2022-10-01T00:00:00Z'
  }
];

// Mock Projects
export const MOCK_PROJECTS: Project[] = [
  {
    project_id: 'p1',
    project_title: 'Student Portal Redesign',
    project_description: 'Redesign the university student portal with a modern UI and improved user experience. Focus on mobile responsiveness and accessibility features.',
    project_creator_id: 'u1',
    required_skills: [MOCK_SKILLS[0], MOCK_SKILLS[1], MOCK_SKILLS[8], MOCK_SKILLS[9]],
    project_status: 'recruiting',
    project_vacancy: 2,
    project_members: [MOCK_USERS[0]],
    project_timeline: '4-6 weeks',
    created_at: '2023-04-10T11:30:00Z',
    updated_at: '2023-04-10T11:30:00Z'
  },
  {
    project_id: 'p2',
    project_title: 'Campus Event Finder App',
    project_description: 'Develop a mobile app that helps students discover and RSVP to campus events. Implementation will include personalized recommendations based on interests.',
    project_creator_id: 'u2',
    required_skills: [MOCK_SKILLS[0], MOCK_SKILLS[2], MOCK_SKILLS[4], MOCK_SKILLS[6]],
    project_status: 'in_progress',
    project_vacancy: 1,
    project_members: [MOCK_USERS[1], MOCK_USERS[0]],
    project_timeline: '2-3 months',
    created_at: '2023-03-15T09:45:00Z',
    updated_at: '2023-04-20T14:30:00Z'
  },
  {
    project_id: 'p3',
    project_title: 'Academic Research Database',
    project_description: 'Create a searchable database of academic research papers with filtering options and citation tools for students and researchers.',
    project_creator_id: 'u4',
    required_skills: [MOCK_SKILLS[4], MOCK_SKILLS[5], MOCK_SKILLS[7]],
    project_status: 'recruiting',
    project_vacancy: 3,
    project_members: [MOCK_USERS[3]],
    project_timeline: '3-4 months',
    created_at: '2023-04-18T16:20:00Z',
    updated_at: '2023-04-18T16:20:00Z'
  },
  {
    project_id: 'p4',
    project_title: 'Student Budget Tracker',
    project_description: 'Build a financial tool to help students track expenses, set savings goals, and get insights on spending habits with data visualization.',
    project_creator_id: 'u3',
    required_skills: [MOCK_SKILLS[0], MOCK_SKILLS[2], MOCK_SKILLS[6]],
    project_status: 'recruiting',
    project_vacancy: 2,
    project_members: [MOCK_USERS[2]],
    project_timeline: '6-8 weeks',
    created_at: '2023-04-22T10:15:00Z',
    updated_at: '2023-04-22T10:15:00Z'
  },
  {
    project_id: 'p5',
    project_title: 'Campus Navigation AR App',
    project_description: 'Develop an augmented reality app to help new students navigate campus buildings and find classrooms, offices, and facilities.',
    project_creator_id: 'u5',
    required_skills: [MOCK_SKILLS[0], MOCK_SKILLS[4], MOCK_SKILLS[9]],
    project_status: 'recruiting',
    project_vacancy: 3,
    project_members: [MOCK_USERS[4]],
    project_timeline: '4-5 months',
    created_at: '2023-04-25T08:30:00Z',
    updated_at: '2023-04-25T08:30:00Z'
  },
  {
    project_id: 'p6',
    project_title: 'Study Group Finder',
    project_description: 'Create a platform that helps students find and create study groups for specific courses, with scheduling and resource sharing features.',
    project_creator_id: 'u2',
    required_skills: [MOCK_SKILLS[0], MOCK_SKILLS[4], MOCK_SKILLS[8]],
    project_status: 'completed',
    project_vacancy: 0,
    project_members: [MOCK_USERS[1], MOCK_USERS[0], MOCK_USERS[2]],
    project_timeline: 'Completed in 2 months',
    created_at: '2023-02-05T08:30:00Z',
    updated_at: '2023-04-10T15:45:00Z'
  }
];

// Mock Applications
export const MOCK_APPLICATIONS: Application[] = [
  {
    application_id: 'a1',
    project_id: 'p1',
    user_id: 'u3',
    application_msg: "I'm very interested in this project as I have extensive experience in UI/UX design. I've worked on similar portal redesigns and would love to contribute my skills to improve the student experience.",
    application_status: 'pending',
    applied_at: '2023-04-12T09:20:00Z'
  },
  {
    application_id: 'a2',
    project_id: 'p1',
    user_id: 'u5',
    application_msg: "I'd like to join this project to contribute my frontend development skills. I've worked with React and TypeScript extensively and am passionate about creating accessible interfaces.",
    application_status: 'accepted',
    applied_at: '2023-04-11T14:45:00Z'
  },
  {
    application_id: 'a3',
    project_id: 'p3',
    user_id: 'u2',
    application_msg: "I have experience building database systems and would love to contribute to this research database project. My backend skills would be a great fit for this team.",
    application_status: 'pending',
    applied_at: '2023-04-19T11:30:00Z'
  },
  {
    application_id: 'a4',
    project_id: 'p4',
    user_id: 'u1',
    application_msg: "As someone who struggles with budgeting, I'm excited about this project! I can contribute my React and Next.js skills to build a great frontend for this tool.",
    application_status: 'rejected',
    applied_at: '2023-04-23T16:10:00Z'
  },
  {
    application_id: 'a5',
    project_id: 'p5',
    user_id: 'u3',
    application_msg: "I'd love to help design the user interface for this AR app. I have some experience with AR design principles and can ensure the app is intuitive and visually appealing.",
    application_status: 'pending',
    applied_at: '2023-04-26T10:05:00Z'
  }
];

// Mock Messages
export const MOCK_MESSAGES: Message[] = [
  {
    msg_id: 'm1',
    msg_sender_id: 'u1',
    msg_receiver_id: 'u3',
    msg_content: "Hi Jordan, I saw your application for the Student Portal Redesign. Would you be available for a quick chat this week to discuss your design ideas?",
    sent_at: '2023-04-13T15:30:00Z',
    is_read: true
  },
  {
    msg_id: 'm2',
    msg_sender_id: 'u3',
    msg_receiver_id: 'u1',
    msg_content: "Hi Alex, I'd be happy to chat! How about Thursday at 3pm? I can share some of my initial thoughts for the redesign.",
    sent_at: '2023-04-13T16:45:00Z',
    is_read: true
  },
  {
    msg_id: 'm3',
    msg_sender_id: 'u4',
    project_id: 'p3',
    msg_content: "Welcome to the Academic Research Database project! I've created a shared document with the project requirements and initial database schema. Let's schedule our first team meeting next week.",
    sent_at: '2023-04-20T09:15:00Z',
    is_read: false
  },
  {
    msg_id: 'm4',
    msg_sender_id: 'u2',
    msg_receiver_id: 'u1',
    msg_content: "Hey Alex, how's your part of the Campus Event Finder coming along? Let me know if you need any help with the API integration.",
    sent_at: '2023-04-22T14:20:00Z',
    is_read: false
  },
  {
    msg_id: 'm5',
    msg_sender_id: 'u5',
    project_id: 'p5',
    msg_content: "I've pushed the initial project setup to our GitHub repo. Everyone please clone it and make sure you can run it locally. Let me know if you encounter any issues.",
    sent_at: '2023-04-26T11:30:00Z',
    is_read: true
  }
];