import express from "express";
import { formulaBankController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";
import bankValidation from "../validations/bank.validation.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.get("/all", authenticateUser, formulaBankController.getAll);
router.get("/", authenticateUser, formulaBankController.index);
router.get("/:id", authenticateUser, formulaBankController.show);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  validate(bankValidation.createData),
  formulaBankController.create
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  validate(bankValidation.updateData),
  formulaBankController.update
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  formulaBankController.destroy
);

export default router;
