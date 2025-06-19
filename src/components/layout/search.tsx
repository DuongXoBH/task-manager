import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { useGetProjectByMe } from "@/view/project/apis/project/use-get-project-by-me";
import { Link } from "@tanstack/react-router";

export default function Search() {
  const [open, setOpen] = useState(false);
  const { data: projectListByMe } = useGetProjectByMe();
  const { data: projectListAsGuest } = useGetProjectByMe();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <div className="w-full lg:max-w-3xl relative dark:bg-white dark:text-black">
      <Button
        type="button"
        className="w-full !bg-inherit shadow-none pl-5 flex items-center"
        onClick={() => setOpen(!open)}
      >
        <div className="pointer-events-none absolute inset-y-5 left-10 flex items-center -translate-y-0.5">
          <SearchIcon className="text-gray-600" />
        </div>
        <Input
          disabled
          placeholder="Search project"
          className="h-10 pl-12 border !border-gray-500 placeholder:!text-gray-800 relative"
        />
        <span className="px-2 py-0.5 bg-white text-gray-600 border border-gray-500 rounded-xs absolute right-18">
          Ctrl
        </span>
        <span className="px-2 py-0.5 bg-white text-gray-600 border border-gray-500 rounded-xs absolute right-10">
          K
        </span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="!max-w-xl w-full"
      >
        <CommandInput placeholder="Search by project's name" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="My Projects">
            {projectListByMe?.map((project) => (
              <CommandItem key={`by-me-${project._id}`}>
                <Link
                  to="/project/$projectId"
                  params={{ projectId: project._id }}
                  className="w-full flex flex-col"
                >
                  <span className="w-full text-sm font-medium">
                    {project.name}
                  </span>
                  <span className="w-full text-xs font-normal">
                    {project.createdById}
                  </span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Another project">
            {projectListAsGuest?.map((project) => (
              <CommandItem key={`as-guest-${project._id}`}>
                <Link
                  to="/project/$projectId"
                  params={{ projectId: project._id }}
                  className="w-full flex flex-col"
                >
                  <span className="w-full text-sm font-medium">
                    {project.name}
                  </span>
                  <span className="w-full text-xs font-normal">
                    {project.createdById}
                  </span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
