const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const articleRoutes = require('./routes/article.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

module.exports = app;
