import { useParams } from "@tanstack/react-router";
import { useGetProjectById } from "../apis/project/use-get-project-by-id";
import ProjectHeader from "./project-header/header";
import Header from "@/components/layout/header";
import KanbanBoard from "./project-detail-main";

export default function ProjectDetails() {
  const { projectId } = useParams({
    from: "/_authenticated/project/$projectId",
  });
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
      <ProjectHeader project={project} />
      <KanbanBoard projectId={projectId} />
    </div>
  );
}
