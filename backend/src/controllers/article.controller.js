const articleService = require('../services/article.service');

const getAllArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userRole = req.user?.role || null;
    const userId = req.user?.id || null;

    const result = await articleService.getAllArticles(userRole, userId, page, limit);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role || null;
    const userId = req.user?.id || null;

    const article = await articleService.getArticleById(
      parseInt(id),
      userRole,
      userId
    );

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const article = await articleService.createArticle(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await articleService.updateArticle(
      parseInt(id),
      req.body,
      req.user.role,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await articleService.deleteArticle(parseInt(id), req.user.role);

    res.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
