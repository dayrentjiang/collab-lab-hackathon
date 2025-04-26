"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Skill } from "@/types/types";
import { ChevronRight, Loader2, X } from "lucide-react";
import { getAvailableSkills } from "@/actions/project";
import AddSkill from "../../components/AddSkill";
import {
  createUser,
  getUserHasCompletedPersonalized
} from "../../../actions/user";

// For setup process tracking
type ProfileSetupStep = "basics" | "skills" | "education" | "review";

// Form data structure
interface ProfileFormData {
  user_clerk_id: string | undefined;
  user_email: string;
  user_name: string;
  user_bio: string;
  user_role: "student" | "mentor" | "admin";
  user_linkedin_link: string;
  user_university: string;
  selected_skills: number[]; // Skill IDs
  has_completed_personalized: boolean;
}

export default function ProfileSetup() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ProfileSetupStep>("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      setIsLoading(true);
      //while doing this check we can show a loading spinner
      if (!user?.id) return;
      try {
        console.log(user.id);
        const response = await getUserHasCompletedPersonalized(user.id);
        console.log(response);
        if (response) {
          router.push("/");
        } else {
          setCurrentStep("basics");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
      }
    };

    checkUserProfile();
  }, [user, router]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const fetchedSkills = await getAvailableSkills();
        // Make sure skills have the correct format
        const normalizedSkills = fetchedSkills.map((skill) => ({
          ...skill,
          skill_id: Number(skill.skill_id)
        }));
        setAllSkills(normalizedSkills);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };

    fetchSkills();
  }, []);

  // Default form values
  const [formData, setFormData] = useState<ProfileFormData>({
    user_clerk_id: user?.id,
    user_email: user?.primaryEmailAddress?.emailAddress || "",
    user_name: user?.fullName || "",
    user_bio: "",
    user_role: "student", // Default role
    user_linkedin_link: "",
    user_university: "",
    has_completed_personalized: true,
    selected_skills: []
  });

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle skill selection

  // Make sure your toggleSkill function is compatible with the AddSkill component:
  const toggleSkill = (skillId: number) => {
    setFormData((prev) => {
      const newSkills = prev.selected_skills.includes(skillId)
        ? prev.selected_skills.filter((id) => id !== skillId)
        : [...prev.selected_skills, skillId];
      return {
        ...prev,
        selected_skills: newSkills
      };
    });
  };

  // Find a skill by ID

  // Navigation functions
  const nextStep = () => {
    switch (currentStep) {
      case "basics":
        setCurrentStep("skills");
        break;
      case "skills":
        setCurrentStep("education");
        break;
      case "education":
        setCurrentStep("review");
        break;
      case "review":
        handleSubmit();
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case "skills":
        setCurrentStep("basics");
        break;
      case "education":
        setCurrentStep("skills");
        break;
      case "review":
        setCurrentStep("education");
        break;
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // In a real app, you would make an API call to save the profile data
      console.log(formData);
      // For this example, we'll simulate a successful submission
      await createUser(formData);

      // Redirect to dashboard after successful submission
      router.push("/");
    } catch (error) {
      console.error("Error saving profile:", error);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4 text-white">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-blue-100">
            Set up your profile to get matched with the right projects
          </p>
        </div>

        {/* Progress Steps */}
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">1</span>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Basic Information</span>
              </div>
              <div className="h-0.5 flex-1 bg-gray-200 mx-4">
                <div className="h-0.5 bg-blue-500" style={{ width: '100%' }}></div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">2</span>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Skills</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.user_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.user_bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.selected_skills.map((skillId) => {
                  const skill = allSkills.find(s => s.skill_id === skillId);
                  return skill ? (
                    <span
                      key={skill.skill_id}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill.skill_name}
                      <button
                        type="button"
                        onClick={() => toggleSkill(skill.skill_id)}
                        className="ml-2 text-blue-400 hover:text-blue-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <div className="flex">
                <input
                  type="text"
                  id="skills"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Add a skill"
                />
                <button
                  type="button"
                  onClick={() => {
                    // Implement adding a new skill
                  }}
                  className="ml-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
