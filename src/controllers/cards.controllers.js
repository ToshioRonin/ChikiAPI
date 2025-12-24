import prisma from "../config/prisma.js";

// Obtener todas las cartas que NO están en la "papelera" (activas)
export const getAllCards = async (req, res) => {
  try {
    const cards = await prisma.card.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las cartas", error: error.message });
  }
};

// Obtener solo las cartas que han sido "borradas lógicamente" (la papelera)
export const getTrashedCards = async (req, res) => {
  try {
    const cards = await prisma.card.findMany({
      where: { isActive: false }
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la papelera", error: error.message });
  }
};

// Crear una nueva carta
export const createCard = async (req, res) => {
  try {
    const { name, elemento, type, description, power, rareza, image } = req.body;
    const newCard = await prisma.card.create({
      data: {
        name,
        elemento,
        type,
        description,
        power: parseInt(power),
        rareza,
        image
      }
    });
    res.status(201).json(newCard);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la carta", error: error.message });
  }
};

// Actualizar una carta
export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.power) data.power = parseInt(data.power);

    const updatedCard = await prisma.card.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(updatedCard);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar", error: error.message });
  }
};

// Eliminación Lógica (Enviar a la papelera)
export const softDeleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.card.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });
    res.json({ message: "Carta movida a la papelera (oculta del catálogo)" });
  } catch (error) {
    res.status(500).json({ message: "Error al ocultar la carta", error: error.message });
  }
};

// Eliminación Física (Borrar definitivamente de la DB)
export const hardDeleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.card.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Carta eliminada definitivamente de la base de datos" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar físicamente", error: error.message });
  }
};

// Restaurar una carta de la papelera
export const restoreCard = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.card.update({
      where: { id: parseInt(id) },
      data: { isActive: true }
    });
    res.json({ message: "Carta restaurada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al restaurar", error: error.message });
  }
};