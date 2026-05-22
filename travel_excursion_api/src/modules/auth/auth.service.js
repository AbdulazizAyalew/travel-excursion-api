const bcrypt = require("bcryptjs");
const prisma = require("../../config/prisma");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../../utils/email.utils");
const {
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
} = require("../../utils/token.utils");

const register = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const { password: _, ...userWithoutPassword } = user;

  const accessToken = generateAccessToken(userWithoutPassword);
  const refreshToken = await generateRefreshToken(userWithoutPassword);

  return { user: userWithoutPassword, accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token is required");
    error.status = 400;
    throw error;
  }

  const { newAccessToken, newRefreshToken } =
    await refreshAccessToken(refreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};


const forgotPassword = async (email) => {
  // Checking if the email is registered before we send the reset Token
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  // Generating random Plain Token
  const plainToken = crypto.randomBytes(32).toString("hex");

  // Hashing the generated Plain Token 
  const hashedToken = crypto
    .createHash("sha256")
    .update(plainToken)
    .digest("hex");

  // Setting the expiry date of the generated token
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // Deleting the previous Password reset token for that specifc user
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  // Adding the new hashed token to the DB
  await prisma.passwordResetToken.create({
    data: {
      token: hashedToken,
      userId: user.id,
      expiresAt,
    },
  });

  // Sending the plain Token for the User via email
  await sendPasswordResetEmail(email, plainToken);
};

const resetPassword = async (plainToken, newPassword) => {
  // Hashing the plain token to compare with the one in the DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(plainToken)
    .digest("hex");

  // Finidin the Hashed Token in the DB
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
  });

  // Checking the token if it exists
  if (!resetToken) {
    const error = new Error("Invalid or expired reset token");
    error.status = 400;
    throw error;
  }

  // Reset Token Expired if True
  if (new Date() > resetToken.expiresAt) {
    await prisma.passwordResetToken.delete({ where: { token: hashedToken } });
    const error = new Error("Invalid or expired reset token");
    error.status = 400;
    throw error;
  }

  // Hashing the new password before it entered into the DB
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update the password for the user
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // Delete the Reset Token after updating the password
  await prisma.passwordResetToken.delete({ where: { token: hashedToken } });
};

// Add to exports
module.exports = { register, login, refresh, forgotPassword, resetPassword };