export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">AI Poster Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Control Panel</p>
        </div>
        
        <nav className="space-y-2">
          <a href="#" className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700">
            📊 Dashboard
          </a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            👥 Users
          </a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            📝 Posts
          </a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            🔧 Settings
          </a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            🤖 AI Config
          </a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            🔒 Security
          </a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            📈 Analytics
          </a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            🔔 Notifications
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">System overview and management</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-green-600 mt-2">↑ 0% this month</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Active Posts</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-blue-600 mt-2">System-wide</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">System Health</div>
            <div className="text-3xl font-bold text-green-600">100%</div>
            <div className="text-sm text-gray-600 mt-2">All systems operational</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">AI Requests</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-purple-600 mt-2">Last 24 hours</div>
          </div>
        </div>

        {/* System Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">✓ Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Redis Cache</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">✓ Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">API Server</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">✓ Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Worker Queue</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">✓ Healthy</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 py-2 border-b">
                <div className="font-medium">System initialized</div>
                <div className="text-xs text-gray-500 mt-1">Just now</div>
              </div>
              <div className="text-center py-8 text-gray-400">
                No recent activity
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold text-gray-900">Manage Users</div>
              <div className="text-sm text-gray-600 mt-1">View and edit user accounts</div>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-semibold text-gray-900">System Config</div>
              <div className="text-sm text-gray-600 mt-1">Configure system settings</div>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-gray-900">View Reports</div>
              <div className="text-sm text-gray-600 mt-1">Generate system reports</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
