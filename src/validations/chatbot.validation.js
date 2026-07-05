import { z } from "zod";

const generateQuestion = z.object({
  body: z.object({
    chapter: z.string().min(1, { message: "Bab perlu diisi!" }),
  }),
});

export default { generateQuestion };
