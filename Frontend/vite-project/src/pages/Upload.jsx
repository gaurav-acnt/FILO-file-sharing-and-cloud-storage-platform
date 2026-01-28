import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance, getToken } from "../services/api";
import QrModal from "../components/QrModal";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [expiryHours, setExpiryHours] = useState("");
  const [password, setPassword] = useState("");

  
  const [shareLink, setShareLink] = useState("");

 
  const [qrOpen, setQrOpen] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);
      setShareLink("");

      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      formData.append("expiryHours", expiryHours);
      formData.append("password", password);

      const res = await axiosInstance.post(
        "/api/files/upload-multiple",
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );

      toast.success("Files uploaded successfully");

      const bundleId = res.data.bundleId;
      const link = `${window.location.origin}/bundle/${bundleId}`;
      setShareLink(link);

      setFiles([]);
      setExpiryHours("");
      setPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const copyBundleLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    toast.success(" Link copied");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      
      {qrOpen && shareLink && (
        <QrModal
          link={shareLink}
          title="Bundle QR Code 📦"
          onClose={() => setQrOpen(false)}
        />
      )}

      
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Upload Files ☁️
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
          Upload multiple files at once and share using one bundle link.
        </p>
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-10">
     
        <div className="bg-white border rounded-2xl shadow-sm p-5 sm:p-8">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Selected Files ({files.length})
            </h2>

            {files.length > 0 && (
              <button
                type="button"
                onClick={() => setFiles([])}
                className="text-xs sm:text-sm px-3 py-2 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100"
              >
                Clear All
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-1">
            These files will be uploaded together.
          </p>

          {files.length === 0 ? (
            <div className="mt-5 bg-gray-50 border rounded-xl p-4 text-sm text-gray-600">
              No files selected yet. Choose files from the right side 
            </div>
          ) : (
            <div className="mt-5 space-y-3 max-h-80 sm:max-h-95 overflow-y-auto pr-1">
              {files.map((f, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 bg-gray-50 border rounded-xl p-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {f.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {formatFileSize(f.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSelectedFile(index)}
                    className="shrink-0 px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      
        <div className="bg-white border rounded-2xl shadow-sm p-5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Upload Now
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Select multiple files and upload in one go 🚀
          </p>

          <form onSubmit={handleUpload} className="mt-6 space-y-4">
      
            <div>
              <label className="text-sm font-medium text-gray-700">
                Select Files
              </label>

              <input
                type="file"
                multiple
                onChange={(e) => setFiles([...e.target.files])}
                className="w-full mt-2 p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

      
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              <p className="font-semibold mb-2">⚠ Upload Limits</p>
              <ul className="list-disc ml-5 space-y-1 text-xs">
                <li>📷 Image max size: <b>10 MB</b></li>
                <li>🎥 Video max size: <b>100 MB</b></li>
                <li>📄 Raw / PDF / Docs max size: <b>10 MB</b></li>
                <li>🖼 Image transformation max: <b>100 MB</b></li>
                <li>🎬 Video transformation max: <b>40 MB</b></li>
                <li>🧠 Max image megapixels: <b>25 MP</b></li>
                <li>🧠 Max megapixels (all frames): <b>50 MP</b></li>
              </ul>
            </div>


            <div>
              <label className="text-sm font-medium text-gray-700">
                Expiry (in hours)
              </label>
              <input
                type="number"
                placeholder="Example: 24"
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                className="w-full mt-2 p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for no expiry.
              </p>
            </div>

        
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password (optional)
              </label>
              <input
                type="text"
                placeholder="Set password to protect this bundle"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

        
            <button
              disabled={loading || files.length === 0}
              className="w-full bg-green-600 text-white font-semibold p-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Files"}
            </button>

   
            {loading && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">
                  Uploading: <b>{progress}%</b>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

         
            {shareLink && (
              <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-xl">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  ✅ Share Bundle Link
                </p>

                <p className="text-xs break-all text-green-700">{shareLink}</p>

                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                  <button
                    type="button"
                    onClick={copyBundleLink}
                    className="w-full sm:flex-1 bg-blue-600 text-white font-semibold p-3 rounded-xl hover:bg-blue-700"
                  >
                    Copy Link
                  </button>

                  <button
                    type="button"
                    onClick={() => setQrOpen(true)}
                    className="w-full sm:flex-1 bg-gray-900 text-white font-semibold p-3 rounded-xl hover:bg-black"
                  >
                    Show QR
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
