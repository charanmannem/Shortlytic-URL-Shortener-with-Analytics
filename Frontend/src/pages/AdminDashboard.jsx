import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Users, Link2, MousePointer, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, urlsRes] = await Promise.all([
        adminService.getSystemStats(),
        adminService.getAllUsers(1, 10),
        adminService.getAllUrls(1, 10)
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setUrls(urlsRes.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUrl = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    try {
      await adminService.deleteUrl(id);
      fetchData();
    } catch (error) {
      alert('Failed to delete URL');
    }
  };

  const handleUpdateUser = async (id, data) => {
    try {
      await adminService.updateUserRole(id, data);
      fetchData();
    } catch (error) {
      alert('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Admin Dashboard</h1>
          <p className="text-gray-100 mt-2">System overview and management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUsers || 0}</p>
                <p className="text-xs text-gray-900 mt-1">+{stats?.recentUsers || 0} this month</p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <div className="bg-blue-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Total URLs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUrls || 0}</p>
                <p className="text-xs text-gray-900 mt-1">+{stats?.recentUrls || 0} this month</p>
              </div>
              <Link2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <div className="bg-blue-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalClicks || 0}</p>
                <p className="text-xs text-gray-900 mt-1">+{stats?.recentClicks || 0} this month</p>
              </div>
              <MousePointer className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <div className="bg-blue-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Active URLs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeUrls || 0}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-4 font-medium ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-100'}`}
            >
              Top URLs
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-4 font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-100'}`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('urls')}
              className={`pb-4 px-4 font-medium ${activeTab === 'urls' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-100'}`}
            >
              All URLs
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing URLs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats?.topUrls?.map((url) => (
                    <tr key={url.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-md">{url.originalUrl}</div>
                        <div className="text-xs text-gray-500">/{url.shortCode}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {url.user ? `${url.user.name} (${url.user.email})` : 'Anonymous'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{url.clicks}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(url.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">URLs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Total Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.urlCount}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.totalClicks}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleUpdateUser(user.id, { isActive: !user.isActive })}
                          className={`px-3 py-1 rounded ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'urls' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">All URLs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Short URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Original URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {urls.map((url) => (
                    <tr key={url.id}>
                      <td className="px-6 py-4 text-sm text-blue-600">/{url.shortCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">{url.originalUrl}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {url.user ? url.user.name : 'Anonymous'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{url.clicks}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteUrl(url.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
