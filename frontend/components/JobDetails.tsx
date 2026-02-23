"use client";

import { X, ExternalLink, MapPin, Calendar, DollarSign, Wifi, Building2, Star, Users, Briefcase } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { JobResult } from "@/lib/types";
import { formatSalary, formatDate, getSiteColor, getSiteLabel } from "@/lib/utils";

interface Props {
  job: JobResult;
  onClose: () => void;
}

export default function JobDetails({ job, onClose }: Props) {
  const salary = formatSalary(job);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-start justify-between p-6 border-b border-gray-200 gap-4">
        <div className="flex items-start gap-4 min-w-0">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company ?? ""}
              className="w-14 h-14 rounded-xl object-contain border border-gray-100 bg-gray-50 shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {job.company && (
                <a
                  href={job.company_url ?? job.company_url_direct ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-base font-medium ${
                    job.company_url || job.company_url_direct
                      ? "text-blue-600 hover:underline"
                      : "text-gray-700 pointer-events-none"
                  }`}
                >
                  {job.company}
                </a>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSiteColor(job.site)}`}>
                {getSiteLabel(job.site)}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-4">
            {job.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{job.location}</span>
                {job.is_remote && (
                  <span className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-3.5 h-3.5" />
                    Remote
                  </span>
                )}
              </div>
            )}
            {salary && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <DollarSign className="w-4 h-4" />
                <span>{salary}</span>
              </div>
            )}
            {job.date_posted && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Posted {formatDate(job.date_posted)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {job.job_type && (
              <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                {job.job_type}
              </span>
            )}
            {job.job_level && (
              <span className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-medium">
                {job.job_level}
              </span>
            )}
            {job.company_industry && (
              <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {job.company_industry}
              </span>
            )}
            {job.work_from_home_type && (
              <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                {job.work_from_home_type}
              </span>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            {job.job_url && (
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Apply Now
              </a>
            )}
            {job.job_url_direct && job.job_url_direct !== job.job_url && (
              <a
                href={job.job_url_direct}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 border border-blue-300 rounded-xl font-medium hover:bg-blue-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Apply Direct
              </a>
            )}
          </div>

          {(job.company_description || job.company_num_employees || job.company_revenue || job.company_rating) && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                About {job.company}
              </h3>
              <div className="flex flex-wrap gap-4">
                {job.company_num_employees && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{job.company_num_employees} employees</span>
                  </div>
                )}
                {job.company_revenue && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>{job.company_revenue} revenue</span>
                  </div>
                )}
                {job.company_rating && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>
                      {job.company_rating.toFixed(1)}
                      {job.company_reviews_count && (
                        <span className="text-gray-400 ml-1">({job.company_reviews_count.toLocaleString()} reviews)</span>
                      )}
                    </span>
                  </div>
                )}
                {job.vacancy_count && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>{job.vacancy_count} openings</span>
                  </div>
                )}
              </div>
              {job.company_description && (
                <p className="text-sm text-gray-600 leading-relaxed">{job.company_description}</p>
              )}
              {job.company_addresses && (
                <p className="text-sm text-gray-500">📍 {job.company_addresses}</p>
              )}
            </div>
          )}

          {job.skills && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.split(",").map((skill, i) => (
                  <span key={i} className="text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.experience_range && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Experience: </span>
              {job.experience_range}
            </div>
          )}

          {job.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
              <div className="prose prose-sm max-w-none text-gray-700 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-3 [&_strong]:font-semibold">
                <ReactMarkdown>{job.description}</ReactMarkdown>
              </div>
            </div>
          )}

          {job.emails && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Contact: </span>
              <a href={`mailto:${job.emails}`} className="text-blue-600 hover:underline">
                {job.emails}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
