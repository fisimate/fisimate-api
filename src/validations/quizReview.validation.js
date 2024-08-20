import { z } from "zod";

const createData = z.object({
  file: z
    .array(
      z.object({
        mimetype: z.string().refine((mime) => mime === "application/pdf", {
          message: "File harus berupa PDF",
        }),
      })
    )
    .length(1, "File diperlukan"),
});

const updateData = z.object({
  file: z
    .array(
      z.object({
        mimetype: z.string().refine((mime) => mime === "application/pdf", {
          message: "File harus berupa PDF",
        }),
      })
    )
    .optional(),
});

export default {
  createData,
  updateData,
};
