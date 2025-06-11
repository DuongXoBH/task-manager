import React from "react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useFilterTask } from "@/view/project/store";

const CardStatusFilter: React.FC = () => {
  const [filters, setFilters] = useAtom(useFilterTask);
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Select Date";

    return format(new Date(date), "MMMM d, yyyy");
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Card Status</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="completed"
              checked={filters.completed === true}
              onCheckedChange={(checked) => {
                setFilters((prev) => ({
                  ...prev,
                  completed: checked ? true : undefined,
                }));
              }}
            />
            <Label
              htmlFor="completed"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Marked as completed
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="unfinished"
              checked={filters.completed === false}
              onCheckedChange={(checked) => {
                setFilters((prev) => ({
                  ...prev,
                  completed: checked ? false : undefined,
                }));
              }}
            />
            <Label
              htmlFor="unfinished"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Marked as not completed
            </Label>
          </div>
        </div>
      </div>

      <div className="w-full space-y-3 mb-3">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Expiration Date
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="isNoExpiration"
              checked={filters.isNoExpiration}
              onCheckedChange={() => {
                setFilters((prev) => ({
                  ...prev,
                  isNoExpiration: !prev.isNoExpiration,
                }));
              }}
            />
            <Label
              htmlFor="isNoExpiration"
              className="text-sm text-gray-600 cursor-pointer"
            >
              No expiration
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="isOverdue"
              checked={filters.isOverdue}
              onCheckedChange={() => {
                setFilters((prev) => ({
                  ...prev,
                  isOverdue: !prev.isOverdue,
                }));
              }}
            />
            <Label
              htmlFor="isOverdue"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Overdue tasks
            </Label>
          </div>
          <div className="w-full space-y-1">
            <Label className="text-muted-foreground text-xs">From:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.fromDate
                    ? formatDate(filters.fromDate)
                    : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.fromDate}
                  onSelect={(date) =>
                    setFilters((prev) => {
                      return { ...prev, fromDate: date };
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-full space-y-1">
            <Label className="text-muted-foreground text-xs">To:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.toDate ? formatDate(filters.toDate) : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.toDate}
                  onSelect={(date) =>
                    setFilters((prev) => {
                      return { ...prev, toDate: date };
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Button
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-700"
          onClick={() =>
            setFilters({
              completed: undefined,
              isNoExpiration: false,
              isOverdue: false,
              fromDate: undefined,
              toDate: undefined,
            })
          }
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CardStatusFilter;
