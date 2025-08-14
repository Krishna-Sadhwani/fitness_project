import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client"; // Import apiClient

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    const userData = { username, email, password, password2: confirmPassword };

    try {
      setLoading(true);
      // Use apiClient for the request
      const response = await apiClient.post("/register/", userData);
      console.log("Registration successful", response.data);
      setSuccess(true);
      // Clear form and redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const apiErrors = err.response?.data || {};
      setErrors(apiErrors);
      console.error("Registration failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegistration}>
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Registration successful! Redirecting to login...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* General Errors */}
          {errors.general && (
            <p className="text-red-600 text-sm mt-2 text-center bg-red-50 border border-red-100 rounded p-2">{errors.general}</p>
          )}

          {/* Success Message */}
          {success && (
            <p className="text-green-600 text-sm mt-2 text-center">
              Registration successful!
            </p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
