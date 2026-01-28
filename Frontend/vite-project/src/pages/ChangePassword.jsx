import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance, authHeader } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.oldPassword.trim() || !form.newPassword.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/api/auth/change-password",
        {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
          confirmNewPassword: form.confirmNewPassword,
        },
        {
          headers: authHeader(),
        }
      );

      toast.success(res.data.message || "Password changed successfully");
      setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-3 sm:px-4 py-10 bg-gray-50">
      <div className="w-full max-w-lg bg-white border rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Change Password 🔑
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Update your password securely while staying logged in.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          <div>
            <label className="text-sm font-medium text-gray-700">
              Old Password <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type={showOld ? "text" : "password"}
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                placeholder="Enter old password"
                className="w-full sm:flex-1 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
              />

              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl border text-sm font-semibold hover:bg-gray-50"
              >
                {showOld ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full sm:flex-1 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl border text-sm font-semibold hover:bg-gray-50"
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters ✅
            </p>
          </div>

        
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full sm:flex-1 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl border text-sm font-semibold hover:bg-gray-50"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

         
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold p-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <Link
              to="/dashboard"
              className="w-full text-center bg-gray-100 text-gray-900 font-semibold p-3 rounded-xl hover:bg-gray-200"
            >
              Back
            </Link>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Tip: Use a strong password with letters + numbers 🔒
        </p>
      </div>
    </div>
  );
}
