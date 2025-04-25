"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { id: "frontend", name: "Frontend" },
  { id: "backend", name: "Backend" },
  { id: "database", name: "Database" },
  { id: "devops", name: "DevOps" },
  { id: "mobile", name: "Mobile" },
  { id: "ai_ml", name: "Machine Learning" },
  { id: "data_science", name: "Data Science" },
  { id: "soft_skills", name: "Soft Skills" },
  { id: "other", name: "Other" }
];

export default function SkillCategoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  const handleCategoryClick = (categoryId: string) => {
    // If already selected, clear the filter, otherwise set it
    const newCategory = categoryId === currentCategory ? "" : categoryId;

    // Update URL with new category parameter
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="overflow-x-auto mb-6">
      <div className="flex space-x-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                currentCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
