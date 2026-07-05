import express from "express";
import { examBankController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";
import validate from "../middlewares/validate.js";
import bankValidation from "../validations/bank.validation.js";

const router = express.Router();

/**
 * @swagger
 * /exam-banks/all:
 *   get:
 *     tags: [Exam Banks]
 *     summary: Dapatkan semua bank soal (flat, tanpa grouping per bab)
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
router.get("/all", authenticateUser, examBankController.getAll);
/**
 * @swagger
 * /exam-banks:
 *   get:
 *     tags: [Exam Banks]
 *     summary: Dapatkan semua bank soal dikelompokkan per bab, beserta jumlah total bab dan bank soal
 *     responses:
 *       200:
 *         description: Sukses mendapatkan semua bank soal
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
router.get("/", authenticateUser, examBankController.index);
/**
 * @swagger
 * /exam-banks/{id}:
 *   get:
 *     tags: [Exam Banks]
 *     summary: Dapatkan detail satu bank soal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sukses mendapatkan bank soal
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
router.get("/:id", authenticateUser, examBankController.show);
/**
 * @swagger
 * /exam-banks:
 *   post:
 *     tags: [Exam Banks]
 *     summary: Buat bank soal baru (teacher only)
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
 *         description: Berhasil membuat bank soal
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
  examBankController.create
);
/**
 * @swagger
 * /exam-banks/{id}:
 *   put:
 *     tags: [Exam Banks]
 *     summary: Update bank soal (teacher only)
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
 *         description: Berhasil update bank soal
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
  examBankController.update
);
/**
 * @swagger
 * /exam-banks/{id}:
 *   delete:
 *     tags: [Exam Banks]
 *     summary: Hapus bank soal (teacher only)
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
  examBankController.destroy
);

export default router;
