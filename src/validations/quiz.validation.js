import { z } from "zod";

const validate = z.object({
  body: z.object({
    simulationId: z.string({
      required_error: "Simulasi perlu diisi!",
    }),
  }),
});

export default {
  validate,
};
