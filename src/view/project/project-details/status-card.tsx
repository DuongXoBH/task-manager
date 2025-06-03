import { Copy, Loader, MoreHorizontal, Plus, X } from "lucide-react";
import { useGetTaskStatusById } from "../apis/task-status/use-get-task-status-by-id.ts";
import { useGetTaskByStatusId } from "../apis/task/use-get-task-by-status-id.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useUserInfoStore } from "@/store/auth";
import type { TCreateTaskPayload } from "../types/create-task";
import { useCreateNewTask } from "../apis/task/use-create-task.ts";
import { useQueryClient } from "@tanstack/react-query";
import { TaskCard } from "./task-card/index.tsx";
import { useDrop } from "react-dnd";

interface ITaskStatusCardProps {
  statusId: string;
  onDropTask: (taskId: string, toStatusId: string) => void;
}

export default function TaskStatusCard({
  statusId,
  onDropTask,
}: ITaskStatusCardProps) {
  const { data: taskStatus } = useGetTaskStatusById(statusId);
  const { data: tasks } = useGetTaskByStatusId(statusId);
  const [newTask, setNewTask] = useState<TCreateTaskPayload>();
  const [userInfo] = useAtom(useUserInfoStore);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const createTaskMutate = useCreateNewTask(() => {
    queryClient.invalidateQueries({
      queryKey: ["getTaskByStatusId", statusId],
    });
    setIsAddingTask(false);
  });

  const addTask = () => {
    if (newTask) createTaskMutate.mutate(newTask);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    } else if (e.key === "Escape") {
      setIsAddingTask(false);
    }
  };

  const [, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: string }) => {
      onDropTask(item.id, statusId);
    },
  }));
  useEffect(() => {
    if (ref.current) drop(ref);
  }, [ref, drop]);

  if (!userInfo?._id) {
    return (
      <div className="flex size-full flex-col items-center justify-center xl:min-h-[60vh]">
        <Loader className="size-30 animate-spin" />
        Loading
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg w-[272px]"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {taskStatus?.title}
        </h2>
        <Button
          type="button"
          className="p-1 bg-white hover:bg-gray-100 rounded-lg transition-colors !px-2"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </Button>
      </div>
      <div className="space-y-3">
        {tasks?.map((task) => (
          <TaskCard key={`task-${task._id}`} task={task} />
        ))}

        {/* Add Task Input */}
        {isAddingTask && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
            <Input
              type="text"
              onChange={(e) =>
                setNewTask({
                  projectId: taskStatus?.projectId ?? "",
                  statusId,
                  title: e.target.value,
                  createdById: userInfo?._id,
                })
              }
              onKeyDown={(e) => handleKeyPress(e)}
              placeholder="Fill your task's title"
              className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
              autoFocus
            />
            <div className="flex items-center justify-between gap-2 mt-3">
              <Button
                type="button"
                onClick={() => {
                  if (newTask) createTaskMutate.mutate(newTask);
                }}
                className="!bg-blue-500 hover:!bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                Add task
              </Button>
              <Button
                onClick={() => setIsAddingTask(false)}
                className="p-1.5 !bg-inherit hover:!bg-gray-300 rounded-md transition-colors !shadow-none !px-2 !border-0"
              >
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Add Task Button */}
      <Button
        variant="default"
        onClick={() => setIsAddingTask(true)}
        className="w-full mt-4 flex items-center gap-2 p-3 text-white bg-blue-500 hover:!bg-blue-600 rounded-lg transition-colors group"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add task</span>
        <Copy className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    </div>
  );
}
