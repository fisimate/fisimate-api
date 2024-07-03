import express from "express";
import { examBankController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/all", authenticateUser, examBankController.getAll);
router.get("/", authenticateUser, examBankController.index);
router.get("/:id", authenticateUser, examBankController.show);
router.post(
  "/",
  authenticateUser,
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  examBankController.create
);
router.put(
  "/:id",
  authenticateUser,
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  examBankController.update
);
router.delete("/:id", authenticateUser, examBankController.destroy);

export default router;
