import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      await apiClient.post("auth/register/", formData);
      toast.success("Registration successful! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        setErrors(errorData);
        toast.error("Please correct the errors below.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
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
            <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
            <p className="text-gray-500 mt-2">Start your fitness journey today.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* --- THIS IS THE FIX --- */}
            {/* Using Flexbox for alignment instead of absolute positioning */}
            <div className={`flex items-center border rounded-lg focus-within:ring-2 ${errors.username ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-300 focus-within:ring-green-500'}`}>
              <User className="mx-3 text-gray-400" size={20} />
              <input type="text" name="username" onChange={handleChange} className="w-full p-3 border-none rounded-r-lg focus:outline-none" placeholder="Username" required />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}

            <div className={`flex items-center border rounded-lg focus-within:ring-2 ${errors.email ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-300 focus-within:ring-green-500'}`}>
              <Mail className="mx-3 text-gray-400" size={20} />
              <input type="email" name="email" onChange={handleChange} className="w-full p-3 border-none rounded-r-lg focus:outline-none" placeholder="Email" required />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

            <div className={`flex items-center border rounded-lg focus-within:ring-2 ${errors.password ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-300 focus-within:ring-green-500'}`}>
              <Lock className="mx-3 text-gray-400" size={20} />
              <input type="password" name="password" onChange={handleChange} className="w-full p-3 border-none rounded-r-lg focus:outline-none" placeholder="Password" required />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

            <div className={`flex items-center border rounded-lg focus-within:ring-2 ${errors.password2 ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-300 focus-within:ring-green-500'}`}>
              <Lock className="mx-3 text-gray-400" size={20} />
              <input type="password" name="password2" onChange={handleChange} className="w-full p-3 border-none rounded-r-lg focus:outline-none" placeholder="Confirm Password" required />
            </div>
            {errors.password2 && <p className="text-red-500 text-xs mt-1">{errors.password2}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 flex items-center justify-center gap-2 text-white font-semibold bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
              {loading ? "Registering..." : "Create Account"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-green-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
