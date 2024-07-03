import express from "express";
import {
  materialController,
  quizController,
  simulationController,
} from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/", authenticateUser, simulationController.index);
router.get("/:id", authenticateUser, simulationController.show);
router.put(
  "/:id",
  authenticateUser,
  upload.single("icon"),
  simulationController.update
);

// material route
router.get(
  "/:simulationId/materials",
  authenticateUser,
  materialController.show
);
router.post(
  "/:simulationId/materials",
  authenticateUser,
  upload.single("filePath"),
  materialController.create
);
router.put(
  "/:simulationId/materials/:id",
  authenticateUser,
  upload.single("filePath"),
  materialController.update
);
router.delete(
  "/:simulationId/materials/:id",
  authenticateUser,
  materialController.destroy
);

// quiz route
router.get(
  "/:simulationId/quizzes",
  authenticateUser,
  quizController.getQuizBySimulation
);

export default router;
