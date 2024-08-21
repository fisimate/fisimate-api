import { optional, z } from "zod";

const optionSchema = z.object({
  id: z.string().optional().nullable(),
  text: z.string().min(1, "Opsi jawaban tidak boleh kosong!"),
  isCorrect: z.boolean(),
});

const createData = z.object({
  body: z.object({
    text: z.string().min(1, "Pertanyaan tidak boleh kosong!"),
    options: z
      .array(optionSchema)
      .length(4, "Opsi jawaban harus ada empat!")
      .refine(
        (options) => options.filter((option) => option.isCorrect).length === 1,
        {
          message: "Harus ada satu jawaban yang bernilai benar!",
        }
      ),
    deleteImage: z.union([
      z.boolean(),
      z.string().transform((val) => val === "true"),
    ]),
  }),
  file: z
    .object({
      mimetype: z
        .string()
        .refine(
          (mime) =>
            mime === "image/png" ||
            mime === "image/jpeg" ||
            mime === "image/jpg",
          {
            message: "Gambar Soal harus berupa gambar (PNG/JPEG/JPG)",
          }
        ),
    })
    .optional(),
});

const updateData = z.object({
  body: z.object({
    text: z.string().min(1, "Pertanyaan tidak boleh kosong!"),
    options: z
      .array(optionSchema)
      .length(4, "Opsi jawaban harus ada empat!")
      .refine(
        (options) => options.filter((option) => option.isCorrect).length === 1,
        {
          message: "Harus ada satu jawaban yang bernilai benar!",
        }
      ),
    deleteImage: z.union([
      z.boolean(),
      z.string().transform((val) => val === "true"),
    ]),
  }),
  file: z
    .object({
      mimetype: z
        .string()
        .refine(
          (mime) =>
            mime === "image/png" ||
            mime === "image/jpeg" ||
            mime === "image/jpg",
          {
            message: "Gambar Soal harus berupa gambar (PNG/JPEG/JPG)",
          }
        ),
    })
    .optional(),
});

export default {
  createData,
  updateData,
};
