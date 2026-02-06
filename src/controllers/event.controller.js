import prisma from "../config/prisma.js";

// Obtener todos los eventos
export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: { participants: true }
        }
      },
      orderBy: { startDate: "asc" }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener eventos", error: error.message });
  }
};

// Crear evento (Admin)
export const createEvent = async (req, res) => {
  try {
    const { title, tag, description, image, startDate, endDate, maxParticipants, rewards, isFeatured } = req.body;

    // Si este es destacado, quitamos el destacado a los demás
    if (isFeatured) {
      await prisma.event.updateMany({ where: { isFeatured: true }, data: { isFeatured: false } });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        tag,
        description,
        image,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        rewards,
        isFeatured: isFeatured || false
      }
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: "Error al crear evento", error: error.message });
  }
};

// Editar evento (Solo si no hay participantes)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { participants: true } } }
    });

    if (event._count.participants > 0) {
      return res.status(403).json({ message: "No se puede editar: ya existen usuarios inscritos" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: req.body
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar", error: error.message });
  }
};

// Eliminar evento (Solo si no hay participantes)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { participants: true } } }
    });

    if (event._count.participants > 0) {
      return res.status(403).json({ message: "No se puede eliminar: ya existen usuarios inscritos" });
    }

    await prisma.event.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Evento eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};

// Inscripción de usuario
export const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id; // Viene del token

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: { _count: { select: { participants: true } } }
    });

    if (!event || event.status !== "activo") {
      return res.status(400).json({ message: "El evento no está disponible para inscripciones" });
    }

    if (event.maxParticipants && event._count.participants >= event.maxParticipants) {
      return res.status(400).json({ message: "Cupo lleno" });
    }

    const registration = await prisma.eventRegistration.create({
      data: { userId, eventId: parseInt(eventId) }
    });

    res.status(201).json({ message: "Inscripción exitosa", registration });
  } catch (error) {
    res.status(400).json({ message: "Ya estás inscrito o el evento no existe" });
  }
};

// Forzar estado del evento (Admin - Botón para activar/finalizar manualmente)
export const forceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "activo", "proximamente", "finalizado"

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({ message: `Estado actualizado a ${status}`, event: updatedEvent });
  } catch (error) {
    res.status(400).json({ message: "Error al cambiar estado", error: error.message });
  }
};