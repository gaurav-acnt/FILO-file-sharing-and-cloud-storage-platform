import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../services/api";
import toast from "react-hot-toast";

export default function FileView() {
  const { id } = useParams();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [downloadPassword, setDownloadPassword] = useState("");
  const [downloading, setDownloading] = useState(false);

  
  const fetchFile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/files/public/${id}`);
      setFile(res.data.file);
    } catch (error) {
      toast.error(error.response?.data?.message || "File not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFile();
  }, [id]);

  
  const handleDownload = async () => {
    try {
      if (!file) return;

      setDownloading(true);

     
      if (file.password) {
        if (!downloadPassword.trim()) {
          toast.error("Password required ");
          return;
        }

        const res = await axiosInstance.post(`/api/files/download/${id}`, {
          password: downloadPassword,
        });

        const fileUrl = res.data.fileUrl;

        const r = await fetch(fileUrl);
        const blob = await r.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.fileName || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        toast.success(" Download started");
        return;
      }

     
      const r = await fetch(file.fileUrl);

      if (!r.ok) {
        toast.error("Download failed (file not accessible)");
        return;
      }

      const blob = await r.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      toast.success(" Download started");
    } catch (error) {
      toast.error(error.response?.data?.message || "Download Failed");
    } finally {
      setDownloading(false);
    }
  };

  const renderPreview = () => {
    if (!file?.fileUrl) return null;

    const fileType = file.fileType || "";
    const isImage = fileType.startsWith("image/");
    const isVideo = fileType.startsWith("video/");
    const isPdf =
      fileType === "application/pdf" ||
      file?.fileName?.toLowerCase().endsWith(".pdf") ||
      file?.fileUrl?.toLowerCase().includes(".pdf");

   
    if (isImage) {
      return (
        <img
          src={file.fileUrl}
          alt="preview"
          className="w-full max-h-65 sm:max-h-95 object-contain rounded-2xl border bg-white"
        />
      );
    }

    
    if (isVideo) {
      return (
        <video
          controls
          className="w-full max-h-65 sm:max-h-95 rounded-2xl border bg-black"
        >
          <source src={file.fileUrl} type={file.fileType} />
        </video>
      );
    }

    
    if (isPdf) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(
            file.fileUrl
          )}&embedded=true`}
          title="PDF Preview"
          className="w-full h-65 sm:h-95 rounded-2xl border"
        />
      );
    }

   
    return (
      <div className="w-full p-4 rounded-2xl border bg-gray-50 text-left">
        <p className="text-gray-900 font-semibold">📄 Preview not available</p>
        <p className="text-gray-600 text-sm mt-1">
          This file type can’t be previewed here. Please download it.
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-14 px-4">
        <p className="text-gray-600">Loading file...</p>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="max-w-4xl mx-auto py-14 px-4">
        <p className="text-red-600 font-semibold"> File Not Found !</p>
        <Link to="/" className="text-blue-600 underline">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 sm:py-14 px-3 sm:px-4">
      <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-8">
      
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {file.fileName}
            </h1>

            <p className="text-sm text-gray-600 mt-1">
              Uploaded by:{" "}
              <span className="font-semibold text-gray-800">
                {file.uploadedBy?.name || "Unknown"}
              </span>
            </p>

            <p className="text-xs text-gray-500 mt-1 wrap-break-words">
              Type: {file.fileType} • Downloads: {file.downloads}
            </p>
          </div>

          <Link
            to="/"
            className="w-full sm:w-auto text-center px-4 py-2 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 text-sm font-semibold"
          >
            Back
          </Link>
        </div>

       
        <div className="mt-6">{renderPreview()}</div>

       
        <div className="mt-6 text-sm text-gray-700 space-y-1">
          <p>
            Expiry:{" "}
            <b>
              {file.expiresAt
                ? new Date(file.expiresAt).toLocaleString()
                : "No Expiry ✅"}
            </b>
          </p>

          <p>
            Protected:{" "}
            <b className={file.password ? "text-orange-600" : "text-green-600"}>
              {file.password ? "Yes 🔒" : "No ✅"}
            </b>
          </p>
        </div>

      
        {file.password && (
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">
              Enter Password 🔒
            </label>
            <input
              type="text"
              value={downloadPassword}
              onChange={(e) => setDownloadPassword(e.target.value)}
              placeholder="Password required"
              className="w-full mt-2 p-3 rounded-xl border outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
        )}

    
        <div className="mt-6">
          <button
            disabled={downloading}
            onClick={handleDownload}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-semibold disabled:opacity-60"
          >
            {downloading ? "Downloading..." : "Download"}
          </button>
        </div>

        
        <p className="text-xs text-gray-500 mt-6 break-all">
          Share Link:{" "}
          <span className="text-blue-600">{window.location.href}</span>
        </p>
      </div>
    </div>
  );
}
