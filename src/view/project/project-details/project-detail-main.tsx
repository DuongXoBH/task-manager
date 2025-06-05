import React, { useState, useCallback, useEffect } from "react";
import { Plus, MoreHorizontal, X, Copy } from "lucide-react";
import { useAtom } from "jotai";
import { useTaskListStore, type IColumn } from "@/store/project";
import { useGetTaskByProjectId } from "../apis/task/use-get-task-by-project-id";
import { useGetTaskStatus } from "../apis/task-status/use-get-task-status";
import type { ITaskResponse } from "../types";
import { useUserInfoStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateNewTask } from "../apis/task/use-create-task";
import type { TCreateTaskPayload } from "../types/create-task";
import { useUpdateTask } from "../apis/task/use-update-task";
import { TaskCard } from "./task-card";
import { useCreateNewTaskStatus } from "../apis/task-status/use-create-task-status";

// Simple drag and drop implementation without external libraries
// This provides the core functionality similar to react-dnd

interface IDragItem {
  type: string;
  id: string;
  columnId: string;
}

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const [auth] = useAtom(useUserInfoStore);
  const [columns, setColumns] = useAtom(useTaskListStore);

  const [newTask, setNewTask] = useState<{ [key: string]: string }>({});
  const [isAddingTask, setIsAddingTask] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [draggedItem, setDraggedItem] = useState<IDragItem | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [newColumn, setNewColumn] = useState<IColumn & { order: number }>();
  const [isAddingColummn, setIsAddingColumn] = useState(false);

  const { data: taskList } = useGetTaskByProjectId(projectId);
  const { data: statusList } = useGetTaskStatus(projectId);
  const createTaskMutate = useCreateNewTask();
  const updateTaskMutate = useUpdateTask();
  const createTaskStatusMutate = useCreateNewTaskStatus();

  const addTask = (columnId: string) => {
    const taskContent = newTask[columnId]?.trim();
    if (!taskContent) return;

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
    createTaskMutate.mutate(taskPayload, {
      onSuccess: (val: ITaskResponse) => {
        setColumns((prev) =>
          prev?.map((column) => {
            if (column.id !== val.statusId) return column;

            return {
              ...column,
              tasks: column.tasks.map((task) =>
                task.title === val.title && task.createdById === val.createdById
                  ? { ...task, _id: val._id }
                  : task
              ),
            };
          })
        );
      },
    });
    setNewTask({ ...newTask, [columnId]: "" });
    setIsAddingTask({ ...isAddingTask, [columnId]: false });
  };

  const moveTask = useCallback(
    (taskId: string, fromColumnId: string, toColumnId: string) => {
      if (fromColumnId === toColumnId) return;

      setColumns((prev) => {
        if (!prev) return prev;

        const newColumns = [...prev];
        const fromColumn = newColumns.find((col) => col.id === fromColumnId);
        const toColumn = newColumns.find((col) => col.id === toColumnId);

        if (!fromColumn || !toColumn) return prev;

        const taskToMove = fromColumn.tasks.find(
          (task: ITaskResponse) => task._id === taskId
        );
        if (!taskToMove) return prev;

        fromColumn.tasks = fromColumn.tasks.filter(
          (task) => task._id !== taskId
        );

        toColumn.tasks = [...toColumn.tasks, taskToMove];

        return newColumns;
      });
      updateTaskMutate.mutate({ taskId, payload: { statusId: toColumnId } });
    },
    []
  );

  const handleDragStart = (
    e: React.DragEvent,
    taskId: string,
    columnId: string
  ) => {
    const dragData: IDragItem = {
      type: "task",
      id: taskId,
      columnId: columnId,
    };

    setDraggedItem(dragData);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverColumn(null);
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    try {
      const dragData = JSON.parse(
        e.dataTransfer.getData("text/plain")
      ) as IDragItem;

      if (dragData.type === "task") {
        moveTask(dragData.id, dragData.columnId, targetColumnId);
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  const startAddingTask = (columnId: string) => {
    setIsAddingTask({ ...isAddingTask, [columnId]: true });
  };

  const cancelAddingTask = (columnId: string) => {
    setIsAddingTask({ ...isAddingTask, [columnId]: false });
    setNewTask({ ...newTask, [columnId]: "" });
  };

  const handleKeyPress = (e: React.KeyboardEvent, columnId: string) => {
    if (e.key === "Enter") {
      addTask(columnId);
    } else if (e.key === "Escape") {
      cancelAddingTask(columnId);
    }
  };

  useEffect(() => {
    if (!taskList || !statusList) return;

    setColumns(
      statusList.map((status) => ({
        id: status._id,
        title: status.title,
        tasks: taskList.filter((task) => task.statusId === status._id),
      }))
    );
  }, [taskList, statusList]);

  return (
    <div className="flex flex-row gap-6 mt-5 w-full">
      {columns?.map((column) => (
        <div key={column.id}>
          <div
            className={`w-[272px] bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg transition-all duration-200 ${
              dragOverColumn === column.id
                ? "ring-2 ring-blue-400 bg-blue-50/90"
                : ""
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {column.title} ({column.tasks.length})
              </h2>
              <Button className=" bg-white p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </Button>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {column.tasks
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id, column.id)}
                    onDragEnd={handleDragEnd}
                    className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 group hover:border-blue-300 transition-all cursor-pointer hover:shadow-md active:shadow-lg"
                  >
                    <TaskCard task={task} columnId={column.id} />
                  </div>
                ))}

              {/* Drop zone indicator */}
              {dragOverColumn === column.id &&
                draggedItem &&
                draggedItem.columnId !== column.id && (
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/50 text-center text-blue-600 text-sm">
                    Drop task here
                  </div>
                )}

              {/* Add Task Input */}
              {isAddingTask[column.id] && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                  <Input
                    type="text"
                    value={newTask[column.id] || ""}
                    onChange={(e) =>
                      setNewTask({ ...newTask, [column.id]: e.target.value })
                    }
                    onKeyDown={(e) => handleKeyPress(e, column.id)}
                    placeholder="type your title"
                    className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-3">
                    <Button
                      onClick={() => addTask(column.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      Add task
                    </Button>
                    <Button
                      onClick={() => cancelAddingTask(column.id)}
                      className="p-1.5 bg-inherit hover:bg-gray-300 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Add Task Button */}
            {!isAddingTask[column.id] && (
              <Button
                onClick={() => startAddingTask(column.id)}
                className="w-full mt-4 flex items-center gap-2 p-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors group"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add task</span>
                <Copy className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            )}
          </div>
        </div>
      ))}
      {isAddingColummn && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg w-[272px] h-[136px]">
          <Input
            type="text"
            onChange={(e) =>
              setNewColumn({
                id: "new-column",
                title: e.target.value,
                tasks: [],
                order: columns?.length ?? 0,
              })
            }
            placeholder="Fill your status's title"
            className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
            autoFocus
          />
          <div className="flex items-center justify-between gap-2 mt-3">
            <Button
              type="button"
              onClick={() => {
                if (newColumn)
                  setColumns((prev) => {
                    return prev ? [...prev, newColumn] : [];
                  });
                setNewColumn(undefined);
                setIsAddingColumn(false);
                createTaskStatusMutate.mutate(
                  {
                    title: newColumn?.title ?? "",
                    order: newColumn?.order ?? 0,
                    projectId,
                  },
                  {
                    onSuccess: (val) => {
                      setColumns((prev) =>
                        prev?.map((column) => {
                          if (column.id !== "new-column") return column;

                          return {
                            ...column,
                            id: val._id,
                          };
                        })
                      );
                    },
                    onError: () => {
                      setColumns((prev) =>
                        prev?.filter((column) => {
                          return column.id !== "new-column";
                        })
                      );
                    },
                  }
                );
              }}
              className="!bg-blue-500 hover:!bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Add task status
            </Button>
            <Button
              type="button"
              onClick={() => setIsAddingColumn(false)}
              className="p-1.5 !bg-inherit hover:!bg-gray-300 rounded-md transition-colors !shadow-none !px-2 !border-0"
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>
      )}
      {!isAddingColummn && (
        <Button
          onClick={() => setIsAddingColumn(true)}
          className="flex items-center gap-2 p-3 text-gray-600 !bg-gray-50 hover:!bg-gray-300 rounded-lg transition-colors group w-[272px]"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add task status</span>
        </Button>
      )}
    </div>
  );
}
