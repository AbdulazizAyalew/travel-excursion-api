const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Check the token from the Header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token missing or malformed",
    });
  }

  // Step 2 — Extract token from the Header
  const token = authHeader.split(" ")[1];

  // Step 3 — Verify token
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch (err) {
    // Token expired or invalid
    return res.status(401).json({
      success: false,
      message:
        err.name === "TokenExpiredError"
          ? "Access token expired"
          : "Invalid access token",
    });
  }
};

// For admin only routes
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied — Admins only",
    });
  }
  next();
};

// For tour guide routes
const authorizeTourGuide = (req, res, next) => {
  if (req.user.role !== "TOUR_GUIDE" && req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied — Tour Guides only",
    });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin, authorizeTourGuide };
