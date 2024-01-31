import express from "express";
import { userController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import userValidation from "../validations/user.validation.js";

const router = express.Router();

router.get("/profile", authenticateUser, userController.getProfile);
router.post(
  "/update",
  authenticateUser,
  validate(userValidation.updateProfile),
  userController.updateProfile
);
router.post(
  "/password/update",
  authenticateUser,
  validate(userValidation.changePassword),
  userController.changePassword
);

export default router;
