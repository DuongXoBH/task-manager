import { Clock } from "lucide-react";
import ProjectList from "./component/project-list-layout";
import { useGetRecentlyProject } from "./apis/project/use-get-recently-project";
import { useGetProjectByMe } from "./apis/project/use-get-project-by-me";
import { useGetGuestProject } from "./apis/project/use-get-guest-project";

export default function Project() {
  const { data: recentlyList, isPending: recentlyPending } =
    useGetRecentlyProject();
  const { data: projectByMeList, isPending: byMePending } = useGetProjectByMe();
  const { data: projectAsGuestList, isPending: asGuestPending } =
    useGetGuestProject();
  const recentlyProjectTitle = (
    <>
      <Clock />
      <span className="w-full text-base font-medium">Recently Viewed</span>
    </>
  );
  const projectByMeTitle = (
    <span className="w-full text-lg font-medium">YOUR WORKSPACES</span>
  );
  const projectAsGuestTitle = (
    <span className="w-full text-lg font-medium">CUSTOMER WORKSPACES</span>
  );
  return (
    <div className="w-full flex flex-col px-4 space-y-10 mt-10">
      <ProjectList
        projectKey="recently"
        title={recentlyProjectTitle}
        projectList={recentlyList}
        isPending={recentlyPending}
      />
      <ProjectList
        projectKey="my-project"
        title={projectByMeTitle}
        projectList={projectByMeList}
        isPending={byMePending}
      />
      <ProjectList
        projectKey="as-guest"
        title={projectAsGuestTitle}
        projectList={projectAsGuestList}
        isPending={asGuestPending}
      />
    </div>
  );
}
