import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import RoleBadge from '../components/RoleBadge';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 h-14 flex items-center px-8 shadow-sm">
      <div className="flex items-center justify-between w-full max-w-full">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
            Secure Content Workspace
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name}</p>
              <p className="text-xs text-gray-500 leading-tight">{user?.email}</p>
            </div>
            <RoleBadge role={user?.role} />
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
