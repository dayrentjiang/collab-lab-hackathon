"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Skill } from "@/types/types";
import { createProject, getAvailableSkills } from "@/actions/project";
import { Loader2, LayoutGrid, Users } from "lucide-react";
import AddSkill from "../../components/AddSkill";

interface ProjectFormData {
  project_creator_id: string;
  project_title: string;
  project_description: string;
  project_status: "recruiting" | "in_progress" | "completed";
  project_vacancy: number;
  project_timeline?: string;

  required_skills: number[]; // Skill IDs
}

export default function CreateProjectPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [skillError, setSkillError] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  // Default form state
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState<ProjectFormData>({
    project_creator_id: user.id,
    project_title: "",
    project_description: "",
    project_status: "recruiting",
    project_vacancy: 1,
    project_timeline: "",
    required_skills: []
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getAvailableSkills();
        const normalizedSkills = data.map((skill) => ({
          ...skill,
          skill_id: Number(skill.skill_id)
        }));
        setSkills(normalizedSkills);
        console.log(normalizedSkills); // <-- Add this to see if the skills are loaded
      } catch (err) {
        console.error("Failed to load skills:", err);
        setSkillError("Failed to load skills. Please try again later.");
      } finally {
        setIsLoadingSkills(false);
      }
    };

    fetchSkills();
  }, []);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "project_vacancy") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Toggle skill selection
  const toggleSkill = (skillId: number) => {
    setFormData((prev) => {
      const newSkills = prev.required_skills.includes(skillId)
        ? prev.required_skills.filter((id) => id !== skillId)
        : [...prev.required_skills, skillId];
      return {
        ...prev,
        required_skills: newSkills
      };
    });

    if (errors.required_skills) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.required_skills;
        return newErrors;
      });
    }
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.project_title.trim()) {
      newErrors.project_title = "Project title is required";
    }

    if (!formData.project_description.trim()) {
      newErrors.project_description = "Project description is required";
    } else if (formData.project_description.length < 50) {
      newErrors.project_description =
        "Description should be at least 50 characters";
    }

    if (formData.project_vacancy < 1) {
      newErrors.project_vacancy = "At least one vacancy is required";
    }

    if (formData.required_skills.length === 0) {
      newErrors.required_skills = "At least one skill is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      //use the createProject action
      console.log("Creating project with data:", formData);
      await createProject(formData);
      console.log("Project created successfully!");
      router.push("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to create project. Please try again."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || isLoadingSkills) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Create a New Project
        </h1>
        <p className="text-gray-600 mt-1">
          Share your project idea with the community and find collaborators
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <LayoutGrid className="h-5 w-5 mr-2 text-blue-500" />
            Project Details
          </h2>

          <div className="space-y-4">
            {/* Project Title */}
            <div>
              <label
                htmlFor="project_title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="project_title"
                name="project_title"
                value={formData.project_title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.project_title ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Give your project a clear, descriptive title"
              />
              {errors.project_title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.project_title}
                </p>
              )}
            </div>

            {/* Project Description */}
            <div>
              <label
                htmlFor="project_description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="project_description"
                name="project_description"
                value={formData.project_description}
                onChange={handleInputChange}
                rows={5}
                className={`w-full px-3 py-2 border ${
                  errors.project_description
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Describe your project, its goals, and what you're looking for in collaborators"
              />
              {errors.project_description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.project_description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Characters: {formData.project_description.length} (minimum 50)
              </p>
            </div>

            {/* Project Status */}
            <div>
              <label
                htmlFor="project_status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Status <span className="text-red-500">*</span>
              </label>
              <select
                id="project_status"
                name="project_status"
                value={formData.project_status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recruiting">
                  Recruiting - Looking for team members
                </option>
                <option value="in_progress">
                  In Progress - Already started but need more help
                </option>
                <option value="completed">Completed - Showcase only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Team Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Vacancies */}
            <div>
              <label
                htmlFor="project_vacancy"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Number of Collaborators Needed{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="project_vacancy"
                name="project_vacancy"
                value={formData.project_vacancy}
                onChange={handleInputChange}
                min={1}
                max={10}
                className={`w-full px-3 py-2 border ${
                  errors.project_vacancy ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.project_vacancy && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.project_vacancy}
                </p>
              )}
            </div>

            {/* Timeline */}
            <div>
              <label
                htmlFor="project_timeline"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expected Timeline
              </label>
              <select
                id="project_timeline"
                name="project_timeline"
                value={formData.project_timeline || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a timeline</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="3-4 weeks">3-4 weeks</option>
                <option value="1-2 months">1-2 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6+ months">6+ months</option>
              </select>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            {skillError && (
              <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded-md">
                <p className="text-sm text-red-600">{skillError}</p>
              </div>
            )}

            {errors.required_skills && (
              <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded-md">
                <p className="text-sm text-red-600">{errors.required_skills}</p>
              </div>
            )}

            <AddSkill
              skills={skills}
              selectedSkills={formData.required_skills}
              onSkillToggle={toggleSkill}
              error={errors.required_skills}
            />

            {/* Submit Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {errors.submit}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoadingSkills}
                className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting || isLoadingSkills
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Project"
                )}
              </button>
            </div>
          </div>{" "}
        </div>
      </form>
    </div>
  );
}
