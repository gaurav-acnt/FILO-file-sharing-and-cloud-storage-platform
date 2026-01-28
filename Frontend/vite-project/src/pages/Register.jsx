import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [resending, setResending] = useState(false);

  
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = (sec = 60) => setTimer(sec);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

 
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/api/otp/send", {
        email: formData.email,
      });

      toast.success(res.data.message || "OTP sent successfully");
      setStep(2);
      startTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

 
  const handleResendOtp = async () => {
    if (timer > 0) return;

    try {
      setResending(true);

      const res = await axiosInstance.post("/api/otp/send", {
        email: formData.email,
      });

      toast.success(res.data.message || "OTP resent successfully");
      setOtp("");
      startTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend OTP failed");
    } finally {
      setResending(false);
    }
  };

  
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    if (otp.trim().length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/api/otp/verify-register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp,
      });

      toast.success(res.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-3 sm:px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border shadow-sm rounded-2xl p-5 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
          Create Account 
        </h2>

        <p className="text-gray-600 text-sm text-center mt-2">
          Register securely using OTP verification.
        </p>

 
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-green-600 transition-all duration-300"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
            Step {step}/2
          </p>
        </div>

     
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="mt-6 sm:mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        )}

    
        {step === 2 && (
          <form
            onSubmit={handleVerifyAndRegister}
            className="mt-6 sm:mt-8 space-y-4"
          >
         
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-gray-700 wrap-break-words">
                  OTP sent to:{" "}
                  <span className="font-semibold text-green-700">
                    {formData.email}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  OTP valid for 5 minutes.
                </p>
              </div>

              <div className="text-sm font-semibold text-gray-700 text-right">
                {timer > 0 ? formatTimer(timer) : "Ready"}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                className="w-full mt-2 p-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-green-500 tracking-widest text-center font-semibold text-sm"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold p-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timer > 0 || resending}
              className="w-full bg-gray-100 text-gray-900 font-semibold p-3 rounded-xl hover:bg-gray-200 disabled:opacity-60"
            >
              {resending
                ? "Resending OTP..."
                : timer > 0
                ? `Resend OTP in ${formatTimer(timer)}`
                : "Resend OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setTimer(0);
              }}
              className="w-full bg-gray-200 text-gray-900 font-semibold p-3 rounded-xl hover:bg-gray-300"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
