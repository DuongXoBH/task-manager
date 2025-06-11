import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useUserInfoStore } from "@/store/auth";
import { useTaskListStore } from "../../store";
import type { ITaskResponse } from "../../types";
import { useCreateNewTask } from "../../apis/task/use-create-task";
import type { TCreateTaskPayload } from "../../types/create-task";
import { useState } from "react";

interface IAddTaskComponentProps {
  projectId: string;
  columnId: string;
  setIsAddingTask: (status: boolean) => void;
}

export default function AddTaskComponent({
  projectId,
  columnId,
  setIsAddingTask,
}: IAddTaskComponentProps) {
  const [auth] = useAtom(useUserInfoStore);
  const [columns, setColumns] = useAtom(useTaskListStore);
  const [newTask, setNewTask] = useState<string>();

  const onSuccess = (val: ITaskResponse) => {
    setColumns((prev) =>
      prev?.map((column) => {
        if (column.id !== val.statusId) return column;

        return {
          ...column,
          tasks: column.tasks.map((task) =>
            task.title === val.title && task.createdById === val.createdById
              ? {
                  ...task,
                  _id: val._id,
                  createdAt: val.createdAt,
                  updatedAt: val.updatedAt,
                }
              : task
          ),
        };
      })
    );
  };
  const createTaskMutate = useCreateNewTask(onSuccess);

  const addTask = (columnId: string) => {
    const taskContent = newTask?.trim();
    if (!taskContent) return;

    const isDuplicate = columns?.some((column) =>
      column.tasks.some(
        (task) =>
          task.title.toLowerCase().trim() === taskContent.toLowerCase().trim()
      )
    );
    if (isDuplicate) {
      toast.error("This task title already exists.");
      return;
    }

    const newTaskObj: ITaskResponse = {
      _id: Date.now().toString(),
      title: taskContent,
      statusId: columnId,
      projectId: projectId,
      createdById: auth?._id ?? "",
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    };

    setColumns((prev) => {
      return prev?.map((column) =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTaskObj] }
          : column
      );
    });

    const taskPayload: TCreateTaskPayload = {
      title: newTaskObj.title,
      statusId: newTaskObj.statusId,
      projectId: newTaskObj.projectId,
      createdById: newTaskObj.createdById,
      description: newTaskObj.description,
      dueDate: newTaskObj.dueDate
        ? newTaskObj.dueDate.toISOString()
        : undefined,
    };
    createTaskMutate.mutate(taskPayload);
    setNewTask("");
    setIsAddingTask(false);
  };
  const cancelAddingTask = () => {
    setIsAddingTask(false);
    setNewTask("");
  };
  const handleKeyPressAtTask = (e: React.KeyboardEvent, columnId: string) => {
    if (e.key === "Enter") {
      addTask(columnId);
    } else if (e.key === "Escape") {
      cancelAddingTask();
    }
  };
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
      <Input
        type="text"
        value={newTask || ""}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={(e) => handleKeyPressAtTask(e, columnId)}
        placeholder="Type your task title"
        className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
        autoFocus
      />
      <div className="flex items-center justify-between mt-3">
        <Button
          onClick={() => addTask(columnId)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          Add task
        </Button>
        <Button
          onClick={() => cancelAddingTask()}
          className="p-1.5 bg-inherit hover:bg-gray-300 rounded-md transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
}
