const destinationRoutes = require("./modules/destinations/destination.routes");
const excursionRoutes = require("./modules/excursions/excursion.routes");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./modules/auth/auth.routes");
const { success } = require("zod");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const packageRoutes = require("./modules/packages/package.routes");
const bookingRoutes = require("./modules/bookings/booking.routes");
const reviewRoutes = require("./modules/reviews/review.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const {
  generalLimiter,
  authLimiter,
} = require("./middlewares/rateLimit.middleware");


// I chose dotenv-safe because it will help us to debug errors by comparing .dotenv and .env and saves lots of debugging time
require("dotenv-safe").config();

const app = express();
// General API Limiter
app.use("/api", generalLimiter);

// This handles the authentication routes with authLimiter
app.use("/api/auth", authLimiter, authRoutes);

// Telling the app to use these middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// To test the health of the app
app.get("/", (req, res) => {
  res.json({ message: "Travel Excursion API is running" });
});


// Booking Routes
app.use("/api/bookings",bookingRoutes);

// Revieww Routes
app.use("/api/reviews",reviewRoutes);

// Admin Routes
app.use("/api/admin/stats",adminRoutes);

// Image upload routes
app.use("/uploads", express.static("uploads"));

// Destination routes
app.use("/api/destinations", destinationRoutes);

app.use("/api/excursions", excursionRoutes);

app.use("/api/packages",packageRoutes);



// This handles page that have no route 
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// Global error handler that will handle any next(error) calls
app.use((err, req, res, next) => {
  
  //Zod Validation error 
  if (err.name === "ZodError" && err.errors) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.errors.map((e) => ({
        field: e.path.join(""),
        message: e.message,
      })),
    });
  }

  // Multer error handler
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message, // "File too large", "Too many files" etc
    });
  }

  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
