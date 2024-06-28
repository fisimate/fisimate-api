import express from "express";
import { chapterController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import chapterValidation from "../validations/chapter.validation.js";

const route = express.Router();

route.get("/", authenticateUser, chapterController.index);
route.get("/:id", authenticateUser, chapterController.show);
route.post(
  "/",
  authenticateUser,
  validate(chapterValidation.chapterValidation),
  chapterController.create
);
route.put(
  "/:id",
  authenticateUser,
  validate(chapterValidation.chapterValidation),
  chapterController.update
);
route.delete("/:id", authenticateUser, chapterController.destroy);

export default route;
