import express from "express";
import { dashboardController } from "../controllers/index.js";
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Dapatkan statistik dashboard (teacher only)
 *     description: >-
 *       Mengembalikan total siswa, total materi/soal/rumus, top 5 leaderboard,
 *       dan jumlah attempt kuis per bulan (untuk chart).
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data untuk dashboard
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
 *                         totalStudents:
 *                           type: integer
 *                         totalMaterials:
 *                           type: integer
 *                         totalExams:
 *                           type: integer
 *                         totalFormulas:
 *                           type: integer
 *                         leaderboard:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               userId:
 *                                 type: string
 *                                 format: uuid
 *                               _sum:
 *                                 type: object
 *                                 properties:
 *                                   score:
 *                                     type: number
 *                               user:
 *                                 $ref: '#/components/schemas/User'
 *                         attemptsPerMonthChart:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               month:
 *                                 type: integer
 *                               count:
 *                                 type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.get(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  dashboardController.index
);
/**
 * @swagger
 * /dashboard/leaderboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Dapatkan leaderboard siswa berdasarkan total skor kuis
 *     parameters:
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Batas jumlah data yang dikembalikan (default semua data)
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data leaderboard
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
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             format: uuid
 *                           _sum:
 *                             type: object
 *                             properties:
 *                               score:
 *                                 type: number
 *                           user:
 *                             $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.get("/leaderboard", authenticateUser, dashboardController.leaderboard);
/**
 * @swagger
 * /dashboard/mobile:
 *   get:
 *     tags: [Dashboard]
 *     summary: Dapatkan data bab beserta bank soal/materi/rumus untuk aplikasi mobile
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
 *                           - $ref: '#/components/schemas/Chapter'
 *                           - type: object
 *                             properties:
 *                               examBanks:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Bank'
 *                               materialBanks:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Bank'
 *                               formulaBanks:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Bank'
 *       401:
 *         $ref: '#/components/responses/Unauthenticated'
 */
router.get("/mobile", authenticateUser, dashboardController.mobileDashboard);

export default router;
