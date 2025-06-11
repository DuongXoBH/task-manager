import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAtom } from "jotai";
import { useGetTaskByProjectId } from "../apis/task/use-get-task-by-project-id";
import { useGetTaskStatus } from "../apis/task-status/use-get-task-status";
import type { ITaskResponse } from "../types";
import { Button } from "@/components/ui/button";
import { useUpdateTask } from "../apis/task/use-update-task";
import { TaskCard } from "./task-card";
import { useTaskListStore } from "../store";
import ProjectDetailsLayout from "./project-layout";
import { useParams } from "@tanstack/react-router";
import AddTaskComponent from "./component/add-task-to-project";
import ProjectLoading from "@/components/layout/project-loading";
import AddColumnToProject from "./component/add-column-to-project";

interface IDragItem {
  type: string;
  id: string;
  columnId: string;
}

export default function ProjectDetails() {
  const { projectId } = useParams({
    from: "/_authenticated/project/$projectId",
  });
  const [columns, setColumns] = useAtom(useTaskListStore);
  const [isAddingTask, setIsAddingTask] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [draggedItem, setDraggedItem] = useState<IDragItem | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const { data: taskList, isLoading: isTaskLoading } =
    useGetTaskByProjectId(projectId);
  const { data: statusList, isLoading: isColumnLoading } =
    useGetTaskStatus(projectId);
  const updateTaskMutate = useUpdateTask();

  const moveTask = (
    taskId: string,
    fromColumnId: string,
    toColumnId: string
  ) => {
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

      fromColumn.tasks = fromColumn.tasks.filter((task) => task._id !== taskId);

      toColumn.tasks = [
        ...toColumn.tasks,
        { ...taskToMove, statusId: toColumnId },
      ];

      return newColumns;
    });
    updateTaskMutate.mutate({ taskId, payload: { statusId: toColumnId } });
  };

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
    <ProjectDetailsLayout projectId={projectId}>
      {isTaskLoading || isColumnLoading ? (
        <ProjectLoading />
      ) : (
        <div className="flex flex-row gap-6 mt-5 w-full px-3 max-w-screen overflow-x-auto min-h-[calc(100vh-128px)]">
          {columns?.map((column) => (
            <div key={column.id}>
              <div
                className={`w-[272px] max-h-[calc(100vh-142px)] overflow-y-auto bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg transition-all duration-200 ${
                  dragOverColumn === column.id
                    ? "ring-2 ring-blue-400 bg-blue-50/90"
                    : ""
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {column.title} ({column.tasks.length})
                  </h2>
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
                        onDragStart={(e) =>
                          handleDragStart(e, task._id, column.id)
                        }
                        onDragEnd={handleDragEnd}
                        className="bg-white border-2 border-blue-400 rounded-lg p-3 group hover:border-blue-600 transition-all cursor-pointer shadow-sm hover:shadow-md active:shadow-lg"
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
                  {isAddingTask[column.id] ? (
                    <AddTaskComponent
                      projectId={projectId}
                      columnId={column.id}
                      setIsAddingTask={(status) =>
                        setIsAddingTask((prev) => {
                          return { ...prev, [column.id]: status };
                        })
                      }
                    />
                  ) : (
                    <Button
                      onClick={() =>
                        setIsAddingTask((prev) => {
                          return { ...prev, [column.id]: true };
                        })
                      }
                      className="w-full mt-4 flex items-center justify-start gap-2 p-3 bg-gray-200 hover:bg-gray-400 rounded-lg transition-colors group shadow-none"
                    >
                      <Plus className="w-4 h-4" color="black" />
                      <span className="text-sm font-medium text-black">
                        Add task
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isAddingColumn ? (
            <AddColumnToProject
              projectId={projectId}
              setIsAddingColumn={setIsAddingColumn}
            />
          ) : (
            <Button
              onClick={() => setIsAddingColumn(true)}
              className="flex items-center gap-2 p-3 text-gray-600 !bg-gray-50 hover:!bg-gray-300 rounded-lg transition-colors group w-[272px]"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add another list</span>
            </Button>
          )}
        </div>
      )}
    </ProjectDetailsLayout>
  );
}
