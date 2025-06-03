import { useUserInfoStore } from "@/store/auth";
import { useGetProjectByMe } from "../apis/project/use-get-project-by-me";
import ProjectCard from "./project-card";
import { useAtom } from "jotai";

export default function ProjectByMe() {
  const { data: projectList } = useGetProjectByMe();
  const [userInfo] = useAtom(useUserInfoStore);
  return (
    <div className="w-full flex flex-col space-y-5">
      <div className="w-full flex flex-col text-black gap-2 items-center">
        <span className="w-full text-lg font-medium">YOUR WORKSPACES</span>
        <span className="w-full text-base font-medium">
          {userInfo ? `${userInfo.name}'s workspace` : ""}
        </span>
      </div>
      <div className="w-full project-list">
        {projectList?.map((item) => {
          return (
            <ProjectCard
              key={`myProject-${item._id}`}
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
