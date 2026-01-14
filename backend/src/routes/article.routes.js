const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createArticleSchema,
  updateArticleSchema,
} = require('../validations/article.schema');

// Public route - no auth required
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(createArticleSchema),
  articleController.createArticle
);

router.put(
  '/:id',
  authenticate,
  validate(updateArticleSchema),
  articleController.updateArticle
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  articleController.deleteArticle
);

module.exports = router;
