import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Link2, BarChart3, Settings, Home } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className=" bg-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Link2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-white">Shortlytic</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-white hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/create"
                  className="flex items-center space-x-1 text-white hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Link2 className="h-4 w-4" />
                  <span>Create URL</span>
                </Link>
                <Link
                  to="/urls"
                  className="flex items-center space-x-1 text-white hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>My URLs</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-white hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-white">Hi, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
