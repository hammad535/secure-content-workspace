const RoleBadge = ({ role }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'EDITOR':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'VIEWER':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRoleColor(
        role
      )}`}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
