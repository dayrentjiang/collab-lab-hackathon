"use client"

import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserByClerkId } from '../../actions/user';
import Link from 'next/link';
import { Pencil, Linkedin, PlusCircle, FolderOpen } from 'lucide-react';

interface UserSkill {
  skill_id: number;
  skill_name: string;
  skill_category: string;
}

interface User {
  user_id: number;
  user_clerk_id: string;
  user_email: string;
  user_name: string;
  user_bio?: string;
  user_role: "student" | "admin" | "mentor";
  user_linkedin_link?: string;
  user_university?: string;
  skills?: UserSkill[];
}

export default function UserProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserProfile() {
      if (!isLoaded || !clerkUser) return;

      try {
        const userData = await getUserByClerkId(clerkUser.id);
        console.log("User Data:", userData);
        if (userData) {
          // Debug skills data
          console.log("Skills Data:", userData.skills);
          
          // Transform skills data if it exists
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const transformedSkills = userData.skills?.map((skill: any) => {
            console.log("Individual Skill:", skill);
            // Access the nested skill data from skill_id object
            return {
              skill_id: skill.skill_id.skill_id,
              skill_name: skill.skill_id.skill_name,
              skill_category: skill.skill_id.skill_category
            };
          }) || [];
          
          console.log("Transformed Skills:", transformedSkills);
          
          setUserProfile({
            ...userData,
            skills: transformedSkills
          });
        } else {
          setError("Could not find user profile");
        }
      } catch (err) {
        setError("Error loading profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [clerkUser, isLoaded]);

  if (!isLoaded || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Error: {error}</h1>
        <p>We couldn&apos;t load your profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-8 py-12 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">{userProfile.user_name}</h1>
                <p className="text-blue-100">{userProfile.user_email}</p>
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium mt-3">
                  {userProfile.user_role.charAt(0).toUpperCase() + userProfile.user_role.slice(1)}
                </span>
              </div>
              <Link
                href="/profile/edit"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-colors flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="p-8">
            {userProfile.user_bio && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About Me</h2>
                <p className="text-gray-600 leading-relaxed">{userProfile.user_bio}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {userProfile.user_university && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">University</h3>
                  <p className="text-gray-900 font-medium">{userProfile.user_university}</p>
                </div>
              )}
              
              {userProfile.user_linkedin_link && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">LinkedIn</h3>
                  <a 
                    href={userProfile.user_linkedin_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    View Profile
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
            <Link
              href="/profile/edit"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Manage skills
            </Link>
          </div>
          
          {userProfile.skills && userProfile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {userProfile.skills.map((skill) => {
                const categoryColor = getSkillCategoryColor(skill.skill_category);
                return (
                  <span
                    key={skill.skill_id}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium ${categoryColor}`}
                  >
                    {skill.skill_name}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FolderOpen className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No skills added yet</h3>
              <p className="text-gray-500">Add your skills to showcase your expertise</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function for skill category colors
const getSkillCategoryColor = (category: string | undefined) => {
  switch (category?.toLowerCase()) {
    case "frontend":
      return "bg-purple-100 text-purple-800";
    case "backend":
      return "bg-green-100 text-green-800";
    case "design":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};