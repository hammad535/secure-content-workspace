const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  // Convert JWT_EXPIRES_IN to number, fallback to 3600 seconds (1 hour) if invalid
  const expiresIn = Number(process.env.JWT_EXPIRES_IN) || 3600;
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
