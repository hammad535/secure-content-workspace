const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const articleRoutes = require('./routes/article.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// CORS configuration for production
const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  console.warn('WARNING: FRONTEND_URL environment variable is not set. CORS may not work correctly.');
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      // Production safety: reject localhost in production
      if (process.env.NODE_ENV === 'production' && origin.includes('localhost')) {
        console.warn(`Blocked localhost request from origin: ${origin}`);
        return callback(new Error('Localhost origins are not allowed in production'));
      }

      // Allow only the configured frontend URL
      if (frontendUrl && origin === frontendUrl) {
        return callback(null, true);
      }

      // If FRONTEND_URL is not set, allow all (development fallback)
      if (!frontendUrl) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

module.exports = app;
