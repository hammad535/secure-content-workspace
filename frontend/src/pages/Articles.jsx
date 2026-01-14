import { useState, useEffect } from 'react';
import { articleAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    fetchArticles();
  }, [pagination.page]);

  const fetchArticles = async () => {
    try {
      const response = await articleAPI.getAll({
        page: pagination.page,
        limit: 10,
      });
      setArticles(response.data.data.articles);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (articleId) => {
    setArticles(articles.filter((a) => a.id !== articleId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <p className="mt-2 text-gray-600">
          {pagination.total} article{pagination.total !== 1 ? 's' : ''} found
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Get started by creating your first article.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} onDelete={handleDelete} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
              <div className="text-sm text-gray-700">
                Showing page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Articles;
