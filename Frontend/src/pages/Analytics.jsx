import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analyticsService } from '../services/api';
import { ArrowLeft, Download, Globe, MousePointer, Smartphone } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const { urlId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [urlId, days]);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsService.getUrlAnalytics(urlId, days);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await analyticsService.exportAnalytics(urlId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Failed to export analytics');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#65a30d'];
  const chartData = Object.entries(analytics?.analytics?.clicksByDate || {}).map(([date, clicks]) => ({
    date, clicks
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  const deviceData = Object.entries(analytics?.analytics?.devices || {}).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(analytics?.analytics?.browsers || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/urls" className="text-gray-100 hover:text-blue-600 flex items-center space-x-1 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to URLs</span>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">Analytics</h1>
              <p className="text-gray-100 mt-2">{analytics?.url?.originalUrl}</p>
              <p className="text-sm text-blue-600 mt-1">/{analytics?.url?.shortCode}</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <button
                onClick={handleExport}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.url?.totalClicks || 0}</p>
              </div>
              <MousePointer className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Clicks ({days} days)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.analytics?.totalClicks || 0}</p>
              </div>
              <Globe className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Unique Countries</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.analytics?.topCountries?.length || 0}</p>
              </div>
              <Smartphone className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Clicks Over Time</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Countries</h2>
            {analytics?.analytics?.topCountries && analytics.analytics.topCountries.length > 0 ? (
              <div className="space-y-3">
                {analytics.analytics.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{country.country}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(country.count / analytics.analytics.totalClicks) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">{country.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-900">No data available</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Referrers</h2>
            {analytics?.analytics?.topReferrers && analytics.analytics.topReferrers.length > 0 ? (
              <div className="space-y-3">
                {analytics.analytics.topReferrers.map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700 truncate flex-1 mr-4">{referrer.referrer}</span>
                    <span className="text-sm font-medium text-gray-900">{referrer.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-900">No data available</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Device Breakdown</h2>
            {deviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-900">No data available</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Browser Breakdown</h2>
            {browserData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={browserData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-900">No data available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Clicks</h2>
          {analytics?.analytics?.recentClicks && analytics.analytics.recentClicks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">City</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Device</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Browser</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase">Referrer</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.analytics.recentClicks.map((click, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{new Date(click.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{click.country}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{click.city}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{click.device}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{click.browser}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs">{click.referrer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-900">No clicks recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
