import { z } from "zod";

export const formSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
});

export type TCreateTaskStatusForm = z.infer<typeof formSchema>;
export type TCreateTaskStatusPayload = TCreateTaskStatusForm & {
  projectId: string;
  order: number;
};
