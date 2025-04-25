"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserByClerkId, updateUser } from '@/actions/user';
import { useRouter } from 'next/navigation';
import ManageSkills from '../../components/ManageSkills'; // Import ManageSkills
import { getAvailableSkills } from '@/actions/project';
import { Skill } from '@/types/types';

interface User {
  user_id: number;
  user_clerk_id: string;
  user_email: string;
  user_name: string;
  user_bio?: string;
  user_role: "student" | "admin" | "mentor";
  user_linkedin_link?: string;
  user_university?: string;
}

export default function EditProfileForm() {
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  
  const [formData, setFormData] = useState({
    user_name: '',
    user_bio: '',
    user_role: 'student',
    user_linkedin_link: '',
    user_university: '',
  });

  // Fetch skills from the backend
  const [skills, setSkills] = useState<Skill[]>([]);
  
  useEffect(() => {
    async function loadSkillsAndUserData() {
      if (!clerkUser) return;
  
      try {
        // Fetch all available skills
        const availableSkills = await getAvailableSkills();
        setAllSkills(availableSkills);

        const userData = await getUserByClerkId(clerkUser.id);
        if (userData) {
          setFormData({
            user_name: userData.user_name || '',
            user_bio: userData.user_bio || '',
            user_role: userData.user_role || 'student',
            user_linkedin_link: userData.user_linkedin_link || '',
            user_university: userData.user_university || '',
          });
  
          // Ensure skills are passed correctly
          setSkills(userData.skills || []);
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  
    loadSkillsAndUserData();
  }, [clerkUser]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'user_role') {
      const roleValue = value as "student" | "admin" | "mentor";
      setFormData(prev => ({ ...prev, [name]: roleValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkUser) return;
    
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await updateUser(clerkUser.id, formData);
      
      if (result.success) {
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="user_bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="user_bio"
              name="user_bio"
              value={formData.user_bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="user_role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="user_role"
              name="user_role"
              value={formData.user_role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="user_linkedin_link" className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              id="user_linkedin_link"
              name="user_linkedin_link"
              value={formData.user_linkedin_link}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="user_university" className="block text-sm font-medium text-gray-700 mb-1">
              University
            </label>
            <input
              type="text"
              id="user_university"
              name="user_university"
              value={formData.user_university}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

           {/* Add ManageSkills Component */}
        <ManageSkills />
          
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

       
      </div>
    </div>
  );
}