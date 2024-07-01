import express from "express";
import { examBankController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  upload.fields([{ name: "icon" }, { name: "fileBankPath" }]),
  examBankController.index
);
router.get("/:id", authenticateUser, examBankController.show);
router.post("/", authenticateUser, examBankController.create);
router.put("/:id", authenticateUser, examBankController.update);
router.delete("/:id", authenticateUser, examBankController.destroy);

export default router;
