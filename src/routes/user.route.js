import express from "express";
import { userController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import userValidation from "../validations/user.validation.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/profile", authenticateUser, userController.getProfile);
router.post(
  "/profile/picture",
  authenticateUser,
  upload.single("profilePicture"),
  validate(userValidation.updatePicture),
  userController.updateProfilePicture
);
router.put(
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
