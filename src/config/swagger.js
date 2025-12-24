import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Runic Cards API",
      version: "1.0.0",
      description: "API para el manejo de catálogo de cartas rúnicas y autenticación de usuarios",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de Desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // Indicamos dónde están los archivos con las anotaciones de Swagger
  apis: ["./src/routes/*.js"], 
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log("Documentación de Swagger disponible en http://localhost:3001/api-docs");
};