// components/TaskCard.tsx
import type { ITaskResponse } from "../../types";
import { Check, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditTask from "./edit-task-card";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../../apis/task/use-delete-task";
import { useAtom } from "jotai";
import { useTaskListStore } from "@/store/project";
import { useState } from "react";

interface TaskCardProps {
  task: ITaskResponse;
  columnId: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, columnId }) => {
  const [, setColumns] = useAtom(useTaskListStore);

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const deleteTaskMutate = useDeleteTask();
  const removeTask = (columnId: string, taskId: string) => {
    setColumns((prev) =>
      prev?.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.filter((task) => task._id !== taskId),
            }
          : column
      )
    );
    deleteTaskMutate.mutate(taskId);
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <form>
        <DialogTrigger asChild>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="w-full flex items-center gap-2">
                {task?.completed && (
                  <div className="size-4 rounded-full bg-green-800 flex justify-center items-center">
                    <Check color="white" />
                  </div>
                )}
                <p className="flex text-base leading-relaxed max-w-[156px] overflow-x-auto">
                  {task?.title}
                </p>
              </div>
              {task?.dueDate && (
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-sm px-1 text-gray-500",
                    task?.completed
                      ? "bg-green-800 text-white"
                      : new Date(task.dueDate).setHours(0, 0, 0, 0) <
                        new Date().setHours(0, 0, 0, 0)
                      ? "bg-red-500 text-white"
                      : "bg-inherit"
                  )}
                >
                  <Clock size={16} />
                  <span>{format(task?.dueDate, "PPP")}</span>
                </div>
              )}
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                removeTask(columnId, task._id);
              }}
              className="opacity-0 group-hover:opacity-100 !px-2 bg-inherit hover:bg-gray-400 rounded transition-all ml-2"
            >
              <X className="w-4 h-4 text-gray-800" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="max-h-[548px] !top-[150px] left-1/2 -translate-x-1/2 !translate-y-0 overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <EditTask task={task} setIsOpen={setIsOpenDialog} />
        </DialogContent>
      </form>
    </Dialog>
  );
};
