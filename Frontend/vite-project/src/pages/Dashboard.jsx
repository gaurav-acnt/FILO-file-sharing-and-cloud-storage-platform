import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance, authHeader } from "../services/api";
import { Link } from "react-router-dom";
import { formatBytesToGB } from "../utils/formatBytes";
import PreviewModal from "../components/PreviewModal";
import QrModal from "../components/QrModal";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [qrOpen, setQrOpen] = useState(false);
  const [qrLink, setQrLink] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/user/me", {
        headers: authHeader(),
      });
      setProfile(res.data.user);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await axiosInstance.get("/api/files/myfiles", {
        headers: authHeader(),
      });
      setFiles(res.data.files);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load files");
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchProfile(), fetchFiles()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const copyShareLink = async (id) => {
    const link = `${window.location.origin}/file/${id}`;
    await navigator.clipboard.writeText(link);
    toast.success(" Link copied!");
  };

  const handleDownloadFile = async (file) => {
    try {
      const res = await fetch(file.fileUrl);

      if (!res.ok) {
        toast.error("Download failed (file not accessible)");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (err) {
      toast.error("Download failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/files/${id}`, {
        headers: authHeader(),
      });

      toast.success("File deleted");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

 
  const handlePreview = (file) => {
    if (file.password) {
      toast.error("This file is password protected 🔒 Open it from link.");
      return;
    }
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const used = profile?.storageUsed || 0;
  const limit = profile?.storageLimit || 1;
  const percent = Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <Link
          to="/upload"
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold text-center"
        >
          Upload File
        </Link>
      </div>

      
      {previewOpen && previewFile && (
        <PreviewModal
          file={previewFile}
          onClose={() => {
            setPreviewOpen(false);
            setPreviewFile(null);
          }}
        />
      )}

 
      {qrOpen && qrLink && (
        <QrModal
          link={qrLink}
          title="File QR Code 📄"
          onClose={() => {
            setQrOpen(false);
            setQrLink("");
          }}
        />
      )}

     
      <div className="bg-white border rounded-2xl shadow-sm p-5 sm:p-6 mb-8">
        {profile ? (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
           
              <div className="min-w-0">
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {profile.name}
                </p>
                <p className="text-gray-600 text-sm truncate">{profile.email}</p>

                <p className="mt-2 text-sm">
                  Plan:{" "}
                  <span className="font-semibold text-green-600">
                    {profile.plan}
                  </span>
                </p>
              </div>

              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Link
                  to="/change-password"
                  className="w-full sm:w-auto px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black text-sm font-semibold text-center"
                >
                  Change Password
                </Link>

                <Link
                  to="/pricing"
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-semibold text-center"
                >
                  Upgrade Plan
                </Link>
              </div>
            </div>

         
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm text-gray-700 mb-2">
                <span>
                  Storage Used:{" "}
                  <b>{formatBytesToGB(profile.storageUsed)} GB</b>
                </span>
                <span>
                  Limit: <b>{formatBytesToGB(profile.storageLimit)} GB</b>
                </span>
              </div>

              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-green-600"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">{percent}% used</p>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Loading profile...</p>
        )}
      </div>

  
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          My Files
        </h2>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading files...</p>
      ) : files.length === 0 ? (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <p className="text-gray-700 text-sm sm:text-base">
            No files uploaded yet.{" "}
            <Link className="text-blue-600 underline" to="/upload">
              Upload now
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {files.map((file) => (
            <div
              key={file._id}
              className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col"
            >
              <h3 className="font-semibold text-gray-900 truncate">
                {file.fileName}
              </h3>

              <div className="text-sm text-gray-600 mt-3 space-y-1">
                <p className="wrap-break-words">
                  <b>Type:</b> {file.fileType}
                </p>

                <p>
                  <b>Size:</b> {(file.fileSize / 1024).toFixed(2)} KB
                </p>

                <p>
                  <b>Downloads:</b> {file.downloads}
                </p>

                <p>
                  <b>Protected:</b>{" "}
                  <span
                    className={
                      file.password ? "text-orange-600" : "text-green-600"
                    }
                  >
                    {file.password ? "Yes 🔒" : "No ✅"}
                  </span>
                </p>

                <p className="wrap-break-words">
                  <b>Expiry:</b>{" "}
                  <span className="text-gray-800">
                    {file.expiresAt
                      ? new Date(file.expiresAt).toLocaleString()
                      : "No Expiry"}
                  </span>
                </p>
              </div>

              
              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  onClick={() => copyShareLink(file._id)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold"
                >
                  Copy Link
                </button>

                <button
                  onClick={() => handlePreview(file)}
                  className="px-3 py-2 bg-gray-900 text-white rounded-xl hover:bg-black text-sm font-semibold"
                >
                  Preview
                </button>

                <button
                  onClick={() => {
                    const link = `${window.location.origin}/file/${file._id}`;
                    setQrLink(link);
                    setQrOpen(true);
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-sm font-semibold"
                >
                  QR
                </button>

                <button
                  onClick={() => handleDownloadFile(file)}
                  className="px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-xl hover:bg-gray-100 text-sm font-semibold"
                >
                  Download
                </button>

                <button
                  onClick={() => handleDelete(file._id)}
                  className="col-span-2 px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>

              {file.password && (
                <p className="text-xs text-orange-600 mt-3">
                  🔒 Preview disabled (password protected)
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



