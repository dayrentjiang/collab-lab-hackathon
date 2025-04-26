// __tests__/createUser.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createUser } from "../actions/user"; // Adjust path as needed

describe("createUser function (logging version)", () => {
  // Spy on console.log
  beforeEach(() => {
    vi.spyOn(console, "log");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should correctly separate userData and selected_skills", async () => {
    // Sample user data for testing
    const mockFormData = {
      user_name: "Test User",
      user_email: "test@example.com",
      user_clerk_id: "clerk_123",
      user_role: "student",
      user_bio: "Test bio",
      user_university: "Test University",
      has_completed_personalized: true,
      selected_skills: [1, 2, 3] // These should be logged separately
    };

    // Call the function
    await createUser(mockFormData);

    // Check that console.log was called with the correct arguments
    expect(console.log).toHaveBeenCalledTimes(2);

    // First call should log userData (without selected_skills)
    expect(console.log).toHaveBeenNthCalledWith(1, "userData", {
      user_name: "Test User",
      user_email: "test@example.com",
      user_clerk_id: "clerk_123",
      user_role: "student",
      user_bio: "Test bio",
      user_university: "Test University",
      has_completed_personalized: true
    });

    // Second call should log selected_skills array
    expect(console.log).toHaveBeenNthCalledWith(
      2,
      "selected_skills",
      [1, 2, 3]
    );
  });

  it("should handle empty selected_skills", async () => {
    // User data without selected_skills
    const mockFormData = {
      user_name: "Another User",
      user_email: "another@example.com",
      user_clerk_id: "clerk_456",
      user_role: "student",
      user_bio: "",
      user_university: "",
      has_completed_personalized: false,
      selected_skills: [] // Empty array
    };

    // Call the function
    await createUser(mockFormData);

    // Check logs
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(2, "selected_skills", []);
  });

  it("should handle undefined selected_skills", async () => {
    // User data without selected_skills property
    const mockFormData = {
      user_name: "Third User",
      user_email: "third@example.com",
      user_clerk_id: "clerk_789",
      user_role: "mentor",
      has_completed_personalized: true
    };

    // Call the function with cast to any to allow missing fields for test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await createUser(mockFormData as any);

    // Check logs
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(
      2,
      "selected_skills",
      undefined
    );
  });
});
