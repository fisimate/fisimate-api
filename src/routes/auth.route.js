import express from "express";
import passport from "passport";
import { authController } from "../controllers/index.js";
import { useFacebookStrategy, useGoogleStrategy } from "../lib/passport.js";
import authValidation from "../validations/auth.validation.js";
import validate from "../middlewares/validate.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();


useGoogleStrategy();
useFacebookStrategy();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Dapatkan URL login Google OAuth
 *     security: []
 *     responses:
 *       200:
 *         description: URL login Google berhasil didapatkan
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
 *                         authUrl:
 *                           type: string
 *                           format: uri
 */
// google auth
router.get("/google", authController.getGoogleUrl);
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Callback OAuth Google (dipanggil oleh Google, bukan dipanggil langsung oleh client)
 *     security: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code dari Google
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan JWT
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
 *                         token:
 *                           type: string
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.googleCallback
);

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     tags: [Auth]
 *     summary: Dapatkan URL login Facebook OAuth
 *     security: []
 *     responses:
 *       200:
 *         description: URL login Facebook berhasil didapatkan
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
 *                         authUrl:
 *                           type: string
 *                           format: uri
 */
// facebook auth
router.get("/facebook", authController.getFacebookUrl);
/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Callback OAuth Facebook (dipanggil oleh Facebook, bukan dipanggil langsung oleh client)
 *     security: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code dari Facebook
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan JWT
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
 *                         token:
 *                           type: string
 */
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.facebookCallback
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrasi akun baru (role user/siswa)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullname, email, nis, password, passwordConfirmation]
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
 *                 minLength: 8
 *               passwordConfirmation:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Berhasil mendaftar akun
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
 */
// basic auth
router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login dengan email & password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Login berhasil
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
 *                         access_token:
 *                           type: string
 *                         refresh_token:
 *                           type: string
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/login", validate(authValidation.login), authController.login);
/**
 * @swagger
 * /auth/token/refresh/{refreshToken}:
 *   get:
 *     tags: [Auth]
 *     summary: Dapatkan access token baru menggunakan refresh token
 *     security: []
 *     parameters:
 *       - in: path
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil refresh token
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
 *                         access_token:
 *                           type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/token/refresh/:refreshToken", authController.refreshToken);
// router.post("/verify", validate(authValidation.verify), authController.verify);

export default router;
