import app from "./app.js";
import prisma from "./config/prisma.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ conexion inestable con la BD:", error);
    process.exit(1); 
  }
}

startServer();