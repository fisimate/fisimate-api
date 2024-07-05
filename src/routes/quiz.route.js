import express from "express";
import { quizController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import quizAttemptController from "../controllers/quizAttempt.controller.js";
import quizReviewController from "../controllers/quizReview.controller.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/:simulationId", authenticateUser, quizController.getQuizById);
router.post("/", authenticateUser, quizController.create);
router.put("/:id", authenticateUser, quizController.update);
router.delete("/:id", authenticateUser, quizController.deleteQuizById);

// attempt simulation
router.post("/attempt", authenticateUser, quizAttemptController.createAttempt);
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
  "/attempt/:simulationId",
  authenticateUser,
  quizAttemptController.getAttemptBySimulationId
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
  upload.single("filePath"),
  quizReviewController.create
);
router.put(
  "/:simulationId/review",
  authenticateUser,
  upload.single("filePath"),
  quizReviewController.update
);
router.delete(
  "/:simulationId/review",
  authenticateUser,
  quizReviewController.destroy
);

export default router;
