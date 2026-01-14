import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import RoleBadge from '../components/RoleBadge';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    myArticles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await articleAPI.getAll({ page: 1, limit: 100 });
      const articles = response.data.data.articles;
      
      const total = articles.length;
      const published = articles.filter((a) => a.status === 'PUBLISHED').length;
      const drafts = articles.filter((a) => a.status === 'DRAFT').length;
      const myArticles = articles.filter((a) => a.authorId === user?.id).length;

      setStats({
        totalArticles: total,
        publishedArticles: published,
        draftArticles: drafts,
        myArticles: myArticles,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPermissions = () => {
    switch (user?.role) {
      case 'ADMIN':
        return {
          canCreate: true,
          canEdit: 'All articles',
          canDelete: true,
          canView: 'All articles (published and drafts)',
        };
      case 'EDITOR':
        return {
          canCreate: true,
          canEdit: 'Only your own articles',
          canDelete: false,
          canView: 'Published articles + your own drafts',
        };
      case 'VIEWER':
        return {
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canView: 'Published articles only',
        };
      default:
        return {};
    }
  };

  const permissions = getPermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total Articles</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalArticles}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Published</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.publishedArticles}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Drafts</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.draftArticles}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">My Articles</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.myArticles}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Role</h2>
          <div className="flex items-center space-x-3">
            <RoleBadge role={user?.role} />
            <span className="text-sm text-gray-600">
              {user?.role === 'ADMIN' && 'Full system access'}
              {user?.role === 'EDITOR' && 'Create and edit your articles'}
              {user?.role === 'VIEWER' && 'Read-only access'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
              <Link
                to="/articles/create"
                className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create New Article
              </Link>
            )}
            <Link
              to="/articles"
              className="block w-full text-left px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Permissions</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="py-2 border-b border-gray-100">
            {permissions.canCreate ? (
              <>Can create new articles</>
            ) : (
              <>Cannot create articles</>
            )}
          </li>
          <li className="py-2 border-b border-gray-100">
            {permissions.canEdit ? (
              <>Can edit {permissions.canEdit.toLowerCase()}</>
            ) : (
              <>Cannot edit articles</>
            )}
          </li>
          <li className="py-2 border-b border-gray-100">
            {permissions.canDelete ? (
              <>Can delete articles</>
            ) : (
              <>Cannot delete articles</>
            )}
          </li>
          <li className="py-2">
            Can view {permissions.canView.toLowerCase()}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
