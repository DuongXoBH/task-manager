import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { ITaskResponse } from "../../types";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  updateTaskFormSchema,
  type TUpdateTaskForm,
} from "../../types/update-task";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTask } from "../../apis/task/use-update-task";
import { Input } from "@/components/ui/input";
import { AlignJustify, CalendarIcon, Clock, Loader } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import TinyEditorComponent from "./description-field";
import { useAtom } from "jotai";
import { useUserInfoStore } from "@/store/auth";
import { useTaskListStore } from "../../store";
interface IEditTaskProps {
  task: ITaskResponse;
  setIsOpen: (status: boolean) => void;
}
export default function EditTask({ task, setIsOpen }: IEditTaskProps) {
  const updateTaskMutate = useUpdateTask();
  const [auth] = useAtom(useUserInfoStore);
  const [, setColumns] = useAtom(useTaskListStore);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [description, setDescription] = useState(task.description ?? "");
  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<TUpdateTaskForm>({
    resolver: zodResolver(updateTaskFormSchema),
    defaultValues: {
      title: task.title,
      dueDate: selectedDate,
      description: task.description,
      completed: task.completed,
    },
  });

  const onSubmit = (val: TUpdateTaskForm) => {
    const updateTask: ITaskResponse = {
      _id: task._id,
      statusId: task.statusId,
      projectId: task.projectId,
      createdById: auth?._id ?? "",
      title: val.title ?? task.title,
      description: val.description,
      dueDate: val.dueDate ? new Date(val.dueDate) : null,
      completed: val.completed,
      createdAt: task.createdAt,
      updatedAt: Date.now().toString(),
    };
    setColumns((prev) =>
      prev?.map((column) => {
        if (column.id !== task.statusId) return column;

        return {
          ...column,
          tasks: column.tasks.map((item) =>
            item._id === task._id ? updateTask : item
          ),
        };
      })
    );
    updateTaskMutate.mutate(
      {
        taskId: task._id,
        payload: { ...val, dueDate: val.dueDate ? val.dueDate : null },
      },
      {
        onSuccess: () => {
          toast.success("Success");
          setIsOpen(false);
        },
      }
    );
  };

  const onSelectDate = (date: Date | undefined) => {
    if (date) {
      const createdAtDate = new Date(task.createdAt);
      const isInvalid =
        date.setHours(0, 0, 0, 0) < createdAtDate.setHours(0, 0, 0, 0);
      if (isInvalid) {
        form.setError("dueDate", {
          type: "manual",
          message: "Due date must be after the last created date.",
        });
        toast.error("Due date must be after the last created date.");
        return;
      }
    }
    form.clearErrors("dueDate");
    setSelectedDate(date);
    form.setValue("dueDate", date);
  };

  useEffect(() => {
    form.setValue("description", description);
  }, [description]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <FormField
            control={form.control}
            name="completed"
            render={() => (
              <FormItem>
                <FormControl>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Checkbox
                        className={cn(
                          "rounded-full border-gray-400",
                          form.watch("completed") && "!bg-green-800"
                        )}
                        checked={form.watch("completed") ?? false}
                        onCheckedChange={(check) => {
                          const isChecked =
                            check === "indeterminate" ? false : check;
                          form.setValue("completed", isChecked);
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {form.watch("completed")
                          ? "Mark as incomplete"
                          : "Mark as complete"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Enter task title"
                    className="w-full placeholder:text-[#697698] bg-white font-bold"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full flex flex-row gap-2">
          <Clock size={20} className="text-gray-500" />
          <div className="w-full grid-cols-1 space-y-5">
            <div className="w-full grid space-y-1">
              <Label>Start date</Label>
              <div className="w-full rounded-sm border border-gray-200 p-2 flex items-center gap-3">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">{format(task.createdAt, "PPP")}</span>
              </div>
            </div>
            <FormField
              control={form.control}
              name="dueDate"
              render={() => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="w-full grid space-y-1">
                      <Label>Due date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={onSelectDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={() => (
            <FormItem className="w-full">
              <FormControl>
                <div className="w-full grid space-y-1">
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex gap-3">
                      <AlignJustify size={20} color="gray" />
                      <Label>Description</Label>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setIsEdit(!isEdit)}
                      className="bg-gray-200 hover:bg-gray-300 text-black"
                    >
                      {isEdit ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                  {isEdit ? (
                    <TinyEditorComponent
                      initValue={task.description ?? ""}
                      setContent={setDescription}
                    />
                  ) : (
                    <div
                      onClick={() => setIsEdit(true)}
                      dangerouslySetInnerHTML={{ __html: description }}
                      className="w-full pl-8 cursor-pointer"
                    ></div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="secondary"
          disabled={updateTaskMutate.isPending}
          className="!bg-blue-500 mt-2 h-[50px] w-full rounded-[5px] text-sm font-bold text-white hover:!bg-blue-600"
        >
          {updateTaskMutate.isPending && (
            <Loader className="mr-2 animate-spin" />
          )}
          Save
        </Button>
      </form>
    </Form>
  );
}
