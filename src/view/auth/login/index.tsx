import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader } from "lucide-react";
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
import { useAtom } from "jotai";
import { useAuthAccessToken, useAuthRefreshToken } from "@/store/auth";
import { Icons } from "@/assets";
import type { ILoginResponse } from "@/types";
import { formSchema, type TLoginPayload } from "../types/login";
import { useLogin } from "../apis/use-login";
import AuthLayout from "../layout";
import { toast } from "react-toastify";

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  const [accessToken, setAccessToken] = useAtom(useAuthAccessToken);
  const [, setRefreshToken] = useAtom(useAuthRefreshToken);
  const navigate = useNavigate();

  const form = useForm<TLoginPayload>({
    resolver: zodResolver(formSchema),
  });

  // const backURL = new URLSearchParams(location.search).get("backUrl");

  const onSuccess = (data: ILoginResponse) => {
    setRefreshToken(data.refreshToken);
    setAccessToken(data.accessToken);
    toast(data.message);
  };

  const { mutate, isPending } = useLogin(onSuccess);

  const onSubmit = (val: TLoginPayload) => {
    mutate(val);
  };

  useEffect(() => {
    if (accessToken) {
      navigate({ to: "/" });
    }
  }, [accessToken]);

  return (
    <AuthLayout title="Login">
      <div className="w-[calc(100%-16px)] lg:w-[calc(100%-100px)] mx-2 lg:mx-[50px] bg-[#1C1D1F] border-[0.5px] border-[#1e293b] rounded-2xl flex justify-center py-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-10"
          >
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
                        form.watch("email") ? "text-black" : "text-[#697698]"
                      )}
                    >
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                        <Icons.mail />
                      </div>
                      <Input
                        placeholder="Enter email address"
                        className="h-[50px] pl-16 placeholder:text-[#697698] bg-white"
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
                <FormItem className="mb-0">
                  <FormLabel className="text-sm leading-[18px] font-semibold text-white">
                    Password<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-col">
                      <div
                        className={cn(
                          "relative flex h-[50px] w-full items-center rounded-xs",
                          form.watch("password")
                            ? "text-black"
                            : "text-[#697698]"
                        )}
                      >
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                          <Icons.lock />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="h-[50px] pl-16 placeholder:text-[#697698] bg-white"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="default"
                          size="icon"
                          className="absolute top-0 right-0 h-full !bg-inherit text-gray-400 hover:text-gray-600 border-white"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Link
              to="/"
              className="hover:text-secondary mt-2 flex justify-end text-xs font-medium text-white"
            >
              Forgot Password?
            </Link>
            <Button
              variant={"secondary"}
              disabled={isPending}
              className="!bg-green-400 mt-2 h-[50px] w-full rounded-[5px] text-sm font-bold text-white hover:!bg-green-600"
            >
              {isPending && <Loader className="animate-spin" />}
              Log In
            </Button>

            <div className="text-center text-sm font-medium text-amber-50">
              Don't have an account?{" "}
              <Link to="/register" className="text-secondary hover:underline">
                Register →
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
}
