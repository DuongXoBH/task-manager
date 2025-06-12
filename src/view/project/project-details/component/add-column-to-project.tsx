import { Input } from "@/components/ui/input";
import { useTaskListStore, type IColumn } from "../../store";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import type { ITaskStatusResponse } from "../../types";
import { useCreateNewTaskStatus } from "../../apis/task-status/use-create-task-status";
import { useState } from "react";
type TNewColumn = IColumn & { order: number };
interface IAddColumnToProjectProps {
  projectId: string;
  setIsAddingColumn: (status: boolean) => void;
}

export default function AddColumnToProject({
  projectId,
  setIsAddingColumn,
}: IAddColumnToProjectProps) {
  const [columns, setColumns] = useAtom(useTaskListStore);
  const [newColumn, setNewColumn] = useState<TNewColumn>();

  const onSuccess = (val: ITaskStatusResponse) => {
    setColumns((prev) =>
      prev?.map((column) => {
        if (column.id !== "new-column") return column;

        return {
          ...column,
          id: val._id,
        };
      })
    );
  };
  const createTaskStatusMutate = useCreateNewTaskStatus(onSuccess);
  const addColumn = () => {
    if (!newColumn?.title) return;
    const isDuplicate = columns?.some(
      (column) =>
        column.title.toLowerCase().trim() ===
        newColumn.title.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast.error("The column already exists");
      return;
    }

    setColumns((prev) => {
      return prev ? [...prev, newColumn] : [];
    });

    createTaskStatusMutate.mutate(
      {
        title: newColumn?.title ?? "",
        order: newColumn?.order ?? 0,
        projectId,
      },
      {
        onError: () => {
          setColumns((prev) =>
            prev?.filter((column) => {
              return column.id !== "new-column";
            })
          );
        },
      }
    );
    setNewColumn(undefined);
    setIsAddingColumn(false);
  };
  const cancelAddingColumn = () => {
    setIsAddingColumn(false);
    setNewColumn(undefined);
  };
  const handleKeyPressAtColumn = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addColumn();
    } else if (e.key === "Escape") {
      cancelAddingColumn();
    }
  };
  return (
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
        onKeyDown={handleKeyPressAtColumn}
        placeholder="Fill your status's title"
        className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
        autoFocus
      />
      <div className="flex items-center justify-between gap-2 mt-3">
        <Button
          type="button"
          onClick={() => addColumn()}
          className="!bg-blue-500 hover:!bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          Add list
        </Button>
        <Button
          type="button"
          onClick={cancelAddingColumn}
          className="p-1.5 !bg-inherit hover:!bg-gray-300 rounded-md transition-colors !shadow-none !px-2 !border-0"
        >
          <X className="w-4 h-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
}
