import { useUserInfoStore } from "@/store/auth";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import {
  editFormSchema,
  type TUpdateForm,
  type TUpdateMePayload,
} from "../types/edit-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateMe } from "../apis/use-update-me";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/layout/image-upload";
import { cn } from "@/lib/utils";
import { Icons } from "@/assets";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function EditProfile({
  setIsEdit,
}: {
  setIsEdit: (open: boolean) => void;
}) {
  const [userInfo] = useAtom(useUserInfoStore);
  const [isDisable, setIsDisable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const queryClient = useQueryClient();
  const onSuccess = () => {
    queryClient.refetchQueries({ queryKey: ["getMe"] });
    queryClient.refetchQueries({ queryKey: ["getUsers"] });
    queryClient.refetchQueries({ queryKey: ["getUserById"] });
    setIsEdit(false);
    toast.success("Update successful");
  };
  const updateMeMutation = useUpdateMe(onSuccess);
  const form = useForm<TUpdateForm>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: userInfo?.name,
      email: userInfo?.email,
    },
  });

  const onSubmit = (val: TUpdateForm) => {
    const data: TUpdateMePayload = {
      name: val.name,
      email: val.email,
      password: val.password || "",
      avatar: val.avatar || undefined,
    };
    updateMeMutation.mutate(data);
  };
  return (
    <div className=" flex w-full flex-col space-y-5 px-12">
      <Form {...form}>
        <form
          onChange={() => setIsDisable(false)}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center gap-4"
        >
          <ImageUpload
            type="avatar"
            defaultImage={userInfo?.avatar}
            setAvatar={(imageUrl) => form.setValue("avatar", imageUrl)}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base leading-[18px] font-semibold">
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
                      <Icons.user />
                    </div>
                    <Input
                      placeholder="Enter your name"
                      className="h-[50px] pl-16 placeholder:text-[#697698] bg-white"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base leading-[18px] font-semibold">
                  Email<span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      "relative flex h-[50px] w-full items-center rounded-xs",
                      form.watch("email") ? "text-black" : "text-[#697698]"
                    )}
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-black">
                      <Icons.mail />
                    </div>
                    <Input
                      placeholder="Enter email address"
                      className="h-[50px] pl-16 placeholder:text-[#697698] bg-white"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm leading-[18px] font-semibold text-black">
                  Password
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      "relative flex h-[50px] w-full items-center rounded-xs",
                      form.watch("password") ? "text-black" : "text-[#697698]"
                    )}
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                      <Icons.lock />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className={cn(
                        "h-[50px] border-1 pl-15 text-sm font-medium placeholder:text-[#697698]",
                        form.watch("password")
                          ? "border-secondary"
                          : "border-[#D1D8EB]"
                      )}
                      {...field}
                    />
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 top-2 right-1 flex items-center rounded-md !bg-white pr-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-6 w-6 text-gray-400" />
                      ) : (
                        <Eye className="h-6 w-6 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm leading-[18px] font-semibold text-black">
                  Confirm Password
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      "relative flex h-[50px] w-full items-center rounded-xs",
                      form.watch("confirm") ? "text-black" : "text-[#697698]"
                    )}
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                      <Icons.lock />
                    </div>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter confirm password"
                      className={cn(
                        "h-[50px] border-1 pl-15 text-sm font-medium placeholder:text-[#697698]",
                        form.watch("confirm")
                          ? "border-secondary"
                          : "border-[#D1D8EB]"
                      )}
                      {...field}
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 top-2 right-1 flex items-center rounded-md !bg-white pr-3"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-6 w-6 text-gray-400" />
                      ) : (
                        <Eye className="h-6 w-6 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isDisable}
            variant={"secondary"}
            className="bg-blue-500 mt-[30px] h-[50px] w-full rounded-[5px] text-sm font-bold text-gray-100 hover:bg-blue-600 hover:text-white"
          >
            {updateMeMutation.isPending ? (
              <>
                <Loader className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
