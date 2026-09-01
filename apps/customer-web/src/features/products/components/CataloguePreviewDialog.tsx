"use client";

import { useEffect, useState } from "react";
import {
  X,
  Download,
  FileText,
  ExternalLink,
  FileSpreadsheet,
  FileCheck,
  AlertCircle,
} from "lucide-react";

interface CataloguePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string | null;
  fileType?: string | null;
}

export function CataloguePreviewDialog({
  open,
  onClose,
  fileUrl,
  fileName,
  fileType,
}: CataloguePreviewDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open || !fileUrl) return null;

  const displayName = fileName || "Product Catalogue";
  const lowerUrl = fileUrl.toLowerCase();
  const lowerType = (fileType || "").toLowerCase();

  // Determine media type
  const isPdf =
    lowerUrl.includes(".pdf") ||
    lowerType.includes("pdf");

  const isImage =
    lowerUrl.match(/\.(jpg|jpeg|png|webp|svg|gif)(\?.*)?$/) !== null ||
    lowerType.startsWith("image/");

  const isVideo =
    lowerUrl.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/) !== null ||
    lowerType.startsWith("video/");

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(fileUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = displayName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback direct link
      window.open(fileUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalogue-preview-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="
          relative z-10
          flex flex-col
          w-full max-w-4xl
          h-[88vh] max-h-[750px]
          bg-white
          rounded-2xl sm:rounded-3xl
          shadow-2xl
          overflow-hidden
          border border-gray-100
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <div className="p-2 bg-orange-500 text-white rounded-xl flex-shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h2
                id="catalogue-preview-title"
                className="text-sm sm:text-base font-bold text-gray-900 truncate"
                title={displayName}
              >
                {displayName}
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500">
                Product Attachment Preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 min-h-0 bg-gray-100/60 flex items-center justify-center p-2 sm:p-4 overflow-auto">
          {isPdf ? (
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=0`}
              title={displayName}
              className="w-full h-full rounded-xl border border-gray-200 bg-white shadow-inner"
            />
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
              <img
                src={fileUrl}
                alt={displayName}
                className="max-h-full max-w-full object-contain rounded-xl shadow-md"
              />
            </div>
          ) : isVideo ? (
            <div className="w-full h-full flex items-center justify-center p-2">
              <video
                src={fileUrl}
                controls
                className="max-h-full max-w-full rounded-xl shadow-md bg-black"
              >
                Your browser does not support playing this video.
              </video>
            </div>
          ) : (
            /* Document / Other Fallback */
            <div className="max-w-md w-full mx-auto p-6 sm:p-8 bg-white rounded-2xl border border-gray-200 shadow-md text-center space-y-4">
              <div className="inline-flex p-4 bg-orange-50 text-orange-500 rounded-2xl">
                <FileSpreadsheet className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {displayName}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  In-browser preview is not available for this file type. You can download the file to view it on your device.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="
  inline-flex items-center justify-center gap-2
  w-full px-5 py-3
  text-sm font-semibold text-white
  bg-orange-500 hover:bg-orange-600 active:bg-orange-700
  rounded-xl shadow-sm
  transition
"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download File"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="
              px-4 py-2
              text-xs sm:text-sm font-semibold text-gray-600
              hover:text-gray-900 hover:bg-gray-100
              rounded-xl transition
            "
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
           className="
  inline-flex items-center gap-2

  px-4 sm:px-5 py-2 sm:py-2.5

  text-xs sm:text-sm font-semibold text-white

  bg-orange-500 hover:bg-orange-600 active:bg-orange-700

  rounded-xl shadow-sm

  transition
"
          >
            <Download className="h-4 w-4" />
            <span>{isDownloading ? "Downloading..." : "Download"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
