import { Clock } from "lucide-react";
import ListComponent from "./table-list";
import CreateTable from "./new-table-dialog";

export default function HomeRightSidebar() {
  return (
    <div className="w-full max-w-0 lg:max-w-[240px] min-h-10 flex flex-col">
      <div className="w-full flex flex-row text-xs text-gray-400 gap-2 items-center mx-4">
        <Clock />
        <span className="w-full">Recently</span>
      </div>
      <ListComponent />
      <CreateTable />
    </div>
  );
}
