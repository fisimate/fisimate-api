import express from "express";
import { quizController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import quizAttemptController from "../controllers/quizAttempt.controller.js";

const router = express.Router();

router.get("/:id", authenticateUser, quizController.getQuizById);
router.post("/", authenticateUser, quizController.create);
router.put("/:id", authenticateUser, quizController.update);
router.delete("/:id", authenticateUser, quizController.destroy);
router.post("/attempt", authenticateUser, quizAttemptController.createAttempt);
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

export default router;
