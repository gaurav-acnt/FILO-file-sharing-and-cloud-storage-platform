import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/auth/reset-password", {
        token,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-3 sm:px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border shadow-sm rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
          Reset Password ✅
        </h2>

        <p className="text-gray-600 text-sm text-center mt-2">
          Set a new password for your account.
        </p>

        <form onSubmit={handleReset} className="mt-6 sm:mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold p-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600 text-center">
          Back to{" "}
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
