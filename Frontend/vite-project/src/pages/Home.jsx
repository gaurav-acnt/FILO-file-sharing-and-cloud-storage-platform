import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
     
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          FILO Cloud Storage ☁️
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your files securely and share them using a unique link, protect
          with password, set expiry, upgrade storage & even chat in real-time.
        </p>

       
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-green-50 text-green-700 border border-green-200">
            🔒 Password Protected
          </span>
          <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            ⏳ Expiry Links
          </span>
          <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            📦 Bundle Share Link
          </span>
          <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
            💬 Real-time Chat
          </span>
        </div>

        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            to="/upload"
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm sm:text-base font-semibold shadow-sm text-center"
          >
            Upload Files
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm sm:text-base font-semibold shadow-sm text-center"
          >
            My Dashboard
          </Link>
        </div>
      </div>

     
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <p className="text-lg font-bold text-gray-900">⚡ Fast Upload</p>
          <p className="text-sm text-gray-600 mt-2">
            Upload multiple files and share instantly using a single link.
          </p>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <p className="text-lg font-bold text-gray-900">🧾 Preview Support</p>
          <p className="text-sm text-gray-600 mt-2">
            Preview images, PDFs, and videos directly inside your dashboard.
          </p>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <p className="text-lg font-bold text-gray-900">⛶  QR Sharing</p>
          <p className="text-sm text-gray-600 mt-2">
            Generate QR codes for your shared files and bundles for quick access.
          </p>
        </div>
      </div>
    </div>
  );
}
