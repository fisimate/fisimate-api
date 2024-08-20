import express from "express";
import { examBankController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";
import validate from "../middlewares/validate.js";
import bankValidation from "../validations/bank.validation.js";

const router = express.Router();

router.get("/all", authenticateUser, examBankController.getAll);
router.get("/", authenticateUser, examBankController.index);
router.get("/:id", authenticateUser, examBankController.show);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  validate(bankValidation.createData),
  examBankController.create
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  validate(bankValidation.updateData),
  examBankController.update
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  examBankController.destroy
);

export default router;
