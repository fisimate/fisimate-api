import express from "express";
import { quizController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import quizAttemptController from "../controllers/quizAttempt.controller.js";
import quizReviewController from "../controllers/quizReview.controller.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get(
  "/:simulationId",
  authenticateUser,
  authorizeRoles("teacher"),
  quizController.getQuizBySimulation
);
router.post(
  "/:simulationId",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("image"),
  quizController.create
);
router.put(
  "/:simulationId",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  quizController.update
);
router.delete(
  "/:simulationId",
  authenticateUser,
  authorizeRoles("teacher"),
  quizController.deleteQuizById
);

// attempt simulation
router.post(
  "/:simulationId/attempt",
  authenticateUser,
  quizAttemptController.createAttempt
);
router.get(
  "/result/:simulationId",
  authenticateUser,
  quizAttemptController.getUserScore
);
router.get(
  "/attempt/me",
  authenticateUser,
  quizAttemptController.getAllAttempts
);
router.get(
  "/:simulationId/attempt",
  authenticateUser,
  quizAttemptController.getAttemptBySimulationId
);
// get attempt history
router.get(
  "/attempt/history/:userId",
  authenticateUser,
  quizAttemptController.getAttemptHistories
);

// simulation review
router.get(
  "/:simulationId/review",
  authenticateUser,
  quizReviewController.index
);
router.post(
  "/:simulationId/review",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("filePath"),
  quizReviewController.create
);
router.put(
  "/:simulationId/review",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("filePath"),
  quizReviewController.update
);
router.delete(
  "/:simulationId/review",
  authenticateUser,
  authorizeRoles("teacher"),
  quizReviewController.destroy
);

export default router;
