import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Welcome Back!</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Username</label>
            <input type="text" name="username" onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-center">Don't have an account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </div>
    </div>
  );
}


