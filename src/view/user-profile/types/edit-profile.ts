import { z } from "zod";

export const editFormSchema = z
  .object({
    avatar: z
      .string()
      .url({ message: "Avatar must be a valid URL" })
      .nullable()
      .optional(),
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .max(50)
      .email("Invalid Email"),

    password: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;

          return (
            val.length >= 6 && /[A-Z]/.test(val) && /[^A-Za-z0-9]/.test(val)
          );
        },
        {
          message:
            "Password must be at least 6 characters and include 1 uppercase letter and 1 special character",
        }
      ),

    confirm: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirm) {
        return data.password && data.confirm && data.password === data.confirm;
      }

      return true;
    },
    {
      path: ["confirm"],
      message: "Passwords do not match or missing one of them",
    }
  );

export type TUpdateForm = z.infer<typeof editFormSchema>;
export type TUpdateMePayload = Omit<TUpdateForm, "confirm">;
