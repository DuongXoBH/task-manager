import type { IProjectResponse } from "../../types";
import UserProfilePopover from "./profile-popover";
import AddMemberDialog from "./add-member-dialog";
import FilterTask from "./filter";
interface IProjectHeaderProps {
  project: IProjectResponse | undefined;
}
export default function ProjectHeader({ project }: IProjectHeaderProps) {
  if (!project) return;
  return (
    <div className="w-full h-[50px] px-3 flex justify-between items-center bg-white opacity-80">
      <span className="text-[#172B4D] text-lg font-semibold">
        {project?.name}
      </span>
      <div className="flex items-center gap-5">
        <div className="h-full flex flex-row items-center">
          {project?.memberIds.map((memberId) => {
            return (
              <UserProfilePopover
                key={`member-${memberId}`}
                userId={memberId}
                createdById={project.createdById}
              />
            );
          })}
        </div>
        <FilterTask />
        <AddMemberDialog project={project} />
      </div>
    </div>
  );
}
