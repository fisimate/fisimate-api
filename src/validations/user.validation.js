import { z } from "zod";

const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Password lama perlu diisi!",
    }),
    newPassword: z.string({
      required_error: "Password baru perlu diisi!",
    }),
    passwordConfirmation: z.string({
      required_error: "Password konfirmasi perlu diisi!",
    }),
  }),
});

const updateProfile = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email perlu diisi!",
      })
      .email("Email tidak valid!"),
    fullname: z.string({
      required_error: "Fullname perlu diisi!",
    }),
    nis: z.string({
      required_error: "NIS perlu diisi!",
    }),
  }),
});

export default {
  changePassword,
  updateProfile,
};
