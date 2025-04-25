'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Skill } from '@/types/types';
import { Check, X, ChevronRight, Loader2 } from 'lucide-react';
import { getAvailableSkills } from '@/actions/project';
import AddSkill from '../../components/AddSkill'; 
import { createUser } from '../../../actions/user'



// For setup process tracking
type ProfileSetupStep = 'basics' | 'skills' | 'education' | 'review';

// Form data structure
interface ProfileFormData {
    user_clerk_id: string | undefined;
    user_email: string;
  user_name: string;
  user_bio: string;
  user_role: 'student' | 'mentor' | 'admin';
  user_linkedin_link: string;
  user_university: string;
  selected_skills: number[]; // Skill IDs
  has_completed_personalized: boolean;
}



export default function ProfileSetup() {
    const { isLoaded, user } = useUser();

    if (!isLoaded) {
     
      return null;
    }
  
    if (!user) return null;
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ProfileSetupStep>('basics');
  const [isSubmitting, setIsSubmitting] = useState(false);
const [isLoadingSkills, setIsLoadingSkills] = useState(true);
const [searchTerm, setSearchTerm] = useState('');
const [allSkills, setAllSkills] = useState<Skill[]>([]);
const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
const [skills, setSkills] = useState<Skill[]>([]);
const findSkillById = (id: number): Skill | undefined => {
    return skills.find(skill => skill.skill_id === id);
  };

  //check if user has_completed_personalized. redirect them to /
  
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user?.id) return;
  
      try {
        const profile = await user_clerk_id(user.id);
        if (profile?.has_completed_personalized) {
          router.push('/'); // redirect if already completed
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
      }
    };
  
    checkUserProfile();
  }, [user, router]);

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoadingSkills(true);
      try {
        const fetchedSkills = await getAvailableSkills();
        // Make sure skills have the correct format
        const normalizedSkills = fetchedSkills.map(skill => ({
          ...skill,
          skill_id: Number(skill.skill_id),
        }));
        setAllSkills(normalizedSkills);
        setFilteredSkills(normalizedSkills);
        // Also set skills so findSkillById works correctly
        setSkills(normalizedSkills);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setIsLoadingSkills(false);
      }
    };
  
    fetchSkills();
  }, []);

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  
    if (term.trim() === '') {
      setFilteredSkills(allSkills);
    } else {
      const filtered = allSkills.filter(skill =>
        skill.skill_name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSkills(filtered);
    }
  };
  
  // Default form values
  const [formData, setFormData] = useState<ProfileFormData>({
    user_clerk_id: user?.id,
    user_email: user?.primaryEmailAddress?.emailAddress || '',
    user_name: user?.fullName || '',
    user_bio: '',
    user_role: 'student', // Default role
    user_linkedin_link: '',
    user_university: '',
    has_completed_personalized: true,
    selected_skills: [],
  });


  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle skill selection

// Make sure your toggleSkill function is compatible with the AddSkill component:
const toggleSkill = (skillId: number) => {
  setFormData(prev => {
    const newSkills = prev.selected_skills.includes(skillId)
      ? prev.selected_skills.filter(id => id !== skillId)
      : [...prev.selected_skills, skillId];
    return {
      ...prev,
      selected_skills: newSkills,
    };
  });
};

  // Find a skill by ID


  // Navigation functions
  const nextStep = () => {
    switch (currentStep) {
      case 'basics':
        setCurrentStep('skills');
        break;
      case 'skills':
        setCurrentStep('education');
        break;
      case 'education':
        setCurrentStep('review');
        break;
      case 'review':
        handleSubmit();
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case 'skills':
        setCurrentStep('basics');
        break;
      case 'education':
        setCurrentStep('skills');
        break;
      case 'review':
        setCurrentStep('education');
        break;
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call to save the profile data
      console.log (formData)
      // For this example, we'll simulate a successful submission
    await createUser(formData);

      
      // Redirect to dashboard after successful submission
      router.push('/');
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="bg-blue-500 px-6 py-4 text-white">
          <h1 className="text-xl font-semibold">Complete Your Profile</h1>
          <p className="text-blue-100">Set up your profile to get matched with the right projects</p>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex justify-between mb-8">
            <div className={`flex flex-col items-center ${currentStep === 'basics' ? 'text-blue-500' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'basics' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                1
              </div>
              <span className="text-xs">Basics</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`flex-grow h-0.5 ${currentStep !== 'basics' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex flex-col items-center ${currentStep === 'skills' ? 'text-blue-500' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'skills' ? 'bg-blue-500 text-white' : currentStep === 'basics' ? 'bg-gray-100 text-gray-500' : 'bg-blue-500 text-white'}`}>
                2
              </div>
              <span className="text-xs">Skills</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`flex-grow h-0.5 ${currentStep === 'education' || currentStep === 'review' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex flex-col items-center ${currentStep === 'education' ? 'text-blue-500' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'education' ? 'bg-blue-500 text-white' : currentStep === 'review' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                3
              </div>
              <span className="text-xs">Education</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`flex-grow h-0.5 ${currentStep === 'review' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex flex-col items-center ${currentStep === 'review' ? 'text-blue-500' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'review' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                4
              </div>
              <span className="text-xs">Review</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 pb-6">
          {/* Basic Information Step */}
          {currentStep === 'basics' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="user_bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio <span className="text-gray-400 text-xs">(Tell us about yourself)</span>
                  </label>
                  <textarea
                    id="user_bio"
                    name="user_bio"
                    value={formData.user_bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your background, interests, and what kind of projects you're looking for..."
                  />
                </div>
                
                <div>
                  <label htmlFor="user_role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="user_role"
                    name="user_role"
                    value={formData.user_role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                  </select>
                </div>
              </div>
            </div>
          )}
{currentStep === 'skills' && (
  <div className="space-y-6">
    <h2 className="text-lg font-semibold text-gray-800">Skills & Expertise</h2>

    {/* Add a styled wrapper div around the AddSkill component */}
    <div style={{ position: 'relative', zIndex: 50 }}>
      <AddSkill
        skills={allSkills}
        selectedSkills={formData.selected_skills}
        onSkillToggle={toggleSkill}
        error={formData.selected_skills.length === 0 ? "Please select at least one skill to help match you with relevant projects." : null}
      />
    </div>
  </div>
)}

          {/* Education Step */}
          {currentStep === 'education' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Education & Links</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="user_university" className="block text-sm font-medium text-gray-700 mb-1">
                    University/School
                  </label>
                  <input
                    type="text"
                    id="user_university"
                    name="user_university"
                    value={formData.user_university}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Stanford University"
                  />
                </div>
                
                <div>
                  <label htmlFor="user_linkedin_link" className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    id="user_linkedin_link"
                    name="user_linkedin_link"
                    value={formData.user_linkedin_link}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Review Your Information</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please review your profile information before finalizing.
              </p>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="text-gray-800">{formData.user_name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                  <p className="text-gray-800">{formData.user_bio || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="text-gray-800 capitalize">{formData.user_role}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.selected_skills.length > 0 ? (
                      formData.selected_skills.map(skillId => {
                        const skill = allSkills.find(s => s.skill_id === skillId);
                        return skill ? (
                          <span 
                            key={skill.skill_id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill.skill_name}
                          </span>
                        ) : null;
                      })
                    ) : (
                      <span className="text-gray-500">No skills selected</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">University/School</h3>
                  <p className="text-gray-800">{formData.user_university || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">LinkedIn</h3>
                  <p className="text-gray-800">
                    {formData.user_linkedin_link ? (
                      <a 
                        href={formData.user_linkedin_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {formData.user_linkedin_link}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep !== 'basics' ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div> // Empty div to maintain the space
            )}
            
            <button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting || (currentStep === 'skills' && formData.selected_skills.length === 0)}
              className={`px-4 py-2 rounded-md text-white transition-colors flex items-center ${
                isSubmitting || (currentStep === 'skills' && formData.selected_skills.length === 0)
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : currentStep === 'review' ? (
                'Complete Profile'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}