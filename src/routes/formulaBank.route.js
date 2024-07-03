import express from "express";
import { formulaBankController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/", authenticateUser, formulaBankController.index);
router.get("/:id", authenticateUser, formulaBankController.show);
router.post(
  "/",
  authenticateUser,
  upload.fields([{ name: "icon" }, { name: "fileBankPath" }]),
  formulaBankController.create
);
router.put(
  "/:id",
  authenticateUser,
  upload.fields([{ name: "icon" }, { name: "fileBankPath" }]),
  formulaBankController.update
);
router.delete("/:id", authenticateUser, formulaBankController.destroy);

export default router;
