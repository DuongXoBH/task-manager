import { z } from "zod";

export const updateTaskFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.union([z.date(), z.null(), z.string()]).optional(),
  completed: z.boolean().optional(),
});

export type TUpdateTaskForm = z.infer<typeof updateTaskFormSchema>;
export type TUpdateTaskPayload = TUpdateTaskForm & {
  statusId?: string;
};
