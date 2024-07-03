import express from "express";
import { quizController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import quizAttemptController from "../controllers/quizAttempt.controller.js";
import quizReviewController from "../controllers/quizReview.controller.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/:id", authenticateUser, quizController.getQuizById);
router.post("/", authenticateUser, quizController.create);
router.put("/:id", authenticateUser, quizController.update);
router.delete("/:id", authenticateUser, quizController.destroy);

// attempt quiz
router.post("/attempt", authenticateUser, quizAttemptController.createAttempt);
router.get(
  "/result/:quizId",
  authenticateUser,
  quizAttemptController.getUserScore
);
router.get(
  "/attempt/me",
  authenticateUser,
  quizAttemptController.getAllAttempts
);
router.get(
  "/attempt/:quizId",
  authenticateUser,
  quizAttemptController.getAttemptByQuizId
);

// quiz review
router.get("/:quizId/review", authenticateUser, quizReviewController.index);
router.post(
  "/:quizId/review",
  authenticateUser,
  upload.single("filePath"),
  quizReviewController.create
);
router.put(
  "/:quizId/review",
  authenticateUser,
  upload.single("filePath"),
  quizReviewController.update
);
router.delete(
  "/:quizId/review",
  authenticateUser,
  quizReviewController.destroy
);

export default router;
