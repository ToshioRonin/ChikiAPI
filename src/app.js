import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


app.use("/api", routes);

setupSwagger(app);

export default app;