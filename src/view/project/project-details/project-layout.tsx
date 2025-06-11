import type { ReactNode } from "react";
import { useGetProjectById } from "../apis/project/use-get-project-by-id";
import Header from "@/components/layout/header";
import ProjectHeader from "./project-header/header";

export default function ProjectDetailsLayout({
  children,
  projectId,
}: {
  children: ReactNode;
  projectId: string;
}) {
  const { data: project, isLoading } = useGetProjectById(projectId);
  if (isLoading) return;
  return (
    <div
      className={`w-full flex flex-col items-center bg-no-repeat bg-cover max-h-screen`}
      style={{
        backgroundImage: `url(${project?.image})`,
      }}
    >
      <div className="w-full bg-white flex justify-center items-center opacity-90">
        <Header />
      </div>
      <div className="w-full flex flex-row">
        <div className="size-full flex flex-col">
          <ProjectHeader project={project} />
          {children}
        </div>
      </div>
    </div>
  );
}
