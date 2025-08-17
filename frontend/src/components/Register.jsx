import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";

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
    if (formData.password !== formData.password2) {
      setErrors({ password2: "Passwords do not match." });
      setLoading(false);
      return;
    }
    try {
      await apiClient.post("auth/register/", formData);
      navigate("/login");
    } catch (err) {
      setErrors(err.response?.data || { detail: "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields for username, email, password, confirm password */}
          {/* Example for one field: */}
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              name="password2"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.password2 && (
              <p className="text-red-500 text-xs mt-1">{errors.password2}</p>
            )}
          </div>
          {errors.detail && (
            <p className="text-red-500 text-center">{errors.detail}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
