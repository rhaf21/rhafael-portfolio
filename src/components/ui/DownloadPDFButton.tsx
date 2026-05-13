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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      link.download = filenameMatch?.[1] || "portfolio.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-400)]
                 text-black font-semibold
                 transition-all duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:shadow-[0_0_30px_var(--glow-lime)]"
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
