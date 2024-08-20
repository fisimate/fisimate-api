import express from "express";
import { chapterController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";
import validate from "../middlewares/validate.js";
import chapterValidation from "../validations/chapter.validation.js";

const route = express.Router();

route.get("/", authenticateUser, chapterController.index);
route.get("/:id", authenticateUser, chapterController.show);
route.post(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("icon"),
  validate(chapterValidation.createData),
  chapterController.create
);
route.put(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("icon"),
  validate(chapterValidation.updateData),
  chapterController.update
);
route.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  chapterController.destroy
);

export default route;
