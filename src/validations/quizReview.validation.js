import { z } from "zod";

const createData = z.object({
  file: z.object({
    mimetype: z.string().refine((mime) => mime === "application/pdf", {
      message: "File harus berupa PDF",
    }),
  }),
});

const updateData = z.object({
  file: z.object({
    mimetype: z.string().refine((mime) => mime === "application/pdf", {
      message: "File harus berupa PDF",
    }),
  }),
});

export default {
  createData,
  updateData,
};
