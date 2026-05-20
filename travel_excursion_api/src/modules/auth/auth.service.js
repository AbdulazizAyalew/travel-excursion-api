const bcrypt = require("bcryptjs");
const prisma = require("../../config/prisma");
const {
  generateAccessToken,
  generateRefreshToken,
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

module.exports = { register, login };
