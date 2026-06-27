import * as z from "zod";

export const postUserMessageSchema = z.object({
  prompt: z.string().min(1, "Prompt required."),
});
