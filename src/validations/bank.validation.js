import { z } from "zod";

const createData = z.object({
  body: z.object({
    title: z.string().min(1, { message: "Judul bank perlu diisi!" }),
    chapterId: z.string().min(1, { message: "Bab perlu diisi!" }),
  }),
  files: z.object({
    icon: z
      .array(
        z.object({
          mimetype: z
            .string()
            .refine(
              (mime) =>
                mime === "image/png" ||
                mime === "image/jpeg" ||
                mime === "image/jpg",
              {
                message: "Icon harus berupa gambar (PNG/JPEG)",
              }
            ),
        })
      )
      .length(1, "Icon diperlukan"),
    filePath: z
      .array(
        z.object({
          mimetype: z.string().refine((mime) => mime === "application/pdf", {
            message: "File harus PDF",
          }),
        })
      )
      .length(1, "File Path diperlukan"),
  }),
});

const updateData = z.object({
  body: z.object({
    title: z.string().min(1, { message: "Judul bank perlu diisi!" }),
    chapterId: z.string().min(1, { message: "Bab perlu diisi!" }),
  }),
  files: z
    .object({
      icon: z
        .array(
          z.object({
            mimetype: z
              .string()
              .refine(
                (mime) =>
                  mime === "image/png" ||
                  mime === "image/jpeg" ||
                  mime === "image/jpg",
                {
                  message: "Icon harus berupa gambar (PNG/JPEG/JPG)",
                }
              ),
          })
        )
        .optional(),
      filePath: z
        .array(
          z.object({
            mimetype: z.string().refine((mime) => mime === "application/pdf", {
              message: "File harus PDF",
            }),
          })
        )
        .optional(),
    })
    .partial(),
});

export default { createData, updateData };
