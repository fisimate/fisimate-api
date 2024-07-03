import { z } from "zod";

const createData = z.object({
  body: z.object({
    simulationId: z.string({
      required_error: "Simulasi perlu diisi!",
    }),
  }),
  file: z.object({
    mimetype: z.string().refine((mime) => mime === "application/pdf", {
      message: "File harus PDF",
    }),
  }),
});

const updateData = z.object({
  body: z.object({
    simulationId: z.string({
      required_error: "Simulasi perlu diisi!",
    }),
  }),
  file: z
    .object({
      mimetype: z.string().refine((mime) => mime === "application/pdf", {
        message: "File harus PDF",
      }),
    })
    .optional(),
});

export default {
  createData,
  updateData,
};
