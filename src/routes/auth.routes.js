import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout
} from "../controllers/auth.controllers.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Autenticación
 *     description: Endpoints relacionados con registro, inicio de sesión y tokens
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registrar un nuevo usuario
 *     description: |
 *       Crea un nuevo usuario en el sistema vinculando sus cuentas de **Minecraft** y **Discord**.
 *       La contraseña se encripta antes de almacenarse.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - MCName
 *               - DCName
 *               - email
 *               - password
 *             properties:
 *               MCName:
 *                 type: string
 *                 example: ChikiPlayer
 *               DCName:
 *                 type: string
 *                 example: Chiki#1234
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación o el email ya existe
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión
 *     description: |
 *       Autentica al usuario y genera:
 *       - **Access Token** (JSON)
 *       - **Refresh Token** (Cookie HTTPOnly)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/refresh:
 *   get:
 *     tags:
 *       - Autenticación
 *     summary: Refrescar Access Token
 *     description: |
 *       Genera un nuevo **Access Token** usando el **Refresh Token**
 *       almacenado en cookies HTTPOnly.
 *     responses:
 *       200:
 *         description: Nuevo Access Token generado
 *       401:
 *         description: Refresh Token no encontrado
 *       403:
 *         description: Refresh Token inválido o expirado
 */
router.get("/refresh", refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Cerrar sesión
 *     description: |
 *       Elimina la cookie del **Refresh Token** y finaliza la sesión del usuario.
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
router.post("/logout", logout);

export default router;
