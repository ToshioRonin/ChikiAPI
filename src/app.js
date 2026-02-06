import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

app.use(express.json());

app.use("/api", routes);

setupSwagger(app);

export default app;