import express from "express";
import {
  materialController,
  quizController,
  simulationController,
} from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/", authenticateUser, simulationController.index);
router.get("/:id", authenticateUser, simulationController.show);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
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
  authorizeRoles("teacher"),
  upload.single("filePath"),
  materialController.create
);
router.put(
  "/:simulationId/materials/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("filePath"),
  materialController.update
);
router.delete(
  "/:simulationId/materials/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  materialController.destroy
);

// progress
router.post(
  "/:simulationId/progress",
  authenticateUser,
  simulationController.createProgress
);

// quiz route
router.get(
  "/:simulationId/quizzes",
  authenticateUser,
  quizController.getQuizBySimulation
);
router.post(
  "/:simulationId/quizzes",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("image"),
  quizController.create
);
router.put(
  "/:simulationId/quizzes/:questionId",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("image"),
  quizController.update
);
router.delete(
  "/:simulationId/quizzes/:questionId",
  authenticateUser,
  authorizeRoles("teacher"),
  quizController.deleteQuizById
);

export default router;
