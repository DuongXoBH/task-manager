import { z } from "zod";

export const formSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

export type TCreateTaskForm = z.infer<typeof formSchema>;
export type TCreateTaskPayload = TCreateTaskForm & {
  projectId: string;
  createdById: string;
  statusId: string;
};
