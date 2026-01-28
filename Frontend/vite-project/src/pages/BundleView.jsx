import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/api";
import PreviewModal from "../components/PreviewModal";
import QrModal from "../components/QrModal";

export default function BundleView() {
  const { bundleId } = useParams();

  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [qrOpen, setQrOpen] = useState(false);

  const bundleLink = `${window.location.origin}/bundle/${bundleId}`;

  const fetchBundle = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/bundle/${bundleId}`);
      setBundle(res.data.bundle);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load bundle");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundle();
  }, [bundleId]);

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const copyFileLink = async (fileId) => {
    const link = `${window.location.origin}/file/${fileId}`;
    await navigator.clipboard.writeText(link);
    toast.success("File link copied!");
  };

  const handlePreview = (file) => {
    if (file.password) {
      toast.error("This file is password protected, Open using file link.");
      return;
    }
    setPreviewFile(file);
    setPreviewOpen(true);
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

  return (
    <div className="max-w-6xl mx-auto py-10 sm:py-12 px-3 sm:px-4">
      
      {previewOpen && previewFile && (
        <PreviewModal
          file={previewFile}
          onClose={() => {
            setPreviewOpen(false);
            setPreviewFile(null);
          }}
        />
      )}

     
      {qrOpen && (
        <QrModal
          link={bundleLink}
          title="Files QR Code 📦"
          onClose={() => setQrOpen(false)}
        />
      )}

    
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            All Files 📦
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Share multiple files with one link.
          </p>
        </div>

      
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setQrOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-semibold"
          >
            Show QR
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black text-sm font-semibold text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 bg-white border rounded-2xl shadow-sm p-4 sm:p-6">
        {loading ? (
          <p className="text-gray-600 text-sm sm:text-base">
            Loading bundle...
          </p>
        ) : !bundle ? (
          <p className="text-red-600 font-semibold text-sm sm:text-base">
            Bundle not found or expired 
          </p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-gray-900 font-semibold text-lg">
                Files ({bundle.files?.length || 0})
              </p>

              <p className="text-xs text-gray-500 break-all">
                Bundle ID: <span className="font-mono">{bundleId}</span>
              </p>
            </div>

       
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                Expiry:{" "}
                <span className="font-semibold text-gray-900">
                  {bundle.expiresAt
                    ? new Date(bundle.expiresAt).toLocaleString()
                    : "No Expiry ✅"}
                </span>
              </p>
            </div>

            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {bundle.files?.map((file) => (
                <div
                  key={file._id}
                  className="border rounded-2xl p-4 sm:p-5 bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                    {file.fileName}
                  </h3>

                  <div className="text-xs sm:text-sm text-gray-600 mt-2 space-y-1 wrap-break-words">
                    <p className="truncate">Type: {file.fileType}</p>
                    <p>Size: {formatFileSize(file.fileSize)}</p>

                    <p>
                      Protected:{" "}
                      <span
                        className={
                          file.password ? "text-orange-600" : "text-green-600"
                        }
                      >
                        {file.password ? "Yes 🔒" : "No ✅"}
                      </span>
                    </p>
                  </div>

                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => handlePreview(file)}
                      className="w-full px-3 py-2 bg-gray-900 text-white rounded-xl hover:bg-black text-sm font-semibold"
                    >
                      Preview
                    </button>

                    <button
                      onClick={() => copyFileLink(file._id)}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold"
                    >
                      Copy Link
                    </button>

                    <button
                      onClick={() => handleDownloadFile(file)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-xl hover:bg-gray-100 text-sm font-semibold sm:col-span-2"
                    >
                      Download
                    </button>
                  </div>

                  
                  {file.password && (
                    <p className="text-xs text-orange-600 mt-3">
                      🔒 Preview disabled for password protected files
                    </p>
                  )}
                </div>
              ))}
            </div>

            
            {bundle.files?.length === 0 && (
              <p className="text-gray-600 mt-4 text-sm sm:text-base">
                No files found in bundle.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
