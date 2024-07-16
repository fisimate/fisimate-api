import express from "express";
import { chapterController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";

const route = express.Router();

route.get("/", authenticateUser, chapterController.index);
route.get("/:id", authenticateUser, chapterController.show);
route.post(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("icon"),
  chapterController.create
);
route.put(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("icon"),
  chapterController.update
);
route.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  chapterController.destroy
);

export default route;
