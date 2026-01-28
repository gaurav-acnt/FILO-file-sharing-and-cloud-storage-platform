import React from "react";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";

export default function QrModal({ link, title = "QR Code", onClose }) {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied!");
    } catch (err) {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-3 sm:px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
       
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b">
          <p className="font-semibold text-gray-900 truncate">{title}</p>

          <button
            onClick={onClose}
            className="shrink-0 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-semibold"
          >
            Close
          </button>
        </div>

        
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto flex flex-col items-center gap-4">
          <div className="bg-white p-3 border rounded-2xl shadow-sm">
            
            <div className="w-40 h-40 sm:w-50 sm:h-50">
              <QRCode value={link} size={200} style={{ width: "100%", height: "100%" }} />
            </div>
          </div>

          <p className="text-xs text-gray-600 break-all text-center">{link}</p>

          <button
            onClick={copyLink}
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-xl hover:bg-blue-700"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
