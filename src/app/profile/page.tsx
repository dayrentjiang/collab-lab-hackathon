"use client"

import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserByClerkId } from '../../actions/user';
import Link from 'next/link';

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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{userProfile.user_name}</h1>
            <p className="text-gray-600">{userProfile.user_email}</p>
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mt-2">
              {userProfile.user_role.charAt(0).toUpperCase() + userProfile.user_role.slice(1)}
            </span>
          </div>
          <Link
            href="/profile/edit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Edit Profile
          </Link>
        </div>

        {userProfile.user_bio && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Bio</h2>
            <p className="text-gray-700">{userProfile.user_bio}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {userProfile.user_university && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">University</h3>
              <p>{userProfile.user_university}</p>
            </div>
          )}
          
          {userProfile.user_linkedin_link && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">LinkedIn</h3>
              <a 
                href={userProfile.user_linkedin_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {userProfile.user_linkedin_link}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        
        {userProfile.skills && userProfile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {userProfile.skills.map((skill) => {
              console.log("Rendering Skill:", skill);
              return (
                <span
                  key={skill.skill_id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill.skill_name}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No skills added yet.</p>
        )}
        
        <div className="mt-4">
          <Link
            href="/profile/edit"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Manage skills
          </Link>
        </div>
      </div>
    </div>
  );
}