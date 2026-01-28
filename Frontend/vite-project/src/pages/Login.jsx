import React, { useState } from "react";
import { axiosInstance } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/auth/login", formData);

      toast.success(" Login successful");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-3 sm:px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border shadow-sm rounded-2xl p-5 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
          Welcome Back 
        </h2>

        <p className="text-gray-600 text-sm text-center mt-2">
          Login to continue to{" "}
          <span className="font-semibold text-green-600">FILO</span>
        </p>

        <form onSubmit={handleLogin} className="mt-6 sm:mt-8 space-y-4">
         
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

        
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          
          <button
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold p-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

     
        <div className="mt-5 flex flex-col sm:flex-row sm:justify-between gap-3 text-sm text-center">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>

          <Link to="/register" className="text-green-600 hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
