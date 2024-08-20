import express from "express";
import { materialBankController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";
import bankValidation from "../validations/bank.validation.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.get("/all", authenticateUser, materialBankController.getAll);
router.get("/", authenticateUser, materialBankController.index);
router.get("/:id", authenticateUser, materialBankController.show);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  validate(bankValidation.createData),
  materialBankController.create
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  validate(bankValidation.updateData),
  materialBankController.update
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  materialBankController.destroy
);

export default router;
