import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="w-full lg:max-w-3xl relative bg-inherit dark:bg-white dark:text-black">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
        <SearchIcon className="dark:text-black" />
      </div>
      <Input
        placeholder="Search"
        className="h-10 pl-16 border border-gray-400"
      />
    </div>
  );
}
