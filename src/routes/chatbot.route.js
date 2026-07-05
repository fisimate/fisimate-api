import express from "express";
import { chatbotController } from "../controllers/index.js";
import { authenticateUser } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import chatbotValidation from "../validations/chatbot.validation.js";

const route = express.Router();

/**
 * @swagger
 * /chatbot/generate-question:
 *   post:
 *     tags: [Chatbot]
 *     summary: Generate satu soal pilihan ganda Fisika berdasarkan bab (via SumoPod AI)
 *     description: >
 *       Menggantikan pemanggilan Gemini dari sisi mobile. Backend menyusun prompt,
 *       memanggil SumoPod, lalu menormalisasi & memvalidasi output ke skema baku
 *       (tepat 4 opsi, tepat 1 benar, `answer` sama dengan opsi benar).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [chapter]
 *             properties:
 *               chapter:
 *                 type: string
 *                 example: Gerak Lurus
 *                 description: Nama bab persis seperti field `name` pada GET /chapters
 *     responses:
 *       200:
 *         description: Berhasil menghasilkan soal
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
 *                         questions:
 *                           type: string
 *                           example: Sebuah mobil bergerak lurus...
 *                         options:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               option:
 *                                 type: string
 *                                 example: 20 m/s
 *                               correct:
 *                                 type: boolean
 *                                 example: true
 *                         answer:
 *                           type: string
 *                           example: 20 m/s
 *                         explanation:
 *                           type: string
 *                           example: Karena v = s/t maka...
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 *       422:
 *         description: Output AI tidak dapat dinormalisasi ke skema soal (setelah retry)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       502:
 *         description: Layanan AI (SumoPod) tidak dapat dihubungi / error upstream
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
route.post(
  "/generate-question",
  authenticateUser,
  validate(chatbotValidation.generateQuestion),
  chatbotController.generateQuestion
);

export default route;
