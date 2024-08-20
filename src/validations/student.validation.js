import { z } from "zod";

const createData = z.object({
  body: z.object({
    fullname: z.string().min(1, { message: "Nama lengkap perlu diisi!" }),
    email: z.string().min(1, { message: "Email perlu diisi!" }),
    nis: z.string().min(1, { message: "NIS perlu diisi!" }),
    password: z.string().min(1, { message: "Password perlu diisi!" }),
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
              message: "Foto Profil harus berupa gambar (PNG/JPEG)",
            }
          ),
      })
    )
    .length(1, "Foto Profil diperlukan"),
});

const updateData = z.object({
  body: z.object({
    fullname: z.string().min(1, { message: "Nama lengkap perlu diisi!" }),
    email: z.string().min(1, { message: "Email perlu diisi!" }),
    nis: z.string().min(1, { message: "NIS perlu diisi!" }),
    password: z.string().min(1, { message: "Password perlu diisi!" }),
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
              message: "Foto Profil harus berupa gambar (PNG/JPEG)",
            }
          ),
      })
    )
    .optional(),
});

export default { createData, updateData };
