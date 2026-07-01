import { z } from "zod";

const register = z.object({
  body: z.object({
    fullname: z.string({
      error: "Fullname perlu diisi!",
    }),
    email: z
      .string({
        error: "Email perlu diisi!",
      })
      .email("Email tidak valid!"),
    nis: z.string({
      error: "NIS perlu diisi!",
    }),
    password: z
      .string({ error: "Password perlu diisi!" })
      .min(8, { message: "Password minimal 8 karakter!" }),

    passwordConfirmation: z
      .string({
        error: "Password confirmation perlu diisi!",
      })
      .min(8, { message: "Password minimal 8 karakter!" }),
  }),
});

const login = z.object({
  body: z.object({
    email: z
      .string({
        error: "Email perlu diisi!",
      })
      .email("Email tidak valid!"),
    password: z
      .string({ error: "Password perlu diisi!" })
      .min(8, { message: "Password minimal 8 karakter!" }),
  }),
});

const verify = z.object({
  body: z.object({
    otp: z
      .number({ error: "OTP perlu diisi!" })
      .int()
      .gte(100000)
      .lte(999999),
    email: z
      .string({
        error: "Email perlu diisi!",
      })
      .email("Email tidak valid!"),
  }),
});

export default {
  register,
  login,
  verify,
};
