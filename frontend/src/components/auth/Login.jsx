import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Toaster, toast } from 'sonner';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginUser(formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-500 mt-2">Let's get you logged in.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Using Flexbox for alignment instead of absolute positioning */}
            <div className={`flex items-center border rounded-lg focus-within:ring-2 ${error ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-300 focus-within:ring-green-500'}`}>
              <User className="mx-3 text-gray-400" size={20} />
              <input 
                type="text" 
                name="username" 
                onChange={handleChange} 
                className="w-full p-3 border-none rounded-r-lg focus:outline-none" 
                placeholder="Username"
                required 
              />
            </div>
            <div className={`flex items-center border rounded-lg focus-within:ring-2 ${error ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-300 focus-within:ring-green-500'}`}>
              <Lock className="mx-3 text-gray-400" size={20} />
              <input 
                type="password" 
                name="password" 
                onChange={handleChange} 
                className="w-full p-3 border-none rounded-r-lg focus:outline-none" 
                placeholder="Password"
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3 flex items-center justify-center gap-2 text-white font-semibold bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-green-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
