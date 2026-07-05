import express from "express";
import {
  materialController,
  quizController,
  simulationController,
} from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import upload from "../lib/multer.js";
import validate from "../middlewares/validate.js";
import simulationValidation from "../validations/simulation.validation.js";
import materialValidation from "../validations/material.validation.js";
import questionValidation from "../validations/question.validation.js";

const router = express.Router();

/**
 * @swagger
 * /simulations:
 *   get:
 *     tags: [Simulations]
 *     summary: Dapatkan semua simulasi (bisa difilter), termasuk progress belajar user yang login
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter judul simulasi (case-insensitive, partial match)
 *       - in: query
 *         name: chapterId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter berdasarkan bab
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan semua simulasi
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
 *                         allOf:
 *                           - $ref: '#/components/schemas/Simulation'
 *                           - type: object
 *                             properties:
 *                               simulationProgress:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/SimulationProgress'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         description: Data simulasi kosong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get("/", authenticateUser, simulationController.index);
/**
 * @swagger
 * /simulations/{id}:
 *   get:
 *     tags: [Simulations]
 *     summary: Dapatkan detail satu simulasi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data simulasi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Simulation'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", authenticateUser, simulationController.show);
/**
 * @swagger
 * /simulations/{id}:
 *   put:
 *     tags: [Simulations]
 *     summary: Update simulasi (teacher only)
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
 *     responses:
 *       200:
 *         description: Berhasil update data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Simulation'
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
  upload.single("icon"),
  validate(simulationValidation.updateData),
  simulationController.update
);

/**
 * @swagger
 * /simulations/{simulationId}/materials:
 *   get:
 *     tags: [Simulations]
 *     summary: Dapatkan materi (PDF) dari sebuah simulasi
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan materi simulasi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Material'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
// material route
router.get(
  "/:simulationId/materials",
  authenticateUser,
  materialController.show
);
/**
 * @swagger
 * /simulations/{simulationId}/materials:
 *   post:
 *     tags: [Simulations]
 *     summary: Tambah materi (PDF) ke simulasi (teacher only)
 *     parameters:
 *       - in: path
 *         name: simulationId
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
 *             required: [filePath]
 *             properties:
 *               filePath:
 *                 type: string
 *                 format: binary
 *                 description: File PDF materi
 *     responses:
 *       200:
 *         description: Berhasil membuat materi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Material'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.post(
  "/:simulationId/materials",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("filePath"),
  validate(materialValidation.createData),
  materialController.create
);
/**
 * @swagger
 * /simulations/{simulationId}/materials/{id}:
 *   put:
 *     tags: [Simulations]
 *     summary: Update materi simulasi (teacher only)
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Material ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [filePath]
 *             properties:
 *               filePath:
 *                 type: string
 *                 format: binary
 *                 description: File PDF materi
 *     responses:
 *       200:
 *         description: Berhasil update data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Material'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/:simulationId/materials/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("filePath"),
  validate(materialValidation.updateData),
  materialController.update
);
/**
 * @swagger
 * /simulations/{simulationId}/materials/{id}:
 *   delete:
 *     tags: [Simulations]
 *     summary: Hapus materi simulasi (teacher only)
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Material ID
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
  "/:simulationId/materials/:id",
  authenticateUser,
  authorizeRoles("teacher"),
  materialController.destroy
);

/**
 * @swagger
 * /simulations/{simulationId}/progress:
 *   post:
 *     tags: [Simulations]
 *     summary: Simpan/update progress belajar user pada sebuah simulasi
 *     parameters:
 *       - in: path
 *         name: simulationId
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
 *             required: [currentStep]
 *             properties:
 *               currentStep:
 *                 type: integer
 *                 description: Hanya diupdate jika lebih besar dari step tersimpan sebelumnya
 *     responses:
 *       200:
 *         description: Berhasil update progress
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SimulationProgress'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
// progress
router.post(
  "/:simulationId/progress",
  authenticateUser,
  simulationController.createProgress
);

/**
 * @swagger
 * /simulations/{simulationId}/quizzes:
 *   get:
 *     tags: [Simulations]
 *     summary: Dapatkan semua kuis (soal + opsi jawaban) dari sebuah simulasi
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan simulasi beserta soal
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Simulation'
 *                         - type: object
 *                           properties:
 *                             question:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Question'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
// quiz route
router.get(
  "/:simulationId/quizzes",
  authenticateUser,
  quizController.getQuizBySimulation
);
/**
 * @swagger
 * /simulations/{simulationId}/quizzes:
 *   post:
 *     tags: [Simulations]
 *     summary: Tambah soal kuis baru pada simulasi (teacher only)
 *     parameters:
 *       - in: path
 *         name: simulationId
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
 *             required: [text, options]
 *             properties:
 *               text:
 *                 type: string
 *                 description: Teks pertanyaan
 *               options:
 *                 type: string
 *                 description: >-
 *                   JSON string array opsi jawaban, contoh:
 *                   [{"text":"Opsi A","isCorrect":true},{"text":"Opsi B","isCorrect":false}]
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Opsional, gambar soal PNG/JPEG/JPG
 *     responses:
 *       200:
 *         description: Berhasil membuat pertanyaan
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Question'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post(
  "/:simulationId/quizzes",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("image"),
  validate(questionValidation.createData),
  quizController.create
);
/**
 * @swagger
 * /simulations/{simulationId}/quizzes/{questionId}:
 *   put:
 *     tags: [Simulations]
 *     summary: Update soal kuis dan opsi jawabannya (teacher only)
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: questionId
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
 *             required: [text, options]
 *             properties:
 *               text:
 *                 type: string
 *               options:
 *                 type: string
 *                 description: >-
 *                   JSON string array opsi jawaban. Sertakan "id" pada opsi untuk update opsi
 *                   yang sudah ada, atau kosongkan "id" untuk membuat opsi baru.
 *               deleteImage:
 *                 type: string
 *                 enum: ["true", "false"]
 *                 description: Set "true" untuk menghapus gambar soal yang ada
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Opsional, gambar soal baru PNG/JPEG/JPG
 *     responses:
 *       200:
 *         description: Berhasil memperbarui pertanyaan (mengembalikan seluruh simulasi + soal)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Simulation'
 *                         - type: object
 *                           properties:
 *                             question:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Question'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/:simulationId/quizzes/:questionId",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("image"),
  quizController.update
);
/**
 * @swagger
 * /simulations/{simulationId}/quizzes/{questionId}:
 *   delete:
 *     tags: [Simulations]
 *     summary: Hapus soal kuis (teacher only)
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil menghapus data
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
  "/:simulationId/quizzes/:questionId",
  authenticateUser,
  authorizeRoles("teacher"),
  quizController.deleteQuizById
);

/**
 * @swagger
 * /simulations/{simulationId}/generate:
 *   get:
 *     tags: [Simulations]
 *     summary: Generate soal kuis baru menggunakan AI (Gemini) berdasarkan judul simulasi & bab
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil generate soal
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
 *                         text:
 *                           type: string
 *                         quizOptions:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               text:
 *                                 type: string
 *                               isCorrect:
 *                                 type: boolean
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
// generate route
router.get(
  "/:simulationId/generate",
  authenticateUser,
  quizController.generate
);

export default router;
