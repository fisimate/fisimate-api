import express from "express";
import { materialBankController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticateUser, materialBankController.index);
router.get("/:id", authenticateUser, materialBankController.show);

export default router;
