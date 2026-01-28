import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance, authHeader, getToken } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();

  const [open, setOpen] = useState(false); 
  const [mobileMenu, setMobileMenu] = useState(false); 
  const [user, setUser] = useState(null);

  const profileRef = useRef(null);
  const mobileRef = useRef(null);

  
  const fetchMe = async () => {
    try {
      const res = await axiosInstance.get("/api/user/me", {
        headers: authHeader(),
      });
      setUser(res.data.user);
    } catch (err) {}
  };

  useEffect(() => {
    if (token) fetchMe();
  }, [token]);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out");

    setUser(null);
    setOpen(false);
    setMobileMenu(false);

    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link to="/" className="text-xl font-bold text-green-600 whitespace-nowrap">
          FILO
        </Link>

      
        <div className="hidden md:flex items-center gap-3">
          {!token ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 text-sm font-semibold"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-semibold"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setOpen((prev) => !prev);
                  setMobileMenu(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl border bg-white hover:bg-gray-50"
              >
                <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                  {getInitials(user?.name)}
                </div>

                <div className="hidden lg:flex flex-col items-start">
                  <p className="text-sm font-semibold text-gray-900 leading-4">
                    {user?.name || "My Account"}
                  </p>
                  <p className="text-xs text-gray-500 leading-4 max-w-45 truncate">
                    {user?.email || "Logged in"}
                  </p>
                </div>

                <span className="text-gray-500 text-sm">▾</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-72 bg-white border shadow-lg rounded-2xl overflow-hidden z-50">
                  <div className="p-4 border-b bg-gray-50">
                    <p className="font-semibold text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{user?.email}</p>

                    <p className="text-xs text-gray-500 mt-2">
                      Plan:{" "}
                      <span className="font-semibold text-green-600">
                        {user?.plan || "FREE"}
                      </span>
                    </p>
                  </div>

                  <div className="p-2 text-sm">
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-800"
                    >
                      📂 Dashboard
                    </Link>

                    <Link
                      to="/upload"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-800"
                    >
                      ⬆️ Upload
                    </Link>

                    <Link
                      to="/chat"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-800"
                    >
                      💬 Chat
                    </Link>

                    <Link
                      to="/contact"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-800"
                    >
                      📩 Contact
                    </Link>

                    <Link
                      to="/delete-account"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 rounded-xl hover:bg-red-50 text-red-600 font-semibold"
                    >
                      🗑 Delete Account
                    </Link>

                    <div className="border-t my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 rounded-xl hover:bg-red-50 text-red-600 font-semibold"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        
        <div className="md:hidden relative" ref={mobileRef}>
          {!token ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-2 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 text-sm font-semibold"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-semibold"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  setMobileMenu((prev) => !prev);
                  setOpen(false);
                }}
                className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-semibold"
              >
                ☰
              </button>

              {mobileMenu && (
                <div className="absolute right-0 mt-3 w-[92vw] max-w-sm bg-white border shadow-lg rounded-2xl overflow-hidden z-50">
                  <div className="p-4 border-b bg-gray-50">
                    <p className="font-semibold text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{user?.email}</p>

                    <p className="text-xs text-gray-500 mt-2">
                      Plan:{" "}
                      <span className="font-semibold text-green-600">
                        {user?.plan || "FREE"}
                      </span>
                    </p>
                  </div>

                  <div className="p-2 text-sm">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenu(false)}
                      className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-800"
                    >
                      📂 Dashboard
                    </Link>

                    <Link
                      to="/upload"
                      onClick={() => setMobileMenu(false)}
                      className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-800"
                    >
                      ⬆️ Upload
                    </Link>

                    <Link
                      to="/chat"
                      onClick={() => setMobileMenu(false)}
                      className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-800"
                    >
                      💬 Chat
                    </Link>

                    <Link
                      to="/contact"
                      onClick={() => setMobileMenu(false)}
                      className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-800"
                    >
                      📩 Contact
                    </Link>

                    <Link
                      to="/delete-account"
                      onClick={() => setMobileMenu(false)}
                      className="block px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-semibold"
                    >
                      🗑 Delete Account
                    </Link>

                    <div className="border-t my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-semibold"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
