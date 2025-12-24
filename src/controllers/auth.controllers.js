import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Registro de nuevo usuario
export const register = async (req, res) => {
  try {
    const { MCName, DCName, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { MCName, DCName, email, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// Inicio de sesión con Access Token y Refresh Token en Cookie
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    // Generar Access Token (Corta duración: 15 min)
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generar Refresh Token (Larga duración: 7 días)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || "refresh_secret_key",
      { expiresIn: "7d" }
    );

    // Enviar Refresh Token en una cookie HTTPOnly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: { id: user.id, role: user.role, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};

// Renovación del Access Token usando el Refresh Token de la cookie
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: "Refresh Token not found" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret_key", async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid Refresh Token" });

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) return res.status(403).json({ message: "User not found" });

      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token", error: error.message });
  }
};

// Cierre de sesión y limpieza de la cookie
export const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error during logout", error: error.message });
  }
};