'use client';

import { useState } from 'react';
import { Project } from '@/types/types';
import { useRouter } from 'next/navigation';

type FormData = {
  project_title: string;
  project_description: string;
  project_status: 'recruiting' | 'in_progress' | 'completed';
  project_vacancy: number;
  project_timeline?: string;
};

const defaultForm: FormData = {
  project_title: '',
  project_description: '',
  project_status: 'recruiting',
  project_vacancy: 1,
  project_timeline: '',
};

type AddProjectFormProps = {
    clerkId: string;
  };

  export default function AddProjectForm({ clerkId }: AddProjectFormProps) {
  const [form, setForm] = useState<FormData>(defaultForm);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'project_vacancy' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, project_creator_id: clerkId }),
    });

    if (response.ok) {
      router.push('/projects');
    } else {
      console.error('Failed to create project');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <input name="project_title" placeholder="Title" value={form.project_title} onChange={handleChange} required className="w-full border p-2" />
      <textarea name="project_description" placeholder="Description" value={form.project_description} onChange={handleChange} required className="w-full border p-2" />
      <select name="project_status" value={form.project_status} onChange={handleChange} className="w-full border p-2">
        <option value="recruiting">Recruiting</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input type="number" name="project_vacancy" value={form.project_vacancy} onChange={handleChange} min="1" required className="w-full border p-2" />
      <input name="project_timeline" placeholder="Timeline (optional)" value={form.project_timeline} onChange={handleChange} className="w-full border p-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Create Project</button>
    </form>
  );
}