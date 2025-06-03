import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useGetTaskStatus } from "../apis/task-status/use-get-task-status";
import TaskStatusCard from "./status-card";
import { useUpdateTask } from "../apis/task/use-update-task";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCreateNewTaskStatus } from "../apis/task-status/use-create-task-status";
import { useState } from "react";
import type { TCreateTaskStatusPayload } from "../types/create-task-status";

export default function DetailsMain({ projectId }: { projectId: string }) {
  const [newTaskStatus, setNewTaskStatus] =
    useState<TCreateTaskStatusPayload>();
  const [isAddingTaskStatus, setIsAddingTaskStatus] = useState(false);
  const { data: taskStatusList } = useGetTaskStatus(projectId);
  const queryClient = useQueryClient();
  const updateTaskMutate = useUpdateTask();
  const createTaskStatusMutate = useCreateNewTaskStatus();
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (newTaskStatus)
        createTaskStatusMutate.mutate(newTaskStatus, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["getTaskStatus", projectId],
            });
            setIsAddingTaskStatus(false);
          },
        });
    } else if (e.key === "Escape") {
      setIsAddingTaskStatus(false);
    }
  };
  const handleDropTask = (taskId: string, toStatusId: string) => {
    updateTaskMutate.mutate(
      { taskId, payload: { statusId: toStatusId } },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({
            queryKey: ["getTaskByStatusId"],
          }),
      }
    );
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-6 ">
        <div className="w-full flex flex-row gap-3">
          {taskStatusList?.map((status) => {
            return (
              <div key={`status-${status._id}`} className="">
                <TaskStatusCard
                  statusId={status._id}
                  onDropTask={handleDropTask}
                />
              </div>
            );
          })}
          {isAddingTaskStatus && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg w-[272px] h-[136px]">
              <Input
                type="text"
                onChange={(e) =>
                  setNewTaskStatus({
                    projectId,
                    title: e.target.value,
                    order: taskStatusList?.length ?? 0,
                  })
                }
                onKeyDown={(e) => handleKeyPress(e)}
                placeholder="Fill your status's title"
                className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
                autoFocus
              />
              <div className="flex items-center justify-between gap-2 mt-3">
                <Button
                  type="button"
                  onClick={() => {
                    if (newTaskStatus)
                      createTaskStatusMutate.mutate(newTaskStatus, {
                        onSuccess: () => {
                          queryClient.invalidateQueries({
                            queryKey: ["getTaskStatus", projectId],
                          });
                        },
                      });
                  }}
                  className="!bg-blue-500 hover:!bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Add task status
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsAddingTaskStatus(false)}
                  className="p-1.5 !bg-inherit hover:!bg-gray-300 rounded-md transition-colors !shadow-none !px-2 !border-0"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>
          )}
          {!isAddingTaskStatus && (
            <Button
              onClick={() => setIsAddingTaskStatus(true)}
              className="flex items-center gap-2 p-3 text-gray-600 !bg-gray-50 hover:!bg-gray-300 rounded-lg transition-colors group w-[272px]"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add task status</span>
            </Button>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
