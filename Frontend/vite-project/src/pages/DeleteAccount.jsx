import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance, authHeader } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();

    const confirm1 = confirm("⚠ Are you sure you want to delete your account?");
    if (!confirm1) return;

   

    if (!password.trim()) {
      toast.error("Enter your password");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.delete("/api/auth/delete-account", {
        headers: authHeader(),
        data: { password },
      });

      toast.success(res.data.message || "Account deleted");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-3 sm:px-4 py-10 bg-gray-50">
      <div className="w-full max-w-lg bg-white border rounded-2xl shadow-sm p-6 sm:p-8">
       
        <h1 className="text-2xl sm:text-3xl font-bold text-red-600">
          Delete Account 🗑
        </h1>

        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
          This action is <b>permanent</b>. Your files, bundles and account data
          will be removed forever.
        </p>

       
        <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-700">
            ⚠ Warning: You cannot recover your account after deletion.
          </p>
          <p className="text-xs text-red-600 mt-1">
            Please download your important files before deleting.
          </p>
        </div>

        
        <form onSubmit={handleDelete} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              disabled={loading}
              className="w-full bg-red-600 text-white font-semibold p-3 rounded-xl hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete Account"}
            </button>

            <Link
              to="/dashboard"
              className="w-full text-center bg-gray-100 text-gray-900 font-semibold p-3 rounded-xl hover:bg-gray-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
