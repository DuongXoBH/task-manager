import type { ReactNode } from "@tanstack/react-router";
import type { IProjectResponse } from "../types";
import ProjectCard from "./project-card";
import ProjectListLoading from "./project-list-loading";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface IProjectListProps {
  projectKey: string;
  title: ReactNode;
  projectList: IProjectResponse[] | undefined;
  isPending: boolean;
}
export default function ProjectList({
  projectKey,
  title,
  projectList,
  isPending,
}: IProjectListProps) {
  const [visibleCount, setVisibleCount] = useState(7);
  if (!projectList) return;
  return (
    <div className="w-full flex flex-col space-y-5">
      <div className="w-full flex flex-row text-xs text-black gap-2 items-center">
        {title}
      </div>
      <div className="w-full project-list">
        {isPending ? (
          <ProjectListLoading projectKey={projectKey} />
        ) : (
          projectList?.slice(0, visibleCount).map((item) => {
            return (
              <ProjectCard
                key={`${projectKey}-${item._id}`}
                name={item.name}
                image={item.image ?? ""}
                projectId={item._id}
              />
            );
          })
        )}
        {projectList?.length > visibleCount && (
          <Button
            type="button"
            className="w-full h-[152px] rounded-sm shadow-sm flex justify-center items-center"
            onClick={() => setVisibleCount((prev) => prev + 4)}
          >
            More
          </Button>
        )}
      </div>
    </div>
  );
}
