import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await articleAPI.getById(id);
      setArticle(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await articleAPI.delete(id);
      navigate('/articles');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete article');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
          {error || 'Article not found'}
        </div>
        <Link
          to="/articles"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/articles"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Articles
        </Link>
        <div className="flex space-x-2">
          {(user?.role === 'ADMIN' ||
            (user?.role === 'EDITOR' && article.authorId === user?.id)) && (
            <Link
              to={`/articles/${article.id}/edit`}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
            >
              Edit
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
          <span className="text-sm text-gray-600">By {article.author.name}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              article.status === 'PUBLISHED'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {article.status}
          </span>
        </div>
        <div
          className="prose max-w-none prose-headings:font-semibold prose-p:text-gray-700 prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
};

export default ArticleDetail;
