import express from "express";
import { materialBankController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";
import validate from "../middlewares/validate.js";
import bankValidation from "../validations/bank.validation.js";

const router = express.Router();

/**
 * @swagger
 * /material-banks/all:
 *   get:
 *     tags: [Material Banks]
 *     summary: Dapatkan semua bank materi (flat, tanpa grouping per bab)
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data
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
 *                         $ref: '#/components/schemas/Bank'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.get("/all", authenticateUser, materialBankController.getAll);
/**
 * @swagger
 * /material-banks:
 *   get:
 *     tags: [Material Banks]
 *     summary: Dapatkan semua bank materi dikelompokkan per bab, beserta jumlah total bab dan bank materi
 *     responses:
 *       200:
 *         description: Sukses mendapatkan semua bank materi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: object
 *                           properties:
 *                             chapters:
 *                               type: integer
 *                             sub_chapters:
 *                               type: integer
 *                         result:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Chapter'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.get("/", authenticateUser, materialBankController.index);
/**
 * @swagger
 * /material-banks/{id}:
 *   get:
 *     tags: [Material Banks]
 *     summary: Dapatkan detail satu bank materi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sukses mendapatkan bank materi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Bank'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", authenticateUser, materialBankController.show);
/**
 * @swagger
 * /material-banks:
 *   post:
 *     tags: [Material Banks]
 *     summary: Buat bank materi baru (teacher only)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, chapterId, icon, filePath]
 *             properties:
 *               title:
 *                 type: string
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *               icon:
 *                 type: string
 *                 format: binary
 *                 description: Gambar PNG/JPEG/JPG
 *               filePath:
 *                 type: string
 *                 format: binary
 *                 description: File PDF
 *     responses:
 *       200:
 *         description: Berhasil membuat bank materi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Bank'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.post(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  validate(bankValidation.createData),
  materialBankController.create
);
/**
 * @swagger
 * /material-banks/{id}:
 *   put:
 *     tags: [Material Banks]
 *     summary: Update bank materi (teacher only)
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
 *             required: [title, chapterId]
 *             properties:
 *               title:
 *                 type: string
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *               icon:
 *                 type: string
 *                 format: binary
 *                 description: Opsional, gambar PNG/JPEG/JPG
 *               filePath:
 *                 type: string
 *                 format: binary
 *                 description: Opsional, file PDF
 *     responses:
 *       200:
 *         description: Berhasil update bank materi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Bank'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.fields([{ name: "icon" }, { name: "filePath" }]),
  validate(bankValidation.updateData),
  materialBankController.update
);
/**
 * @swagger
 * /material-banks/{id}:
 *   delete:
 *     tags: [Material Banks]
 *     summary: Hapus bank materi (teacher only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil hapus data
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
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  materialBankController.destroy
);

export default router;
