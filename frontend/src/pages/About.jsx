import RoleBadge from '../components/RoleBadge';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">About / Permissions</h1>
        <p className="mt-2 text-gray-600">Understanding role-based access control in this system</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Role-Based Access Control (RBAC)</h2>
        <p className="text-gray-700 mb-4">
          This application uses Role-Based Access Control to manage permissions. Each user is assigned a role that
          determines what actions they can perform. All permissions are enforced on the backend - the UI only reflects
          these permissions for better user experience.
        </p>
        <p className="text-gray-700">
          <strong>Important:</strong> Never rely on UI hiding for security. The backend API validates all requests
          and enforces permissions regardless of what the frontend displays.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <RoleBadge role="ADMIN" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Administrator</h3>
          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>Full access to all articles</li>
            <li>Can create, edit, and delete any article</li>
            <li>Can view all drafts and published articles</li>
            <li>No ownership restrictions</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <RoleBadge role="EDITOR" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Editor</h3>
          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>Can create new articles</li>
            <li>Can edit only their own articles</li>
            <li>Can view published articles and own drafts</li>
            <li>Cannot delete articles</li>
            <li>Cannot edit articles created by others</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <RoleBadge role="VIEWER" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Viewer</h3>
          <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>Can view published articles only</li>
            <li>Cannot create articles</li>
            <li>Cannot edit articles</li>
            <li>Cannot delete articles</li>
            <li>Cannot view draft articles</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Security Note</h3>
        <p className="text-blue-800 text-sm">
          All permissions are validated on the backend API. Even if a user modifies the frontend code to show buttons
          they shouldn't see, the backend will reject unauthorized requests. This ensures security regardless of client-side
          manipulation.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Visibility Rules</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start">
            <span className="font-medium mr-2">Published Articles:</span>
            <span>Visible to all authenticated users (ADMIN, EDITOR, VIEWER)</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium mr-2">Draft Articles:</span>
            <span>Visible only to the article owner and ADMIN users</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium mr-2">Public Access:</span>
            <span>Published articles are also visible to unauthenticated users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
