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
import { AlignJustify, CalendarIcon, Loader } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, stripHtmlTags } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import TinyEditorComponent from "./description-field";
interface IEditTaskProps {
  task: ITaskResponse;
  setIsOpen: (status: boolean) => void;
}
export default function EditTask({ task, setIsOpen }: IEditTaskProps) {
  const queryClient = useQueryClient();
  const updateTaskMutate = useUpdateTask();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task.dueDate
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
    updateTaskMutate.mutate(
      { taskId: task._id, payload: val },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getTaskByStatusId"],
          });
          setIsOpen(false);
          setIsEdit(false);
          toast.success("Success");
        },
      }
    );
  };

  useEffect(() => {
    form.setValue("description", description);
  }, [description]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
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
                          "!text-gray-500 rounded-full",
                          form.watch("completed") && "!bg-green-800"
                        )}
                        checked={form.watch("completed")}
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
        <FormField
          control={form.control}
          name="dueDate"
          render={() => (
            <FormItem className="w-full ml-8">
              <FormControl>
                <div className="w-full grid space-y-1">
                  <Label>Due date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[calc(100%-32px)] justify-start text-left font-normal",
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
                        onSelect={(date) => {
                          setSelectedDate(date);
                          form.setValue("dueDate", date ?? undefined);
                        }}
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
                      setContent={setDescription}
                      placeholder={stripHtmlTags(task.description ?? "")}
                    />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: description }}
                      className="w-full pl-8"
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
          className="!bg-green-400 mt-2 h-[50px] w-full rounded-[5px] text-sm font-bold text-white hover:!bg-green-600"
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
