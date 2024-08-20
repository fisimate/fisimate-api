import { z } from "zod";

const updateData = z.object({
  body: z.object({
    title: z.string().min(1, { message: "Judul bank perlu diisi!" }),
    chapterId: z.string().min(1, { message: "Bab perlu diisi!" }),
  }),
  file: z
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
    .optional(),
});

export default { updateData };
