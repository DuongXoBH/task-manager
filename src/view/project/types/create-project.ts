import { z } from "zod";

export const formSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  memberIds: z.array(z.string()).optional(),
  images: z
    .string()
    .url({ message: "Image must be a valid URL" })
    .nullable()
    .optional(),
});

export type TCreateProjectForm = z.infer<typeof formSchema>;
export type TCreateProjectPayload = TCreateProjectForm & {
  createdById: string;
};
