'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type ProjectsFilterProps = {
  selectedCategory?: string;
  selectedStatus?: string;
};

export default function ProjectsFilter({ selectedCategory, selectedStatus }: ProjectsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Create a new URLSearchParams instance to modify parameters
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      
      return params.toString();
    },
    [searchParams]
  );
  
  // Category filter handler
  const handleCategoryChange = (category: string) => {
    router.push(`/projects?${createQueryString('category', 
      category === selectedCategory ? '' : category)}`, 
      { scroll: false }
    );
  };
  
  // Status filter handler
  const handleStatusChange = (status: string) => {
    router.push(`/projects?${createQueryString('status', 
      status === selectedStatus ? '' : status)}`, 
      { scroll: false }
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        <button 
          onClick={() => router.push('/projects')}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Reset
        </button>
      </div>
      
      {/* Category filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Skill Category</h3>
        <div className="space-y-2">
          {['frontend', 'backend', 'design', 'other'].map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                selectedCategory === category
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Status filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Project Status</h3>
        <div className="space-y-2">
          {[
            { id: 'recruiting', label: 'Recruiting' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' }
          ].map(status => (
            <button
              key={status.id}
              onClick={() => handleStatusChange(status.id)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                selectedStatus === status.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}