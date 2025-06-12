import { Button } from "../ui/button";

export function TeamSwitcher() {
  return (
    <Button className="!bg-inherit text-black shadow-none">
      <div className=" flex aspect-square size-8 items-center justify-center rounded-lg">
        <img src="/vite.svg" alt="" className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">Task Manager</span>
      </div>
    </Button>
  );
}
