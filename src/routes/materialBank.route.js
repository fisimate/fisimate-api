import express from "express";
import { materialBankController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/all", authenticateUser, materialBankController.getAll);
router.get("/", authenticateUser, materialBankController.index);
router.get("/:id", authenticateUser, materialBankController.show);
router.post(
  "/",
  authenticateUser,
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  materialBankController.create
);
router.put(
  "/:id",
  authenticateUser,
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  materialBankController.update
);
router.delete("/:id", authenticateUser, materialBankController.destroy);

export default router;
