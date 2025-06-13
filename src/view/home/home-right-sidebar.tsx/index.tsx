import { Separator } from "@/components/ui/separator";
import ListComponent from "./table-list";
import CreateProjectDialog from "@/view/home/home-right-sidebar.tsx/create-projects";

export default function HomeRightSidebar() {
  return (
    <div className="w-full max-w-[240px] hidden lg:flex min-h-10 flex-col">
      <Separator className="mb-1" />
      <ListComponent />
      <Separator className="mb-1" />
      <CreateProjectDialog />
    </div>
  );
}
