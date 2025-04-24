import AddProjectForm from '../../components/AddProjectForm';
'use client';

import { useUser } from '@clerk/nextjs';

export default function AddProjectPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>You must be logged in to create a project.</div>;

  const userClerkId = user.id;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Project</h1>
      <AddProjectForm clerkId={userClerkId} />
    </div>
  );
}