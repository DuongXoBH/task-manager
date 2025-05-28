import { z } from "zod";

export const formSchema = z
  .object({
    name: z.string({ required_error: "Email is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(50, { message: "Password too long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirm: z
      .string({ required_error: "Confirm password is required" })
      .min(6, { message: "Confirm password must be at least 6 characters" }),
    role: z.string({ required_error: "Password is required" }),
    avatar: z.string().url("Avatar must be a valid URL").optional(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

export type TRegisterForm = z.infer<typeof formSchema>;
export type TRegisterPayload = Omit<TRegisterForm, "confirm">;
