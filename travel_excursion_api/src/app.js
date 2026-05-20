const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./modules/auth/auth.routes");
const { success } = require("zod");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");


// I chose dotenv-safe because it will help us to debug errors by comparing .dotenv and .env and saves lots of debugging time
require("dotenv-safe").config();

const app = express();

// Telling the app to use these middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// To test the health of the app
app.get("/", (req, res) => {
  res.json({ message: "Travel Excursion API is running" });
});


// That handles the authentication routes
app.use('/api/auth',authRoutes);

// This handles page that have no route 
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// Global error handler that will handle any next(error) calls
app.use((err, req, res, next) => {
  
  //Zod Validation error 
  if (err.name === "ZodError"){
    return res.status(400).json({
      success:false,
      message:'Validation Error',
      errors: err.errors.map((e) => ({
        field: e.path.join(''),
        message: e.message,
      })),
    });
  }

  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
