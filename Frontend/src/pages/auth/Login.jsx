import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/home');
    } catch (err) {
      setError('Failed to log in with Google: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-2 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
            type="submit"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">or continue with</span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>
        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex justify-center items-center"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
            <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
            <path fill="#EA4335" d="M12 4.61c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.29 6.16-4.29z" />
          </svg>
          Google
        </button>
        <div className="mt-6 text-center text-sm text-gray-600">
          Need an account? <Link to="/auth/register" className="text-gray-900 font-semibold hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
