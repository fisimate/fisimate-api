import express from "express";
import { userController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import userValidation from "../validations/user.validation.js";
import upload from "../lib/multer.js";

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Dapatkan profile user yang sedang login
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan profile user
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.get("/profile", authenticateUser, userController.getProfile);
/**
 * @swagger
 * /users/profile/picture:
 *   post:
 *     tags: [Users]
 *     summary: Update foto profile user yang sedang login
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Kosongkan field ini (tanpa file) untuk menghapus foto profile
 *     responses:
 *       200:
 *         description: Berhasil update foto profile
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.post(
  "/profile/picture",
  authenticateUser,
  upload.single("profilePicture"),
  userController.updateProfilePicture
);
/**
 * @swagger
 * /users/update:
 *   put:
 *     tags: [Users]
 *     summary: Update data profile (nama & email) user yang sedang login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, fullname]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               fullname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Berhasil update profile
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.put(
  "/update",
  authenticateUser,
  validate(userValidation.updateProfile),
  userController.updateProfile
);
/**
 * @swagger
 * /users/password/update:
 *   post:
 *     tags: [Users]
 *     summary: Ganti password user yang sedang login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword, passwordConfirmation]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               passwordConfirmation:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Berhasil update password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.post(
  "/password/update",
  authenticateUser,
  validate(userValidation.changePassword),
  userController.changePassword
);

/**
 * @swagger
 * /users/students:
 *   get:
 *     tags: [Users]
 *     summary: Dapatkan semua data siswa (teacher only)
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data siswa
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
// route get siswa
router.get(
  "/students",
  authenticateUser,
  authorizeRoles("teacher"),
  userController.getAllStudents
);
/**
 * @swagger
 * /users/students/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Dapatkan detail satu siswa (teacher only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data siswa
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  "/students/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  userController.getOneStudents
);
/**
 * @swagger
 * /users/students:
 *   post:
 *     tags: [Users]
 *     summary: Buat data siswa baru (teacher only)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [fullname, email, nis, password]
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               nis:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Berhasil membuat data siswa
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.post(
  "/students",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("profilePicture"),
  userController.createStudent
);
/**
 * @swagger
 * /users/students/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update data siswa (teacher only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               nis:
 *                 type: string
 *               fullname:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Berhasil update data siswa
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/students/:id",
  authenticateUser,
  upload.single("profilePicture"),
  authorizeRoles("teacher"),
  userController.updateStudent
);
/**
 * @swagger
 * /users/students/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Hapus data siswa (teacher only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil hapus data siswa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  "/students/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  userController.deleteStudent
);
/**
 * @swagger
 * /users/students/{id}/reset:
 *   post:
 *     tags: [Users]
 *     summary: Reset password siswa (teacher only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Berhasil reset password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post(
  "/students/:id/reset",
  authenticateUser,
  authorizeRoles("teacher"),
  userController.resetPassword
);

export default router;
