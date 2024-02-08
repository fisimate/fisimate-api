import express from "express";
import { formulaBankController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticateUser, formulaBankController.index);
router.get("/:id", authenticateUser, formulaBankController.show);

export default router;
