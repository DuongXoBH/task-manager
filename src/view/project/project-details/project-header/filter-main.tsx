import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, AlertCircle, AlertTriangle } from "lucide-react";
import { useAtom } from "jotai";
import { useFilterTask, type IFilter } from "@/store/project";
import { Button } from "@/components/ui/button";

const CardStatusFilter: React.FC = () => {
  const [filters, setFilters] = useAtom(useFilterTask);

  const handleCardStatusChange = (key: keyof IFilter["cardStatus"]) => {
    setFilters((prev) => ({
      ...prev,
      cardStatus: {
        ...prev.cardStatus,
        [key]: !prev.cardStatus[key],
      },
    }));
  };

  const handleExpirationChange = (key: keyof IFilter["expirationDate"]) => {
    setFilters((prev) => ({
      ...prev,
      expirationDate: {
        ...prev.expirationDate,
        [key]: !prev.expirationDate[key],
      },
    }));
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Card Status</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="completed"
              checked={filters.cardStatus.completed}
              onCheckedChange={() => handleCardStatusChange("completed")}
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
              id="notCompleted"
              checked={filters.cardStatus.notCompleted}
              onCheckedChange={() => handleCardStatusChange("notCompleted")}
            />
            <Label
              htmlFor="notCompleted"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Not marked as completed
            </Label>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Expiration Date
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="noExpiration"
              checked={filters.expirationDate.noExpiration}
              onCheckedChange={() => handleExpirationChange("noExpiration")}
            />
            <Calendar className="w-4 h-4 text-gray-400" />
            <Label
              htmlFor="noExpiration"
              className="text-sm text-gray-600 cursor-pointer"
            >
              No expiration date
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="overdue"
              checked={filters.expirationDate.overdue}
              onCheckedChange={() => handleExpirationChange("overdue")}
            />
            <AlertCircle className="w-4 h-4 text-red-500" />
            <Label
              htmlFor="overdue"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Overdue
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="expiresTomorrow"
              checked={filters.expirationDate.expiresTomorrow}
              onCheckedChange={() => handleExpirationChange("expiresTomorrow")}
            />
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <Label
              htmlFor="expiresTomorrow"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Expires tomorrow
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="expiresNextWeek"
              checked={filters.expirationDate.expiresNextWeek}
              onCheckedChange={() => handleExpirationChange("expiresNextWeek")}
            />
            <Clock className="w-4 h-4 text-gray-400" />
            <Label
              htmlFor="expiresNextWeek"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Expires next week
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="expiresNextMonth"
              checked={filters.expirationDate.expiresNextMonth}
              onCheckedChange={() => handleExpirationChange("expiresNextMonth")}
            />
            <Clock className="w-4 h-4 text-gray-400" />
            <Label
              htmlFor="expiresNextMonth"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Expires next month
            </Label>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Button
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-700"
          onClick={() =>
            setFilters({
              cardStatus: {
                completed: false,
                notCompleted: false,
              },
              expirationDate: {
                noExpiration: false,
                overdue: false,
                expiresTomorrow: false,
                expiresNextWeek: false,
                expiresNextMonth: false,
              },
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
