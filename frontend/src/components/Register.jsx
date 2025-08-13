import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // Client-side validation
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    const userData = { username, email, password, password2: confirmPassword };

    try {
      setLoading(true);
      // Uncomment and set correct API endpoint
      const response = await axios.post("http://127.0.0.1:8000/api/register/", userData);
       console.log(response.data);

      console.log("Registration successful");
      setSuccess(true);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setErrors(err.response?.data || { general: "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">Create an Account</h3>
        <p className="text-center text-gray-500 text-sm mb-6">Join Fitkeep and start tracking today.</p>

        <form onSubmit={handleRegistration} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105'
            }`}
          >
            {loading ? "Please wait..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
