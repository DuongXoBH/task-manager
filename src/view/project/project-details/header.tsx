import type { IProjectResponse } from "../types";
import UserProfilePopover from "./profile-popover";
import AddMemberDialog from "./add-member-dialog";
interface IProjectHeaderProps {
  project: IProjectResponse | undefined;
}
export default function ProjectHeader({ project }: IProjectHeaderProps) {
  return (
    <div className="w-full h-[50px] px-3 flex justify-between items-center bg-gray-100">
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
        <AddMemberDialog
          projectMembersIds={project?.memberIds ?? []}
          projectId={project?._id ?? ""}
        />
      </div>
    </div>
  );
}
