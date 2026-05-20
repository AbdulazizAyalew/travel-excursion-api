const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Travel & Excursion Booking API",
      version: "1.0.0",
      description:
        "Backend API for a Travel and Excursion Booking Platform where users can browse destinations, book trips, and admins manage tours.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/modules/**/*.routes.js"], // scans all route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
