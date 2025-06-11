import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader, Lock, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  formSchema,
  type TRegisterForm,
  type TRegisterPayload,
} from "../types/register";
import AuthLayout from "../layout";
import { useRegister } from "../apis/use-create-new-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

export function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const form = useForm<TRegisterForm>({
    resolver: zodResolver(formSchema),
  });

  const backURL = new URLSearchParams(location.search).get("backUrl");

  const { mutate, isPending } = useRegister();

  const onSubmit = (val: TRegisterForm) => {
    const data: TRegisterPayload = {
      name: val.name,
      email: val.email,
      password: val.password,
      role: val.role,
      avatar: val.avatar,
    };
    mutate(data, {
      onSuccess: () => {
        toast.success("Success");
        navigate({ to: backURL || "/login" });
      },
    });
  };

  return (
    <AuthLayout title="Register">
      <div className="w-[calc(100%-16px)] lg:w-[calc(100%-100px)] mx-2 lg:mx-[50px] bg-[#1C1D1F] border-[0.5px] border-[#1e293b] rounded-2xl flex justify-center py-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-5 w-full">
                  <FormLabel className="text-sm leading-[18px] font-semibold text-white">
                    Full Name<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative flex h-[50px] w-full items-center rounded-xs",
                        form.watch("name") ? "text-white" : "text-[#697698]"
                      )}
                    >
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                        <User className="h-5 w-5" />
                      </div>
                      <Input
                        placeholder="Enter full name"
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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5 w-full">
                  <FormLabel className="text-sm leading-[18px] font-semibold text-white">
                    Email Address<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative flex h-[50px] w-full items-center rounded-xs",
                        form.watch("email") ? "text-white" : "text-[#697698]"
                      )}
                    >
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                        <Mail />
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="text-sm leading-[18px] font-semibold text-white">
                    Password<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-col">
                      <div
                        className={cn(
                          "relative flex h-[50px] w-full items-center rounded-xs",
                          form.watch("password")
                            ? "text-white"
                            : "text-[#697698]"
                        )}
                      >
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                          <Lock />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="h-[50px] pl-16 placeholder:text-[#697698]"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="default"
                          size="icon"
                          className="absolute top-0 right-0 h-full !bg-inherit text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-6 w-6 text-gray-400" />
                          ) : (
                            <Eye className="h-6 w-6 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="text-sm leading-[18px] font-semibold text-white">
                    Confirm Password<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-col">
                      <div
                        className={cn(
                          "relative flex h-[50px] w-full items-center rounded-xs",
                          form.watch("confirm")
                            ? "text-white"
                            : "text-[#697698]"
                        )}
                      >
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                          <Lock />
                        </div>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="h-[50px] pl-16 placeholder:text-[#697698]"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="default"
                          size="icon"
                          className="absolute !bg-inherit top-0 right-0 h-full text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-6 w-6 text-gray-400" />
                          ) : (
                            <Eye className="h-6 w-6 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="mb-5 w-full">
                  <FormLabel className="text-sm leading-[18px] font-semibold text-white">
                    Role<span className="text-red-600">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        size="sm"
                        className="!h-[50px] text-white !bg-[#1C1D1F] w-full rounded-xs !border-white"
                      >
                        <SelectValue
                          placeholder="Select role"
                          className="placeholder:!text-[#697698] !text-sm w-full h-h-full bg-[#1C1D1F]"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1C1D1F] border-[#1e293b]">
                      <SelectItem
                        value="user"
                        className="text-white hover:bg-[#2a2d31] focus:bg-[#2a2d31]"
                      >
                        User
                      </SelectItem>
                      <SelectItem
                        value="admin"
                        className="text-white hover:bg-[#2a2d31] focus:bg-[#2a2d31]"
                      >
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              variant={"secondary"}
              disabled={isPending}
              className="!bg-green-400 mt-6 h-[50px] w-full rounded-[5px] text-sm font-bold text-white hover:!bg-green-600"
            >
              {isPending && <Loader className="animate-spin mr-2" />}
              Create Account
            </Button>

            <div className="text-center text-sm font-medium text-white">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-400 hover:text-green-300 hover:underline"
              >
                Sign In →
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
}
