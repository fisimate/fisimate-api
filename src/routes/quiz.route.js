import express from "express";
import { quizController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";
import quizAttemptController from "../controllers/quizAttempt.controller.js";
import quizReviewController from "../controllers/quizReview.controller.js";
import upload from "../lib/multer.js";
import validate from "../middlewares/validate.js";
import quizReviewValidation from "../validations/quizReview.validation.js";

const router = express.Router();

/**
 * @swagger
 * /quizzes/{simulationId}:
 *   get:
 *     tags: [Quizzes]
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
router.get(
  "/:simulationId",
  authenticateUser,
  quizController.getQuizBySimulation
);
/**
 * @swagger
 * /quizzes/{simulationId}:
 *   post:
 *     tags: [Quizzes]
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
  "/:simulationId",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("image"),
  quizController.create
);
/**
 * @swagger
 * /quizzes/{simulationId}:
 *   put:
 *     tags: [Quizzes]
 *     summary: Update soal kuis dan opsi jawabannya (teacher only)
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
  "/:simulationId",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  quizController.update
);
/**
 * @swagger
 * /quizzes/{simulationId}:
 *   delete:
 *     tags: [Quizzes]
 *     summary: Hapus soal kuis (teacher only)
 *     description: >-
 *       Meski path param bernama simulationId, controller menggunakan nilai ini sebagai
 *       questionId (question ID) saat menghapus.
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Question ID yang akan dihapus
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
  "/:simulationId",
  authenticateUser,
  authorizeRoles("teacher"),
  quizController.deleteQuizById
);

/**
 * @swagger
 * /quizzes/{simulationId}/attempt:
 *   post:
 *     tags: [Quizzes]
 *     summary: Kirim jawaban kuis untuk sebuah simulasi (membuat attempt baru atau menimpa attempt sebelumnya)
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
 *             required: [responses]
 *             properties:
 *               responses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [questionId, selectedOptionId]
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       format: uuid
 *                     selectedOptionId:
 *                       type: string
 *                       format: uuid
 *     responses:
 *       200:
 *         description: Berhasil menjawab simulasi
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
 *                         savedResponses:
 *                           type: array
 *                           items:
 *                             type: object
 *                         score:
 *                           type: number
 *                         notAnswered:
 *                           type: integer
 *                         answered:
 *                           type: integer
 *       400:
 *         description: Responses tidak valid atau jawaban tidak sesuai soal/simulasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
// attempt simulation
router.post(
  "/:simulationId/attempt",
  authenticateUser,
  quizAttemptController.createAttempt
);
/**
 * @swagger
 * /quizzes/result/{simulationId}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Dapatkan skor hasil attempt user yang login pada sebuah simulasi
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data skor
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
 *                         score:
 *                           type: number
 *                         correctResponses:
 *                           type: integer
 *                         incorrectResponses:
 *                           type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         description: Attempt tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get(
  "/result/:simulationId",
  authenticateUser,
  quizAttemptController.getUserScore
);
/**
 * @swagger
 * /quizzes/attempt/me:
 *   get:
 *     tags: [Quizzes]
 *     summary: Dapatkan seluruh riwayat attempt kuis milik user yang login
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
 *                         allOf:
 *                           - $ref: '#/components/schemas/QuizAttempt'
 *                           - type: object
 *                             properties:
 *                               simulation:
 *                                 $ref: '#/components/schemas/Simulation'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.get(
  "/attempt/me",
  authenticateUser,
  quizAttemptController.getAllAttempts
);
/**
 * @swagger
 * /quizzes/{simulationId}/attempt:
 *   get:
 *     tags: [Quizzes]
 *     summary: Dapatkan attempt kuis milik user yang login pada sebuah simulasi (beserta detail soal & jawaban)
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *                       $ref: '#/components/schemas/QuizAttempt'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  "/:simulationId/attempt",
  authenticateUser,
  quizAttemptController.getAttemptBySimulationId
);
/**
 * @swagger
 * /quizzes/attempt/history/{userId}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Dapatkan seluruh riwayat attempt kuis milik user tertentu
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *                         allOf:
 *                           - $ref: '#/components/schemas/QuizAttempt'
 *                           - type: object
 *                             properties:
 *                               simulation:
 *                                 $ref: '#/components/schemas/Simulation'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
// get attempt history
router.get(
  "/attempt/history/:userId",
  authenticateUser,
  quizAttemptController.getAttemptHistories
);

/**
 * @swagger
 * /quizzes/{simulationId}/review:
 *   get:
 *     tags: [Quizzes]
 *     summary: Dapatkan review (PDF pembahasan) terbaru dari sebuah simulasi
 *     parameters:
 *       - in: path
 *         name: simulationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *                       $ref: '#/components/schemas/QuizReview'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
// simulation review
router.get(
  "/:simulationId/review",
  authenticateUser,
  quizReviewController.index
);
/**
 * @swagger
 * /quizzes/{simulationId}/review:
 *   post:
 *     tags: [Quizzes]
 *     summary: Buat review (PDF pembahasan) untuk simulasi (teacher only)
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
 *                 description: File PDF pembahasan
 *     responses:
 *       200:
 *         description: Berhasil membuat data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/QuizReview'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post(
  "/:simulationId/review",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("filePath"),
  validate(quizReviewValidation.createData),
  quizReviewController.create
);
/**
 * @swagger
 * /quizzes/{simulationId}/review:
 *   put:
 *     tags: [Quizzes]
 *     summary: Update review (PDF pembahasan) simulasi (teacher only)
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
 *                 description: File PDF pembahasan
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
 *                       $ref: '#/components/schemas/QuizReview'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/:simulationId/review",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("filePath"),
  validate(quizReviewValidation.updateData),
  quizReviewController.update
);
/**
 * @swagger
 * /quizzes/{simulationId}/review:
 *   delete:
 *     tags: [Quizzes]
 *     summary: Hapus review simulasi (teacher only)
 *     parameters:
 *       - in: path
 *         name: simulationId
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
  "/:simulationId/review",
  authenticateUser,
  authorizeRoles("teacher"),
  quizReviewController.destroy
);

export default router;
