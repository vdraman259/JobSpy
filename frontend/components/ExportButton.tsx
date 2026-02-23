"use client";

import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import type { JobResult, SearchRequest } from "@/lib/types";
import { exportToCsv, exportToJson } from "@/lib/utils";
import { exportCsv } from "@/lib/api";

interface Props {
  jobs: JobResult[];
  lastRequest: SearchRequest | null;
}

export default function ExportButton({ jobs, lastRequest }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!jobs.length) return null;

  const handleExportJson = () => {
    exportToJson(jobs, "jobs.json");
    setOpen(false);
  };

  const handleExportCsvClient = () => {
    exportToCsv(jobs, "jobs.csv");
    setOpen(false);
  };

  const handleExportCsvServer = async () => {
    if (!lastRequest) return;
    setLoading(true);
    setOpen(false);
    try {
      const blob = await exportCsv(lastRequest);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "jobs.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
            <button
              onClick={handleExportCsvClient}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Export as CSV
            </button>
            <button
              onClick={handleExportJson}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Export as JSON
            </button>
            {lastRequest && (
              <button
                onClick={handleExportCsvServer}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                Re-scrape & Export CSV
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
