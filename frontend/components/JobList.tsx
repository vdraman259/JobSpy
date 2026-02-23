"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import type { JobResult, FilterState, SearchRequest } from "@/lib/types";
import JobCard from "./JobCard";
import Filters from "./Filters";
import ExportButton from "./ExportButton";
import JobDetails from "./JobDetails";

interface Props {
  jobs: JobResult[];
  total: number;
  searchTerm: string;
  location: string | null;
  lastRequest: SearchRequest | null;
}

function applyFilters(jobs: JobResult[], filters: FilterState): JobResult[] {
  return jobs.filter((job) => {
    if (filters.sites.length && !filters.sites.includes(job.site ?? "")) return false;
    if (filters.jobType && !job.job_type?.toLowerCase().includes(filters.jobType)) return false;
    if (filters.isRemote !== null && job.is_remote !== filters.isRemote) return false;
    if (filters.minSalary !== null && (job.max_amount ?? 0) < filters.minSalary) return false;
    if (filters.maxSalary !== null && (job.min_amount ?? Infinity) > filters.maxSalary) return false;
    return true;
  });
}

interface DetailsProps {
  job: JobResult | null;
  onClose: () => void;
}

function JobDetailPanel({ job, onClose }: DetailsProps) {
  if (!job) return null;
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      <JobDetails job={job} onClose={onClose} />
    </div>
  );
}

export default function JobList({ jobs, total, searchTerm, location, lastRequest }: Props) {
  const [view, setView] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sites: [],
    jobType: "",
    isRemote: null,
    minSalary: null,
    maxSalary: null,
  });
  const [selectedJob, setSelectedJob] = useState<JobResult | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const availableSites = useMemo(
    () => [...new Set(jobs.map((j) => j.site).filter(Boolean))] as string[],
    [jobs]
  );

  const filtered = useMemo(() => applyFilters(jobs, filters), [jobs, filters]);
  const paginated = filtered.slice(0, page * pageSize);
  const hasMore = paginated.length < filtered.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{filtered.length}</span> of{" "}
            <span className="font-medium text-gray-900">{total}</span> results for{" "}
            <span className="font-medium text-gray-900">&ldquo;{searchTerm}&rdquo;</span>
            {location && (
              <>
                {" "}in <span className="font-medium text-gray-900">{location}</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
              showFilters ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`p-2 ${view === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 ${view === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <ExportButton jobs={filtered} lastRequest={lastRequest} />
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {showFilters && (
          <div className="w-56 shrink-0">
            <Filters filters={filters} onChange={setFilters} availableSites={availableSites} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No jobs match the current filters.
            </div>
          ) : (
            <>
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                    : "space-y-3"
                }
              >
                {paginated.map((job, i) => (
                  <JobCard
                    key={job.id ?? `${job.job_url}-${i}`}
                    job={job}
                    onClick={() => setSelectedJob(job)}
                    selected={selectedJob?.job_url === job.job_url}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Load more ({filtered.length - paginated.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedJob && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedJob(null)}
          />
          <JobDetailPanel job={selectedJob} onClose={() => setSelectedJob(null)} />
        </>
      )}
    </div>
  );
}
