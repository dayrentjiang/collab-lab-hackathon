import { Suspense } from 'react';
import Link from 'next/link';
import { getAllProjects } from '@/types/mockData';
import ProjectCard from '../components/ProjectCard';
import { FilterIcon, PlusIcon, SearchIcon } from 'lucide-react';
import ProjectsFilter from '../components/ProjectsFilter';

// Make sure this is defined as an async component function
export default async function ProjectsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract filter parameters
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const status = typeof searchParams.status === 'string' 
    ? (searchParams.status as 'recruiting' | 'in_progress' | 'completed' | undefined)
    : undefined;
  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  
  // Fetch projects with filters
  const projects = await getAllProjects({ category, status, query });
  
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Your UI code here */}
      <h1>Projects Page</h1>
      {/* Rest of your component */}
    </main>
  );
}