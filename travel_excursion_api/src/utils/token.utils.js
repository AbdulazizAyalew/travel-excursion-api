const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");


//To generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
  );
};

// To generate new Refresh Tokens
const generateRefreshToken = async (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  return token;
};


const refreshAccessToken = async (refreshToken) => {

  // This step is to validate the refreshToken Wheter it is valid or not.
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    const error = new Error("Invalid or expired refresh token");
    error.status = 401;
    throw error;
  }

  // This is to check whether the Refresh token is in the DB or not
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken) {
    const error = new Error("Refresh token not found or already used");
    error.status = 401;
    throw error;
  }

  // Delete the refreshToken either expired or not for Security purposes
  await prisma.refreshToken.delete({ where: { token: refreshToken } });

  // To check if whether the Refresh Token has expired or not
  if (new Date() > storedToken.expiresAt) {
    
    const error = new Error("Refresh token expired");
    error.status = 401;
    throw error;
  }

  // Get the USER_ID that is connected 
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, role: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 401;
    throw error;
  }

  // This will generated new Issue
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user);

  return { newAccessToken, newRefreshToken };
};

// Add to exports
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
};

