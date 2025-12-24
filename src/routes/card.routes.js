import { Router } from "express";
import {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  softDeleteCard,
  hardDeleteCard,
  getTrashedCards,
  restoreCard
} from "../controllers/cards.controllers.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Cards
 *     description: Gestión de cartas del sistema
 */

/**
 * @swagger
 * /api/cards:
 *   get:
 *     tags:
 *       - Cards
 *     summary: Obtener todas las cartas activas
 *     description: Retorna el catálogo completo de cartas visibles para los usuarios.
 *     responses:
 *       200:
 *         description: Lista de cartas obtenida exitosamente
 */
router.get("/", getAllCards);

/**
 * @swagger
 * /api/cards/trash:
 *   get:
 *     tags:
 *       - Cards
 *     summary: Obtener cartas en la papelera
 *     description: |
 *       Retorna todas las cartas eliminadas de forma lógica.
 *       **Acceso exclusivo para administradores.**
 *     responses:
 *       200:
 *         description: Lista de cartas ocultas
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 */
router.get("/trash", verifyToken, isAdmin, getTrashedCards);

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     tags:
 *       - Cards
 *     summary: Obtener carta por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la carta
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Datos de la carta
 *       404:
 *         description: Carta no encontrada
 */
router.get("/:id", getCardById);

/**
 * @swagger
 * /api/cards:
 *   post:
 *     tags:
 *       - Cards
 *     summary: Crear una nueva carta
 *     description: |
 *       Crea una carta nueva dentro del catálogo.
 *       **Solo accesible para administradores.**
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - elemento
 *               - type
 *               - power
 *               - rareza
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Espada Rúnica
 *               elemento:
 *                 type: string
 *                 example: fuego
 *               type:
 *                 type: string
 *                 example: arma
 *               description:
 *                 type: string
 *                 example: Una espada forjada en el núcleo de un volcán ancestral
 *               power:
 *                 type: integer
 *                 example: 85
 *               rareza:
 *                 type: string
 *                 example: legendario
 *               image:
 *                 type: string
 *                 example: espada_01
 *     responses:
 *       201:
 *         description: Carta creada exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 */
router.post("/", verifyToken, isAdmin, createCard);

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     tags:
 *       - Cards
 *     summary: Actualizar una carta
 *     description: Modifica los datos de una carta existente (**Solo Admin**).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Carta actualizada correctamente
 *       404:
 *         description: Carta no encontrada
 */
router.put("/:id", verifyToken, isAdmin, updateCard);

/**
 * @swagger
 * /api/cards/{id}/restore:
 *   patch:
 *     tags:
 *       - Cards
 *     summary: Restaurar carta de la papelera
 *     description: Reactiva una carta eliminada lógicamente (**Solo Admin**).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Carta restaurada exitosamente
 *       404:
 *         description: Carta no encontrada
 */
router.patch("/:id/restore", verifyToken, isAdmin, restoreCard);

/**
 * @swagger
 * /api/cards/{id}:
 *   delete:
 *     tags:
 *       - Cards
 *     summary: Enviar carta a la papelera
 *     description: |
 *       Realiza una **eliminación lógica**, ocultando la carta del catálogo
 *       sin eliminarla de la base de datos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Carta enviada a la papelera
 */
router.delete("/:id", verifyToken, isAdmin, softDeleteCard);

/**
 * @swagger
 * /api/cards/{id}/permanent:
 *   delete:
 *     tags:
 *       - Cards
 *     summary: Eliminar carta definitivamente
 *     description: |
 *       Borra de forma permanente la carta de la base de datos.
 *       ⚠️ Esta acción **no se puede deshacer**.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Carta eliminada permanentemente
 */
router.delete("/:id/permanent", verifyToken, isAdmin, hardDeleteCard);

export default router;
