import { z } from "zod";

const createData = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Nama bab perlu diisi!" }),
    shortDescription: z
      .string()
      .min(1, { message: "Deskripsi singkat perlu diisi!" }),
  }),
  file: z.object({
    mimetype: z
      .string()
      .refine(
        (mime) =>
          mime === "image/png" || mime === "image/jpeg" || mime === "image/jpg",
        {
          message: "Icon harus berupa gambar (PNG/JPEG/JPG)",
        }
      ),
  }),
});

const updateData = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Nama bab perlu diisi!" }),
    shortDescription: z
      .string()
      .min(1, { message: "Deskripsi singkat perlu diisi!" }),
  }),
  file: z.object({
    mimetype: z
      .string()
      .refine(
        (mime) =>
          mime === "image/png" || mime === "image/jpeg" || mime === "image/jpg",
        {
          message: "Icon harus berupa gambar (PNG/JPEG/JPG)",
        }
      ),
  }),
});

export default { createData, updateData };
