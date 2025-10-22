import { useState } from 'react';
import { urlService } from '../services/api';
import { Link2, Copy, QrCode, Check } from 'lucide-react';

const CreateUrl = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [bulkResults, setBulkResults] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('single');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = {
        originalUrl,
        customAlias: customAlias || undefined,
        title: title || undefined,
        expiresAt: expiresAt || undefined
      };
      const response = await urlService.createUrl(data);
      setResult(response.data.data);
      setOriginalUrl('');
      setCustomAlias('');
      setTitle('');
      setExpiresAt('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create URL');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBulkResults(null);
    setLoading(true);

    try {
      const urls = bulkUrls.split('\n').filter(url => url.trim());
      const response = await urlService.bulkCreateUrls(urls);
      setBulkResults(response.data.data);
      setBulkUrls('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create URLs');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Create Short URL</h1>
          <p className="text-gray-200 mt-2">Shorten your URLs and track their performance.</p>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setMode('single')}
              className={`pb-4 px-4 font-medium ${mode === 'single' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-200'}`}
            >
              Single URL
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`pb-4 px-4 font-medium ${mode === 'bulk' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-200'}`}
            >
              Bulk Create
            </button>
          </div>
        </div>

        {mode === 'single' ? (
          <div className="bg-blue-100 rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Original URL *</label>
                <input
                  type="url"
                  required
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/your-long-url"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Custom Alias (optional)</label>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="my-custom-link"
                />
                <p className="text-xs text-gray-900 mt-1">Leave empty for auto-generated code</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Title (optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="My Link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Expiration Date (optional)</label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Link2 className="h-5 w-5" />
                <span>{loading ? 'Creating...' : 'Shorten URL'}</span>
              </button>
            </form>

            {result && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-semibold text-green-900 mb-3">URL Created Successfully!</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Short URL:</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="text"
                        readOnly
                        value={result.shortUrl}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white"
                      />
                      <button
                        onClick={() => copyToClipboard(result.shortUrl)}
                        className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 flex items-center space-x-1"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => downloadQR(result.shortCode)}
                        className="px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-700 flex items-center space-x-1"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>QR</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Original URL:</p>
                    <p className="text-sm text-gray-900 mt-1 break-all">{result.originalUrl}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-blue-100 rounded-lg shadow p-6">
            <form onSubmit={handleBulkSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">URLs (one per line, max 50)</label>
                <textarea
                  required
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-600 bg-blue-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                  placeholder="https://example.com/url1&#10;https://example.com/url2&#10;https://example.com/url3"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Shorten All URLs'}
              </button>
            </form>

            {bulkResults && (
              <div className="mt-6 space-y-4">
                {bulkResults.successful.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      ✓ {bulkResults.successful.length} URLs Created Successfully
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {bulkResults.successful.map((url, index) => (
                        <div key={index} className="text-sm bg-white p-2 rounded border border-green-100">
                          <p className="font-medium text-gray-900">{url.shortUrl}</p>
                          <p className="text-gray-600 text-xs truncate">{url.originalUrl}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {bulkResults.failed.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <h3 className="text-lg font-semibold text-red-900 mb-3">
                      ✗ {bulkResults.failed.length} URLs Failed
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {bulkResults.failed.map((fail, index) => (
                        <div key={index} className="text-sm bg-white p-2 rounded border border-red-100">
                          <p className="font-medium text-gray-900 truncate">{fail.url}</p>
                          <p className="text-red-600 text-xs">{fail.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUrl;
