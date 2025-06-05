import { Icons } from "@/assets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inbox, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema, type TCreateProjectForm } from "../types/create-project";
import { useCreateNewProject } from "../apis/project/use-create-project";
import { useAtom } from "jotai";
import { useUserInfoStore } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";
import AddMemberToProject from "./add-member";
import ImageUpload from "@/components/layout/image-upload";
import { useState } from "react";
import { toast } from "react-toastify";
export default function CreateProjectDialog() {
  const [userInfo] = useAtom(useUserInfoStore);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<TCreateProjectForm>({
    resolver: zodResolver(formSchema),
  });
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["getRecentlyProject"] });
    queryClient.invalidateQueries({ queryKey: ["getGuestProject"] });
    queryClient.invalidateQueries({ queryKey: ["getProjectByMe"] });
    toast.success("Create project successful");
    setIsOpen(false);
  };
  const { mutate, isPending } = useCreateNewProject(onSuccess);

  const onSubmit = (val: TCreateProjectForm) => {
    const data = { ...val, createdById: userInfo?._id ?? "" };
    mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center justify-start space-x-3 p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-150 text-gray-700">
          <div className="flex items-center justify-center w-6 h-6">
            <Icons.plus />
          </div>
          <span className="text-sm font-medium">Create Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <div className="w-full !overflow-auto max-h-[528px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-md space-y-10"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-5 w-full">
                    <FormLabel className="text-sm leading-[18px] font-semibold">
                      Name<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <div
                        className={cn(
                          "relative flex h-[50px] w-full items-center rounded-xs",
                          form.watch("name") ? "text-black" : "text-[#697698]"
                        )}
                      >
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                          <Inbox />
                        </div>
                        <Input
                          placeholder="Enter email address"
                          className="h-[50px] pl-16 placeholder:text-[#697698]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <ImageUpload
                setAvatar={(images: string) => form.setValue("images", images)}
              />
              <AddMemberToProject />

              <Button
                variant={"secondary"}
                disabled={isPending}
                className="!bg-blue-500 mt-2 h-[50px] w-full rounded-[5px] text-sm font-bold text-white hover:!bg-blue-600"
              >
                {isPending && <Loader className="animate-spin" />}
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
