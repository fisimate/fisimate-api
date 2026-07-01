import { z } from "zod";

const changePassword = z.object({
  body: z.object({
    oldPassword: z
      .string({
        error: "Password lama perlu diisi!",
      })
      .min(8, { message: "Password minimal 8 karakter!" }),
    newPassword: z
      .string({
        error: "Password baru perlu diisi!",
      })
      .min(8, { message: "Password minimal 8 karakter!" }),
    passwordConfirmation: z
      .string({
        error: "Password konfirmasi perlu diisi!",
      })
      .min(8, { message: "Password minimal 8 karakter!" }),
  }),
});

const updateProfile = z.object({
  body: z.object({
    email: z
      .string({
        error: "Email perlu diisi!",
      })
      .email("Email tidak valid!"),
    fullname: z.string({
      error: "Fullname perlu diisi!",
    }),
  }),
});

const updatePicture = z.object({
  file: z.object({
    mimetype: z
      .string()
      .refine(
        (mime) =>
          mime === "image/png" || mime === "image/jpeg" || mime === "image/jpg",
        {
          message: "Foto Profil harus berupa gambar (PNG/JPEG/JPG)",
        }
      ),
  }),
});

export default {
  changePassword,
  updateProfile,
  updatePicture,
};
