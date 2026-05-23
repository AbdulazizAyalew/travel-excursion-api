const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message:
        err.name === "TokenExpiredError"
          ? "Access token expired"
          : "Invalid access token",
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated — please login",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — requires one of: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

const authorizeAdmin = requireRole("ADMIN");
const authorizeTourGuide = requireRole("TOUR_GUIDE", "ADMIN");

module.exports = {
  authenticate,
  requireRole,
  authorizeAdmin,
  authorizeTourGuide,
};
