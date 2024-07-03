import { z } from "zod";

const chapterValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: "Nama chapter perlu diisi!",
    }),
  }),
});

export default { chapterValidation };
