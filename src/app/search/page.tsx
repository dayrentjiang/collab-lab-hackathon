'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Project } from '../../types/types';
import { Skill } from '../../types/types';
import { getAllProjects } from '../../actions/project';
import { getAvailableSkills } from '../../actions/project';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter, X, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  

  
  // Fetch skills and projects on page load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch skills
        const skillsData = await getAvailableSkills();
        if (Array.isArray(skillsData)) {
          setSkills(skillsData);
        }

        // Fetch projects
        const projectsData = await getAllProjects();
        if (Array.isArray(projectsData)) {
          setProjects(projectsData);
          
          // Apply initial filters from URL params
          filterProjects(projectsData, searchTerm, selectedCategory, selectedStatus);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Filter projects based on search term and filters
  const filterProjects = (allProjects, term, category, status) => {
    let filtered = [...allProjects];
    
    // Filter by search term
    if (term) {
      filtered = filtered.filter(project => 
        project.project_title.toLowerCase().includes(term.toLowerCase()) ||
        project.project_description.toLowerCase().includes(term.toLowerCase()) ||
        project.skills?.some(skill => 
          skill.skill_name.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    
    // Filter by category
    if (category) {
      filtered = filtered.filter(project => 
        project.skills?.some(skill => skill.skill_category === category)
      );
    }
    
    // Filter by status
    if (status) {
      filtered = filtered.filter(project => project.project_status === status);
    }
    
    setFilteredProjects(filtered);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Update URL with search params
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedStatus) params.set('status', selectedStatus);
    
    router.push(`/search?${params.toString()}`);
    
    // Filter projects
    filterProjects(projects, searchTerm, selectedCategory, selectedStatus);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    router.push('/search');
    filterProjects(projects, '', '', '');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Projects</h1>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects by title, description, or skills..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </div>

          
          
          {/* Filters section */}
          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Skill Category filter */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="design">Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Project Status filter */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Status
                  </label>
                  <select
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="recruiting">Recruiting</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                {/* Clear filters button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Search Results */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredProjects.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Result' : 'Results'}
              </h2>
              
              {/* Active filters */}
              {(searchTerm || selectedCategory || selectedStatus) && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Filters:</span>
                  
                  {searchTerm && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      "{searchTerm}"
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          filterProjects(projects, '', selectedCategory, selectedStatus);
                        }}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {selectedCategory && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {selectedCategory}
                      <button 
                        onClick={() => {
                          setSelectedCategory('');
                          filterProjects(projects, searchTerm, '', selectedStatus);
                        }}
                        className="ml-1 text-green-500 hover:text-green-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {selectedStatus && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {selectedStatus.replace('_', ' ')}
                      <button 
                        onClick={() => {
                          setSelectedStatus('');
                          filterProjects(projects, searchTerm, selectedCategory, '');
                        }}
                        className="ml-1 text-purple-500 hover:text-purple-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.project_id} project={project} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button 
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}