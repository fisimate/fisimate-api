import { z } from "zod";

const validate = z.object({
  body: z.object({
    text: z.string({
      required_error: "Opsi perlu diisi!",
    }),
    isCorrect: z.boolean({
      required_error: "Opsi harus mempunyai nilai benar atau salah!",
    }),
    questionId: z.string({
      required_error: "Pertanyaan harus diisi!",
    }),
  }),
});
