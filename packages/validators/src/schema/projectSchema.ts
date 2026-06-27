import * as z from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Project title required"),
  initialPrompt: z
    .string()
    .min(1, "Can't create project without an initial prompt"),
});
