import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="w-full mt-2 mb-5 lg:max-w-3xl relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
        <SearchIcon className="" />
      </div>
      <Input placeholder="Search" className="h-10 pl-16 " />
    </div>
  );
}
