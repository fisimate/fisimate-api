import express from "express";
import { examBankController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticateUser, examBankController.index);
router.get("/:id", authenticateUser, examBankController.show);

export default router;
