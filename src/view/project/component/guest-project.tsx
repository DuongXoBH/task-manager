import { useGetGuestProject } from "../apis/project/use-get-guest-project";
import ProjectCard from "./project-card";

export default function GuestProject() {
  const { data: projectList } = useGetGuestProject();
  return (
    <div className="w-full flex flex-col space-y-5">
      <div className="w-full flex flex-col text-black gap-2 items-center">
        <span className="w-full text-lg font-medium">CUSTOMER WORKSPACES</span>
      </div>
      <div className="w-full project-list">
        {projectList?.map((item) => {
          return (
            <ProjectCard
              key={`guestProject-${item._id}`}
              name={item.name}
              image={item.image ?? ""}
              projectId={item._id}
            />
          );
        })}
      </div>
    </div>
  );
}
