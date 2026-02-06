import { Router } from "express";
import authRoutes from "./auth.routes.js";
import cardRoutes from "./card.routes.js";
import eventRoutes from "./event.routes.js";

const router = Router();

// Prefijo de rutas para Autenticación
router.use("/auth", authRoutes);

// Prefijo de rutas para el catálogo de Cartas
router.use("/cards", cardRoutes);

// Prefijo de rutas para el catálogo de Eventos
router.use("/events", eventRoutes);

export default router;