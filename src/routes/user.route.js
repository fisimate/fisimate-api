import express from "express";
import { userController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
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

// route get siswa
router.get(
  "/students",
  authenticateUser,
  authorizeRoles("teacher"),
  userController.getAllStudents
);
router.get(
  "/students/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  userController.getOneStudents
);
router.post(
  "/students",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("profilePicture"),
  userController.createStudent
);
router.put(
  "/students/:id",
  authenticateUser,
  upload.single("profilePicture"),
  authorizeRoles("teacher"),
  userController.updateStudent
);
router.delete(
  "/students/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  userController.deleteStudent
);
router.post(
  "/students/:id/reset",
  authenticateUser,
  authorizeRoles("teacher"),
  userController.resetPassword
);

export default router;
