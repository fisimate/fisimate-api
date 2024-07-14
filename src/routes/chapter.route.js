import express from "express";
import { chapterController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import chapterValidation from "../validations/chapter.validation.js";
import upload from "../lib/multer.js";

const route = express.Router();

route.get("/", authenticateUser, chapterController.index);
route.get("/:id", authenticateUser, chapterController.show);
route.post(
  "/",
  authenticateUser,
  upload.single("icon"),
  chapterController.create
);
route.put(
  "/:id",
  authenticateUser,
  upload.single("icon"),
  chapterController.update
);
route.delete("/:id", authenticateUser, chapterController.destroy);

export default route;
