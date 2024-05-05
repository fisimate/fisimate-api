import express from "express";
import {
  materialController,
  quizController,
  simulationController,
} from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";

const route = express.Router();

route.get("/", authenticateUser, simulationController.index);
route.get("/:id", authenticateUser, simulationController.show);

// material route
route.get(
  "/:simulationId/materials",
  authenticateUser,
  materialController.show
);

// quiz route
route.get("/:simulationId/quizzes", authenticateUser, quizController.index);

// question route

export default route;
