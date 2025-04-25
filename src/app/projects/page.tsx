// app/projects/page.tsx
import ProjectPage from "../components/project-page/ProjectPage";
import { auth } from "@clerk/nextjs/server";

const Page = async () => {
  const { userId } = await auth();

  if (!userId) return <div>You must be logged in to view your projects.</div>;

  return (
    <div className="">
      <ProjectPage userId={userId} />
    </div>
  );
};

export default Page;
