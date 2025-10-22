import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/api';
import { Link2, MousePointer, TrendingUp, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await analyticsService.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartData = Object.entries(stats?.clicksByDate || {}).map(([date, clicks]) => ({
    date,
    clicks
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white mt-2">Welcome back! Here's your URL analytics overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total URLs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUrls || 0}</p>
              </div>
              <Link2 className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalClicks || 0}</p>
              </div>
              <MousePointer className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clicks (30 Days)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.clicksLast30Days || 0}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-blue-100 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Clicks Over Time (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-blue-100 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing URLs</h2>
          {stats?.topUrls && stats.topUrls.length > 0 ? (
            <div className="space-y-4">
              {stats.topUrls.map((url, index) => (
                <div key={url.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-500">#{index + 1}</span>
                      <p className="text-sm text-gray-900 font-medium truncate">{url.originalUrl}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">/{url.shortCode}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{url.clicks} clicks</p>
                      <p className="text-xs text-gray-500">{new Date(url.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Link to={`/analytics/${url.id}`} className="text-blue-600 hover:text-blue-800">
                      <ExternalLink className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No URLs created yet.</p>
              <Link to="/create" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                Create your first URL
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
