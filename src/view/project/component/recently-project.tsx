import { Clock } from "lucide-react";
import { useGetRecentlyProject } from "../apis/project/use-get-recently-project";
import ProjectCard from "./project-card";

export default function RecentlyProject() {
  const { data: recentlyList } = useGetRecentlyProject();
  return (
    <div className="w-full flex flex-col space-y-5">
      <div className="w-full flex flex-row text-xs text-black gap-2 items-center">
        <Clock />
        <span className="w-full text-base font-medium">Recently Viewed</span>
      </div>
      <div className="w-full project-list">
        {recentlyList?.map((item) => {
          return (
            <ProjectCard
              key={`recently-${item._id}`}
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
