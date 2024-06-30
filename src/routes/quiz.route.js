import express from "express";
import { quizController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import quizAttemptcontroller from "../controllers/quizAttemptcontroller.js";

const router = express.Router();

router.get("/:id", authenticateUser, quizController.getQuizById);
router.post("/", authenticateUser, quizController.create);
router.put("/:id", authenticateUser, quizController.update);
router.delete("/:id", authenticateUser, quizController.destroy);
router.post("/attempt", authenticateUser, quizAttemptcontroller.createAttempt);
router.get(
  "/attempt/users/:userId",
  authenticateUser,
  quizAttemptcontroller.getAllAttempts
);
router.get(
  "/attempt/:id",
  authenticateUser,
  quizAttemptcontroller.getAttemptByQuizId
);
