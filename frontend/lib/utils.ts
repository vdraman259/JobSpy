import type { JobResult } from "./types";

export function formatSalary(job: JobResult): string | null {
  if (!job.min_amount && !job.max_amount) return null;
  const currency = job.currency ?? "USD";
  const interval = job.interval ? ` / ${job.interval}` : "";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  if (job.min_amount && job.max_amount) {
    return `${fmt(job.min_amount)} – ${fmt(job.max_amount)}${interval}`;
  }
  if (job.min_amount) return `From ${fmt(job.min_amount)}${interval}`;
  if (job.max_amount) return `Up to ${fmt(job.max_amount)}${interval}`;
  return null;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getSiteColor(site: string | null): string {
  const colors: Record<string, string> = {
    linkedin: "bg-blue-100 text-blue-800",
    indeed: "bg-purple-100 text-purple-800",
    glassdoor: "bg-green-100 text-green-800",
    zip_recruiter: "bg-orange-100 text-orange-800",
    google: "bg-red-100 text-red-800",
    bayt: "bg-teal-100 text-teal-800",
    naukri: "bg-yellow-100 text-yellow-800",
    bdjobs: "bg-pink-100 text-pink-800",
  };
  return colors[site ?? ""] ?? "bg-gray-100 text-gray-800";
}

export function getSiteLabel(site: string | null): string {
  const labels: Record<string, string> = {
    linkedin: "LinkedIn",
    indeed: "Indeed",
    glassdoor: "Glassdoor",
    zip_recruiter: "ZipRecruiter",
    google: "Google",
    bayt: "Bayt",
    naukri: "Naukri",
    bdjobs: "BDJobs",
  };
  return labels[site ?? ""] ?? (site ?? "");
}

export function exportToJson(jobs: JobResult[], filename = "jobs.json"): void {
  const json = JSON.stringify(jobs, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, filename);
}

export function exportToCsv(jobs: JobResult[], filename = "jobs.csv"): void {
  if (!jobs.length) return;
  const headers = Object.keys(jobs[0]) as (keyof JobResult)[];
  const csvRows = [
    headers.join(","),
    ...jobs.map((job) =>
      headers
        .map((h) => {
          const val = job[h];
          if (val === null || val === undefined) return "";
          const str = String(val).replace(/"/g, '""');
          return /[",\n]/.test(str) ? `"${str}"` : str;
        })
        .join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
