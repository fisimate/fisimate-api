import { z } from "zod";

const validate = z.object({
  body: z.object({
    text: z.string({
      required_error: "Pertanyaan perlu diisi!",
    }),
    quizId: z.string({
      required_error: "ID Kuis perlu diisi!",
    }),
  }),
});

export default {
  validate,
};
