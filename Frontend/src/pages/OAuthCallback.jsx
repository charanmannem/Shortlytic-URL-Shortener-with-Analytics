import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        navigate(`/login?error=${error}`);
        return;
      }

      if (token) {
        try {
          // Store token
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Fetch user data
          const response = await axios.get('auth/me');
          
          // Update auth context (you'll need to add setUser and setToken methods)
          localStorage.setItem('token', token);
          
          // Redirect to dashboard
          navigate('/dashboard');
          window.location.reload(); // Reload to update auth context
        } catch (err) {
          console.error('OAuth error:', err);
          navigate('/login?error=authentication_failed');
        }
      } else {
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
