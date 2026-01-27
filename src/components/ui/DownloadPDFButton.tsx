"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export function DownloadPDFButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/portfolio-pdf");

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      link.download = filenameMatch?.[1] || "portfolio.pdf";

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                 bg-primary-500 hover:bg-primary-600
                 text-black font-medium
                 transition-all duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Download Portfolio PDF
        </>
      )}
    </button>
  );
}
