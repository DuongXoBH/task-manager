import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ListFilter } from "lucide-react";
import { useEffect, useState } from "react";
import CardStatusFilter from "./filter-main";

export default function FilterTask() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        (target as HTMLElement).isContentEditable;

      if (isInputField) return;
      if (e.key === "f" || (e.shiftKey && e.key === "f")) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="!p-0 border border-gray-500">
          <div className="relative w-8 h-6 group flex justify-center items-center">
            <ListFilter className="w-full dark:text-black" />
            <div
              className="absolute left-1/2 -translate-x-1/2 top-8 mb-2 hidden group-hover:block
              bg-gray-800 text-white text-sm rounded px-3 py-1 whitespace-nowrap z-10"
            >
              Filter by{" "}
              <span className="px-2 py-0.5 bg-white text-gray-800 rounded-">
                F
              </span>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h3 className="w-full text-center py-1 text-gray-600">Filter</h3>
        <CardStatusFilter />
      </PopoverContent>
    </Popover>
  );
}
