const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

const register = async (userData) => {
  const { email, password, name, role } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('Email already exists');
    error.status = 409;
    throw error;
  }

  // Admin Bootstrap: First user automatically becomes ADMIN
  const userCount = await prisma.user.count();
  let finalRole = role || 'VIEWER';
  
  if (userCount === 0) {
    // First user becomes ADMIN automatically
    finalRole = 'ADMIN';
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: finalRole,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  const token = generateToken({ userId: user.id, role: user.role });

  return { user, token };
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = generateToken({ userId: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
};

module.exports = { register, login };
