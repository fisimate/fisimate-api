import express from "express";
import { formulaBankController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";
import validate from "../middlewares/validate.js";
import bankValidation from "../validations/bank.validation.js";

const router = express.Router();

/**
 * @swagger
 * /formula-banks/all:
 *   get:
 *     tags: [Formula Banks]
 *     summary: Dapatkan semua bank rumus (flat, tanpa grouping per bab)
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
router.get("/all", authenticateUser, formulaBankController.getAll);
/**
 * @swagger
 * /formula-banks:
 *   get:
 *     tags: [Formula Banks]
 *     summary: Dapatkan semua bank rumus dikelompokkan per bab, beserta jumlah total bab dan bank rumus
 *     responses:
 *       200:
 *         description: Sukses mendapatkan semua bank rumus
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
router.get("/", authenticateUser, formulaBankController.index);
/**
 * @swagger
 * /formula-banks/{id}:
 *   get:
 *     tags: [Formula Banks]
 *     summary: Dapatkan detail satu bank rumus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sukses mendapatkan bank rumus
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
router.get("/:id", authenticateUser, formulaBankController.show);
/**
 * @swagger
 * /formula-banks:
 *   post:
 *     tags: [Formula Banks]
 *     summary: Buat bank rumus baru (teacher only)
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
 *         description: Berhasil membuat bank rumus
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
  formulaBankController.create
);
/**
 * @swagger
 * /formula-banks/{id}:
 *   put:
 *     tags: [Formula Banks]
 *     summary: Update bank rumus (teacher only)
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
 *         description: Berhasil update bank rumus
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
  formulaBankController.update
);
/**
 * @swagger
 * /formula-banks/{id}:
 *   delete:
 *     tags: [Formula Banks]
 *     summary: Hapus bank rumus (teacher only)
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
  formulaBankController.destroy
);

export default router;
