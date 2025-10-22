import { Link } from 'react-router-dom';
import { Link2, BarChart3, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Shorten Your URLs with <span className="text-blue-600">Power</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Create short, memorable links with advanced analytics, QR codes, and complete control over your URLs.
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-medium"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-medium"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-700 text-lg font-medium"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-blue-100 p-6 rounded-lg shadow-md">
            <Link2 className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Links</h3>
            <p className="text-gray-600">
              Create branded short links with custom aliases for better recognition.
            </p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg shadow-md">
            <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">
              Track clicks, locations, devices, and referrers with detailed insights.
            </p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg shadow-md">
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">
              Enterprise-grade security with rate limiting and spam protection.
            </p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg shadow-md">
            <Zap className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Instant URL shortening and blazing-fast redirects worldwide.
            </p>
          </div>
        </div>

        <div className="mt-20 bg-blue-100 rounded-lg shadow-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Powerful Features for Everyone
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-900">Unlimited URL shortening</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-900">QR code generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-900">Bulk URL creation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-900">Link expiration dates</span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-900">Click analytics & tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-900">Geographic insights</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-900">Export analytics data</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span className="text-gray-900">API access</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
