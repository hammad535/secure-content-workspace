const prisma = require('../config/database');

const getAllArticles = async (userRole, userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const where = {};

  if (userRole === 'ADMIN') {
    // Admin sees all articles
  } else if (userRole === 'EDITOR') {
    // Editor sees published articles + their own drafts
    where.OR = [
      { status: 'PUBLISHED' },
      { authorId: userId },
    ];
  } else {
    // Viewer sees only published articles
    where.status = 'PUBLISHED';
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getArticleById = async (id, userRole, userId) => {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!article) {
    const error = new Error('Article not found');
    error.status = 404;
    throw error;
  }

  // Check access
  if (article.status === 'DRAFT') {
    if (userRole !== 'ADMIN' && article.authorId !== userId) {
      const error = new Error('Access denied');
      error.status = 403;
      throw error;
    }
  }

  return article;
};

const createArticle = async (articleData, authorId) => {
  const { title, content, status = 'DRAFT' } = articleData;

  const article = await prisma.article.create({
    data: {
      title,
      content,
      status,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return article;
};

const updateArticle = async (id, articleData, userRole, userId) => {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    const error = new Error('Article not found');
    error.status = 404;
    throw error;
  }

  // Check ownership or admin
  if (userRole !== 'ADMIN' && article.authorId !== userId) {
    const error = new Error('You can only edit your own articles');
    error.status = 403;
    throw error;
  }

  const updatedArticle = await prisma.article.update({
    where: { id },
    data: articleData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedArticle;
};

const deleteArticle = async (id, userRole) => {
  if (userRole !== 'ADMIN') {
    const error = new Error('Only admins can delete articles');
    error.status = 403;
    throw error;
  }

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    const error = new Error('Article not found');
    error.status = 404;
    throw error;
  }

  await prisma.article.delete({
    where: { id },
  });

  return { message: 'Article deleted successfully' };
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
