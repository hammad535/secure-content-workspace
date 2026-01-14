import { Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const ArticleCard = ({ article, onDelete }) => {
  const { user } = useAuthStore();

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articleAPI.delete(article.id);
        if (onDelete) onDelete(article.id);
      } catch (error) {
        alert('Failed to delete article');
      }
    }
  };

  const canEdit = user?.role === 'ADMIN' || (user?.role === 'EDITOR' && article.authorId === user?.id);
  const canDelete = user?.role === 'ADMIN';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              to={`/articles/${article.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {article.title}
            </Link>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>By {article.author.name}</span>
              <span>•</span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="mt-3 flex items-center space-x-2">
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
          </div>
          <div className="ml-4 flex items-center space-x-2">
            {canEdit && (
              <Link
                to={`/articles/${article.id}/edit`}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
              >
                Edit
              </Link>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
