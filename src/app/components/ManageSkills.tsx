"use client";

import { useState, useEffect, useRef } from "react";
import { Skill } from "@/types/types"; // Assuming this type is already defined for your skills.
import { Check, X, Plus, Search, Tag } from "lucide-react";
import { useUser } from "@clerk/clerk-react"; // Clerk hook
import { getUserByClerkId, updateUserSkills } from "@/actions/user"; // Assuming this fetches and updates the user data with skills.

export default function ManageSkills() {
  const { user, isLoaded, isSignedIn } = useUser(); // Get the current user data from Clerk

  const [userSkills, setUserSkills] = useState<Skill[]>([]);  // State to store fetched user skills
  const [allSkills, setAllSkills] = useState<Skill[]>([]);    // All available skills
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch user's existing skills and all available skills
  useEffect(() => {
    const fetchSkills = async () => {
      if (isSignedIn && user?.id) {
        const userId = user.id; // Clerk's user ID
        const userData = await getUserByClerkId(userId); // Fetch user data using Clerk ID
        
        if (userData) {
          // Ensure skills and allSkills are defined as arrays
          const skills = Array.isArray(userData.skills) ? userData.skills : [];
          const allSkills = Array.isArray(userData.allSkills) ? userData.allSkills : [];

          setUserSkills(skills);  // Set the user skills
          setAllSkills(allSkills);  // Set the all available skills
          setFilteredSkills(allSkills);  // Filtered skills are initially set to allSkills
        }
      }
    };

    if (isLoaded && isSignedIn) {
      fetchSkills(); // Run the fetch when Clerk data is loaded and the user is signed in
    }
  }, [isLoaded, isSignedIn, user?.id]); // Dependency array to rerun when the user data changes

  // Get unique categories from all skills
  const categories = Array.from(
    new Set(allSkills.map((skill) => skill.skill_category))
  );

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterSkills(term);
  };

  // Filter skills based on search term and category filters
  const filterSkills = (term: string = searchTerm) => {
    let filtered = allSkills || [];  // Ensure allSkills is defined as an empty array if undefined

    // Apply category filters if any
    if (categoryFilters.length > 0) {
      filtered = filtered.filter((skill) =>
        categoryFilters.includes(skill.skill_category)
      );
    }

    // Apply search term filter if any
    if (term.trim() !== "") {
      filtered = filtered.filter(
        (skill) =>
          skill.skill_name.toLowerCase().includes(term.toLowerCase()) ||
          skill.skill_category.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredSkills(filtered);
  };

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters((prev) => {
      const newFilters = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      filterSkills();
      return newFilters;
    });
  };

  // Handle skill removal
  const handleRemoveSkill = async (skillId: number) => {
    if (!user?.id) return;
    
    const updatedSkills = userSkills.filter((skill) => skill.skill_id !== skillId);
    setUserSkills(updatedSkills);
    await updateUserSkills(user.id, updatedSkills.map(skill => skill.skill_id));
  };

  // Handle skill addition
  const handleAddSkill = async (skillId: number) => {
    if (!user?.id) return;
    
    const skillToAdd = allSkills.find((skill) => skill.skill_id === skillId);
    if (skillToAdd && !userSkills.some((skill) => skill.skill_id === skillId)) {
      const updatedSkills = [...userSkills, skillToAdd];
      setUserSkills(updatedSkills);
      await updateUserSkills(user.id, updatedSkills.map(skill => skill.skill_id));
    }
  };

  // Open dropdown and focus search input
  const openDropdown = () => {
    setIsDropdownOpen(true);
    setFilteredSkills(allSkills);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>; // Optionally show loading while Clerk user data is fetched
  }

  if (!isSignedIn) {
    return <div>You need to sign in to see your data.</div>; // Show message if user is not signed in
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Manage Skills <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Select or remove skills from your profile
        </p>
      </div>

      {/* User's Current Skills Display */}
      <div className="mb-4">
        <div className={`flex flex-wrap gap-2 p-3 ${userSkills.length > 0 ? "bg-gray-50" : ""} rounded-md border border-gray-200 min-h-16`}>
          {userSkills.length === 0 ? (
            <p className="text-sm text-gray-400 flex items-center">
              No skills selected
            </p>
          ) : (
            userSkills.map((skillObj) => (
              <div key={skillObj.skill_id} className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 text-sm shadow-sm">
                <span className="mr-2">{skillObj.skill_name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skillObj.skill_id)}
                  className="text-gray-400 hover:text-red-500 focus:outline-none"
                  aria-label={`Remove ${skillObj.skill_name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={openDropdown}
          className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        >
          <span className="flex items-center text-gray-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Skills
          </span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {userSkills.length} selected
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 overflow-visible" style={{ maxHeight: "70vh" }}>
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for skills..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="px-3 py-2 border-b border-gray-200">
              <div className="flex flex-wrap gap-2 overflow-y-auto" style={{ maxHeight: "6rem" }}>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategoryFilter(category)}
                    className={`px-2 py-1 text-xs rounded-full flex items-center ${
                      categoryFilters.includes(category)
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills List */}
            <div className="overflow-y-auto" style={{ maxHeight: "15rem" }}>
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill) => (
                  <button
                    key={skill.skill_id}
                    type="button"
                    onClick={() => handleAddSkill(skill.skill_id)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 ${
                      userSkills.some((s) => s.skill_id === skill.skill_id)
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.skill_name}</span>
                      <div className="flex items-center">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize mr-2">
                          {skill.skill_category}
                        </span>
                        {userSkills.some((s) => s.skill_id === skill.skill_id) && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No matching skills found
                </div>
              )}
            </div>

            {/* Dropdown Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}