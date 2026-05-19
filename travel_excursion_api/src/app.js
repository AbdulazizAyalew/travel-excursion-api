const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// I chose dotenv-safe because it will help us to debug errors by comparing .dotenv and .env and saves lots of debugging time
require("dotenv-safe").config();

const app = express();

// Telling the app to use these middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health checker
app.get("/", (req, res) => {
  res.json({ message: "Travel Excursion API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
