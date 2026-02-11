export default function DeveloperDashboard() {
  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">AI Poster Developer Portal</h1>
            <p className="text-sm text-slate-400">API & Integration Tools</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600">Docs</a>
            <a href="#" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">API Keys</a>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 min-h-[calc(100vh-73px)] p-6 border-r border-slate-700">
          <nav className="space-y-2">
            <a href="#" className="block px-4 py-2 rounded bg-slate-700 text-white">
              📘 Overview
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-slate-700 text-slate-300">
              🔑 API Keys
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-slate-700 text-slate-300">
              📡 Webhooks
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-slate-700 text-slate-300">
              📊 Usage Stats
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-slate-700 text-slate-300">
              🧪 Testing Tools
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-slate-700 text-slate-300">
              📚 Documentation
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-slate-700 text-slate-300">
              🔍 Logs
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Developer Dashboard</h2>
            <p className="text-slate-400">Build and integrate with AI Poster APIs</p>
          </div>

          {/* API Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-sm text-slate-400 mb-1">API Calls</div>
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-green-400 mt-2">Last 24h</div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-sm text-slate-400 mb-1">Active Keys</div>
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-blue-400 mt-2">API keys</div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-sm text-slate-400 mb-1">Webhooks</div>
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-slate-400 mt-2">Configured</div>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-sm text-slate-400 mb-1">Uptime</div>
              <div className="text-3xl font-bold text-green-400">100%</div>
              <div className="text-sm text-slate-400 mt-2">Last 30 days</div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
            <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 font-mono text-sm mb-4">
              <div className="text-green-400"># Install the AI Poster SDK</div>
              <div className="text-slate-300">npm install @ai-poster/sdk</div>
              <div className="text-green-400 mt-2"># Import and initialize</div>
              <div className="text-slate-300">import {'{ AIPoster }'} from '@ai-poster/sdk';</div>
              <div className="text-slate-300">const client = new AIPoster(process.env.API_KEY);</div>
            </div>
            <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              Generate API Key
            </button>
          </div>

          {/* API Endpoints */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
            <h3 className="text-xl font-semibold mb-4">API Endpoints</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs font-mono">POST</span>
                    <span className="font-mono text-sm">/api/v1/posts/generate</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Generate AI-powered social media post</p>
                </div>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Docs →</a>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs font-mono">GET</span>
                    <span className="font-mono text-sm">/api/v1/posts</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">List all posts</p>
                </div>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Docs →</a>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs font-mono">POST</span>
                    <span className="font-mono text-sm">/api/v1/posts/schedule</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Schedule post for publishing</p>
                </div>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Docs →</a>
              </div>
            </div>
          </div>

          {/* Documentation Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-3xl mb-3">📘</div>
              <h4 className="text-lg font-semibold mb-2">API Reference</h4>
              <p className="text-sm text-slate-400 mb-4">Complete API documentation with examples</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">View docs →</a>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="text-lg font-semibold mb-2">SDKs & Libraries</h4>
              <p className="text-sm text-slate-400 mb-4">Official SDKs for popular languages</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">Browse SDKs →</a>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="text-3xl mb-3">💡</div>
              <h4 className="text-lg font-semibold mb-2">Code Examples</h4>
              <p className="text-sm text-slate-400 mb-4">Sample code and tutorials</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">See examples →</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
