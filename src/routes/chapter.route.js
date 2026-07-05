import express from "express";
import { chapterController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";
import validate from "../middlewares/validate.js";
import chapterValidation from "../validations/chapter.validation.js";

const route = express.Router();

/**
 * @swagger
 * /chapters:
 *   get:
 *     tags: [Chapters]
 *     summary: Dapatkan semua bab (beserta bank soal/materi/rumus dan simulasi terkait)
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan semua data bab
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
 *                         $ref: '#/components/schemas/Chapter'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
route.get("/", authenticateUser, chapterController.index);
/**
 * @swagger
 * /chapters/{id}:
 *   get:
 *     tags: [Chapters]
 *     summary: Dapatkan detail satu bab
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data bab
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Chapter'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
route.get("/:id", authenticateUser, chapterController.show);
/**
 * @swagger
 * /chapters:
 *   post:
 *     tags: [Chapters]
 *     summary: Buat bab baru (teacher only)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, shortDescription, icon]
 *             properties:
 *               name:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *                 description: Gambar PNG/JPEG/JPG
 *     responses:
 *       200:
 *         description: Berhasil membuat bab baru
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Chapter'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
route.post(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("icon"),
  validate(chapterValidation.createData),
  chapterController.create
);
/**
 * @swagger
 * /chapters/{id}:
 *   put:
 *     tags: [Chapters]
 *     summary: Update bab (teacher only)
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
 *             required: [name, shortDescription, icon]
 *             properties:
 *               name:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *                 description: Gambar PNG/JPEG/JPG
 *     responses:
 *       200:
 *         description: Berhasil update bab
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Chapter'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
route.put(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("icon"),
  validate(chapterValidation.updateData),
  chapterController.update
);
/**
 * @swagger
 * /chapters/{id}:
 *   delete:
 *     tags: [Chapters]
 *     summary: Hapus bab (teacher only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil hapus bab
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
route.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  chapterController.destroy
);

export default route;
