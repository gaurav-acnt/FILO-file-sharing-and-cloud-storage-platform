import React from "react";
import toast from "react-hot-toast";

export default function PreviewModal({ file, onClose }) {
  const fileType = file?.fileType || "";

  const isImage = fileType.startsWith("image/");
  const isVideo = fileType.startsWith("video/");
  const isPdf =
    fileType === "application/pdf" ||
    file?.fileName?.toLowerCase().endsWith(".pdf") ||
    file?.fileUrl?.toLowerCase().includes(".pdf");

  const handleDownload = async () => {
    try {
      const res = await fetch(file?.fileUrl);

      if (!res.ok) {
        toast.error("Download failed (file not accessible)");
        return;
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file?.fileName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (err) {
      toast.error("Download failed");
    }
  };

  const handleOpen = () => {
    window.open(file?.fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-3 sm:px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-[92vh]">
       
        <div className="flex items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {file?.fileName}
            </p>
            <p className="text-xs text-gray-500 truncate">{file?.fileType}</p>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-semibold"
          >
            Close
          </button>
        </div>

        
        <div className="p-3 sm:p-4 bg-gray-50 flex-1 overflow-y-auto">
          {isImage && (
            <img
              src={file?.fileUrl}
              alt="preview"
              className="w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-xl border bg-white"
            />
          )}

          {isVideo && (
            <video
              controls
              className="w-full max-h-[60vh] sm:max-h-[70vh] rounded-xl border bg-black"
            >
              <source src={file?.fileUrl} type={file?.fileType} />
            </video>
          )}

         
          {isPdf && (
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                file?.fileUrl
              )}&embedded=true`}
              title="PDF Preview"
              className="w-full h-[55vh] sm:h-[70vh] rounded-xl border bg-white"
            />
          )}

          {!isImage && !isVideo && !isPdf && (
            <div className="text-center py-12">
              <p className="text-gray-900 font-semibold">
                Preview not supported 
              </p>
              <p className="text-sm text-gray-600 mt-2">
                You can still download it using the buttons below.
              </p>
            </div>
          )}
        </div>

      
        <div className="px-4 sm:px-5 py-4 border-t bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleOpen}
              className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
            >
              Open in New Tab
            </button>

            <button
              onClick={handleDownload}
              className="w-full px-4 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 text-sm font-semibold"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
