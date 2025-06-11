import { Clock } from "lucide-react";
import ListComponent from "./table-list";
import CreateProjectDialog from "@/view/project/create-project/create-projects";

export default function HomeRightSidebar() {
  return (
    <div className="w-full max-w-[240px] hidden lg:flex min-h-10 flex-col">
      <div className="w-full flex flex-row text-xs text-gray-400 gap-2 items-center mx-4">
        <Clock />
        <span className="w-full">Recently</span>
      </div>
      <ListComponent />
      <CreateProjectDialog />
    </div>
  );
}
