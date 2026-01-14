import { NavLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'EDITOR', 'VIEWER'] },
    { path: '/articles', label: 'Articles', roles: ['ADMIN', 'EDITOR', 'VIEWER'] },
    { path: '/articles/create', label: 'Create Article', roles: ['ADMIN', 'EDITOR'] },
    { path: '/about', label: 'About / Permissions', roles: ['ADMIN', 'EDITOR', 'VIEWER'] },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="w-56 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <nav className="py-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-6 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
