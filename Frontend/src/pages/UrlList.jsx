import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { urlService } from '../services/api';
import { Copy, QrCode, Trash2, ExternalLink, Check, BarChart3 } from 'lucide-react';

const UrlList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchUrls();
  }, [page]);

  const fetchUrls = async () => {
    try {
      const response = await urlService.getUserUrls(page, 10);
      setUrls(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    try {
      await urlService.deleteUrl(id);
      fetchUrls();
    } catch (error) {
      alert('Failed to delete URL');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadQR = async (shortCode) => {
    try {
      const response = await urlService.getQRCode(shortCode);
      const link = document.createElement('a');
      link.href = response.data.data.qrCode;
      link.download = `qr-${shortCode}.png`;
      link.click();
    } catch (err) {
      alert('Failed to generate QR code');
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">My URLs</h1>
            <p className="text-gray-100 mt-2">Manage and track all your shortened URLs.</p>
          </div>
          <Link to="/create" className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium">
            Create New URL
          </Link>
        </div>

        {urls.length === 0 ? (
          <div className="bg-blue-100 rounded-lg shadow p-12 text-center">
            <p className="text-gray-900 text-lg">No URLs created yet.</p>
            <Link to="/create" className="text-blue-800 hover:text-blue-900 mt-4 inline-block font-medium">
              Create your first URL →
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Short URL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Original URL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Clicks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-blue-100 divide-y divide-gray-200">
                    {urls.map((url) => (
                      <tr key={url.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                              /{url.shortCode}
                            </a>
                            <button onClick={() => copyToClipboard(url.shortUrl, url.id)} className="text-gray-900 hover:text-blue-800">
                              {copied === url.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          {url.title && <p className="text-xs text-gray-900 mt-1">{url.title}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{url.originalUrl}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{url.clicks}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(url.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <Link to={`/analytics/${url.id}`} className="text-blue-600 hover:text-blue-800" title="Analytics">
                              <BarChart3 className="h-5 w-5" />
                            </Link>
                            <button onClick={() => downloadQR(url.shortCode)} className="text-purple-600 hover:text-purple-800" title="Download QR">
                              <QrCode className="h-5 w-5" />
                            </button>
                            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800" title="Visit">
                              <ExternalLink className="h-5 w-5" />
                            </a>
                            <button onClick={() => handleDelete(url.id)} className="text-red-600 hover:text-red-800" title="Delete">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex justify-center space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UrlList;
