export default function UserDashboard() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Poster User Dashboard
          </h1>
          <p className="text-gray-600">
            Create and manage your AI-powered social media posts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Posts</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-green-600 mt-2">+0% from last month</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Scheduled</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-blue-600 mt-2">Ready to publish</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Platforms</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600 mt-2">Connected accounts</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Engagement</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-purple-600 mt-2">Total interactions</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-4xl mb-2">✨</div>
              <div className="font-semibold text-gray-900">Generate AI Post</div>
              <div className="text-sm text-gray-600 mt-1">Create with AI assistance</div>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <div className="text-4xl mb-2">📅</div>
              <div className="font-semibold text-gray-900">Schedule Post</div>
              <div className="text-sm text-gray-600 mt-1">Plan your content</div>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-4xl mb-2">🔗</div>
              <div className="font-semibold text-gray-900">Connect Platform</div>
              <div className="text-sm text-gray-600 mt-1">Add social accounts</div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📊</div>
            <div className="text-lg">No activity yet</div>
            <div className="text-sm mt-2">Start by creating your first AI post</div>
          </div>
        </div>
      </div>
    </div>
  );
}
