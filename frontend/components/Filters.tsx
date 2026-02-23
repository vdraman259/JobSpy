"use client";

import { X } from "lucide-react";
import type { FilterState } from "@/lib/types";
import { getSiteLabel } from "@/lib/utils";

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  availableSites: string[];
}

const JOB_TYPES = [
  { value: "fulltime", label: "Full Time" },
  { value: "parttime", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

export default function Filters({ filters, onChange, availableSites }: Props) {
  const hasActive =
    filters.sites.length > 0 ||
    filters.jobType !== "" ||
    filters.isRemote !== null ||
    filters.minSalary !== null ||
    filters.maxSalary !== null;

  const reset = () =>
    onChange({ sites: [], jobType: "", isRemote: null, minSalary: null, maxSalary: null });

  const toggleSite = (site: string) => {
    const next = filters.sites.includes(site)
      ? filters.sites.filter((s) => s !== site)
      : [...filters.sites, site];
    onChange({ ...filters, sites: next });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActive && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Source
        </label>
        <div className="space-y-1.5">
          {availableSites.map((site) => (
            <label key={site} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.sites.includes(site)}
                onChange={() => toggleSite(site)}
                className="w-4 h-4 text-blue-600 rounded accent-blue-600"
              />
              <span className="text-sm text-gray-700">{getSiteLabel(site)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Job Type
        </label>
        <div className="space-y-1.5">
          {JOB_TYPES.map((jt) => (
            <label key={jt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="jobType"
                value={jt.value}
                checked={filters.jobType === jt.value}
                onChange={() => onChange({ ...filters, jobType: jt.value })}
                className="w-4 h-4 text-blue-600 accent-blue-600"
              />
              <span className="text-sm text-gray-700">{jt.label}</span>
            </label>
          ))}
          {filters.jobType && (
            <button
              onClick={() => onChange({ ...filters, jobType: "" })}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Work Type
        </label>
        <div className="space-y-1.5">
          {[
            { label: "Remote", value: true },
            { label: "On-site", value: false },
          ].map(({ label, value }) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="remoteFilter"
                checked={filters.isRemote === value}
                onChange={() => onChange({ ...filters, isRemote: value })}
                className="w-4 h-4 text-blue-600 accent-blue-600"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
          {filters.isRemote !== null && (
            <button
              onClick={() => onChange({ ...filters, isRemote: null })}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
