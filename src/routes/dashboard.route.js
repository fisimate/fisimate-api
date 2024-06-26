import express from "express";
import { dashboardController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  dashboardController.index
);
router.get("/leaderboard", authenticateUser, dashboardController.leaderboard);

export default router;
