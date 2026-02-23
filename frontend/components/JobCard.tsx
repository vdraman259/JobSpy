"use client";

import { MapPin, Calendar, DollarSign, Wifi, ExternalLink, Building2 } from "lucide-react";
import type { JobResult } from "@/lib/types";
import { formatSalary, formatDate, getSiteColor, getSiteLabel } from "@/lib/utils";

interface Props {
  job: JobResult;
  onClick: () => void;
  selected: boolean;
}

export default function JobCard({ job, onClick, selected }: Props) {
  const salary = formatSalary(job);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border cursor-pointer transition-all hover:shadow-md p-5 ${
        selected
          ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company ?? ""}
              className="w-10 h-10 rounded-lg object-contain border border-gray-100 bg-gray-50 shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 leading-tight truncate">{job.title}</h3>
            <p className="text-sm text-gray-600 truncate">{job.company}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${getSiteColor(job.site)}`}>
          {getSiteLabel(job.site)}
        </span>
      </div>

      <div className="space-y-1.5">
        {job.location && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{job.location}</span>
            {job.is_remote && (
              <span className="flex items-center gap-0.5 text-green-600 ml-1">
                <Wifi className="w-3 h-3" />
                Remote
              </span>
            )}
          </div>
        )}

        {salary && (
          <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
            <DollarSign className="w-3.5 h-3.5 shrink-0" />
            <span>{salary}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {job.date_posted && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(job.date_posted)}</span>
              </div>
            )}
            {job.job_type && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {job.job_type}
              </span>
            )}
          </div>
          {job.job_url && (
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
