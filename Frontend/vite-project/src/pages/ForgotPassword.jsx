import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/auth/forgot-password", {
        email,
      });
      toast.success(res.data.message || " Reset link sent");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-3 sm:px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border shadow-sm rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
          Forgot Password 🔑
        </h2>

        <p className="text-gray-600 text-sm text-center mt-2">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleForgot} className="mt-6 sm:mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600 text-center">
          Back to{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
