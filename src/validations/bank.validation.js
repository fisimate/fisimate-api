import { z } from "zod";

const createData = z.object({
  body: z.object({
    title: z.string({
      required_error: "Judul bank perlu diisi!",
    }),
    chapterId: z.string({
      required_error: "Bab perlu diisi!",
    }),
  }),
  file: z.object({
    mimetype: z.string().refine((mime) => mime === "application/pdf", {
      message: "File harus PDF",
    }),
  }),
});

const updateData = z.object({
  body: z.object({
    title: z.string({
      required_error: "Judul bank perlu diisi!",
    }),
    chapterId: z.string({
      required_error: "Bab perlu diisi!",
    }),
  }),
  file: z
    .object({
      mimetype: z.string().refine((mime) => mime === "application/pdf", {
        message: "File harus PDF",
      }),
    })
    .optional(),
});

export default { createData, updateData };
