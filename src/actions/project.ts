//fetch to /api/skills/route.ts
export const getAvailableSkills = async () => {
  try {
    const response = await fetch(`/api/skills`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch skills");
    }
    const skills = await response.json();
    return skills;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return error;
  }
};

//create project
//we will create[]= the project and then create the project_skills
