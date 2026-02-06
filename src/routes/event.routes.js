import { Router } from "express";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  forceStatus
} from "../controllers/event.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Eventos
 *     description: Gestión y participación en eventos del sistema
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags:
 *       - Eventos
 *     summary: Obtener todos los eventos
 *     description: |
 *       Retorna la lista completa de eventos junto con
 *       el conteo de participantes inscritos.
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida exitosamente
 */
router.get("/", getAllEvents);

/**
 * @swagger
 * /api/events:
 *   post:
 *     tags:
 *       - Eventos
 *     summary: Crear un nuevo evento
 *     description: |
 *       Crea un evento nuevo en el sistema.
 *       **Acceso exclusivo para administradores.**
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 */
router.post("/", verifyToken, isAdmin, createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     tags:
 *       - Eventos
 *     summary: Actualizar un evento
 *     description: |
 *       Permite modificar un evento **solo si aún no tiene
 *       participantes inscritos**.
 *       **Solo Admin.**
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del evento
 *         schema:
 *           type: integer
 *           example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente
 *       403:
 *         description: Acción prohibida, el evento ya tiene participantes
 *       404:
 *         description: Evento no encontrado
 */
router.put("/:id", verifyToken, isAdmin, updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     tags:
 *       - Eventos
 *     summary: Eliminar un evento
 *     description: |
 *       Elimina un evento **solo si no hay participantes inscritos**.
 *       **Acceso exclusivo para administradores.**
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del evento
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente
 *       403:
 *         description: No se puede eliminar, hay participantes inscritos
 *       404:
 *         description: Evento no encontrado
 */
router.delete("/:id", verifyToken, isAdmin, deleteEvent);

/**
 * @swagger
 * /api/events/{id}/join:
 *   post:
 *     tags:
 *       - Eventos
 *     summary: Inscribirse en un evento
 *     description: |
 *       Permite a un usuario autenticado inscribirse en un evento.
 *       El evento debe estar **activo** y tener **cupo disponible**.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del evento
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       201:
 *         description: Inscripción realizada exitosamente
 *       400:
 *         description: Evento lleno o no activo
 *       401:
 *         description: No autenticado
 */
router.post("/:id/join", verifyToken, joinEvent);

/**
 * @swagger
 * /api/events/{id}/status:
 *   patch:
 *     tags:
 *       - Eventos
 *     summary: Cambiar estado del evento manualmente
 *     description: |
 *       Permite forzar el estado de un evento.
 *       Estados válidos:
 *       - `activo`
 *       - `proximamente`
 *       - `finalizado`
 *       **Solo Admin.**
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del evento
 *         schema:
 *           type: integer
 *           example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [activo, proximamente, finalizado]
 *                 example: activo
 *     responses:
 *       200:
 *         description: Estado del evento actualizado correctamente
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Evento no encontrado
 */
router.patch("/:id/status", verifyToken, isAdmin, forceStatus);

export default router;
