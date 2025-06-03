// components/TaskCard.tsx
import { useDrag } from "react-dnd";
import type { ITaskResponse } from "../../types";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../../apis/task/use-delete-task";
import { useQueryClient } from "@tanstack/react-query";
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

interface TaskCardProps {
  task: ITaskResponse;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const queryClient = useQueryClient();
  const ref = useRef<HTMLDivElement | null>(null);
  const deleteTaskMutate = useDeleteTask();
  const removeTask = (taskId: string) => {
    deleteTaskMutate.mutate(taskId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getTaskByStatusId", task.statusId],
        });
      },
    });
  };
  useEffect(() => {
    if (ref.current) drag(ref);
  }, [ref, drag]);
  return (
    <div
      ref={ref}
      key={task._id}
      className={cn(
        "bg-blue-50 border-2 border-blue-200 rounded-lg p-3 group hover:border-blue-300 transition-colors cursor-pointer",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <form>
          <DialogTrigger asChild>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="w-full flex items-center gap-2">
                  {task.completed && (
                    <div className="size-4 rounded-full bg-green-800 flex justify-center items-center">
                      <Check color="white" />
                    </div>
                  )}
                  <p className="flex text-base leading-relaxed">{task.title}</p>
                </div>
                {task.dueDate && (
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-sm px-1 text-gray-500",
                      task.completed && "bg-green-800 text-white"
                    )}
                  >
                    <Clock size={16} />
                    <span>{format(task.dueDate, "PPP")}</span>
                  </div>
                )}
              </div>
              <Button
                onClick={() => removeTask(task._id)}
                className="p-1.5 !bg-inherit hover:!bg-gray-300 rounded-md transition-colors !shadow-none !px-2 !border-0"
              >
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent
            showCloseButton={false}
            className="max-h-[548px] !top-[150px] left-1/2 -translate-x-1/2 !translate-y-0"
          >
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <EditTask task={task} setIsOpen={setIsOpenDialog} />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};
