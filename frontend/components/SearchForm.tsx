"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Settings2, ChevronDown, ChevronUp } from "lucide-react";
import { getCountries, getSites, getJobTypes } from "@/lib/api";
import type { SearchRequest, SiteInfo, JobTypeInfo, CountryInfo } from "@/lib/types";

interface Props {
  onSearch: (req: SearchRequest) => void;
  loading: boolean;
}

const DEFAULT_SITES = ["indeed", "linkedin", "glassdoor", "google"];

export default function SearchForm({ onSearch, loading }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSites, setSelectedSites] = useState<string[]>(DEFAULT_SITES);
  const [jobType, setJobType] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [resultsWanted, setResultsWanted] = useState(20);
  const [hoursOld, setHoursOld] = useState<string>("");
  const [country, setCountry] = useState("usa");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [jobTypes, setJobTypes] = useState<JobTypeInfo[]>([]);
  const [countries, setCountries] = useState<CountryInfo[]>([]);

  const loadMeta = useCallback(async () => {
    const [s, jt, c] = await Promise.all([getSites(), getJobTypes(), getCountries()]);
    setSites(s);
    setJobTypes(jt);
    setCountries(c);
  }, []);

  useEffect(() => {
    loadMeta().catch(() => {});
  }, [loadMeta]);

  const toggleSite = (val: string) => {
    setSelectedSites((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    if (!selectedSites.length) return;
    onSearch({
      search_term: searchTerm.trim(),
      location: location.trim() || undefined,
      site_name: selectedSites,
      results_wanted: resultsWanted,
      hours_old: hoursOld ? parseInt(hoursOld) : undefined,
      country_indeed: country,
      job_type: jobType || undefined,
      is_remote: isRemote,
      description_format: "markdown",
      linkedin_fetch_description: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            required
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="City, state, or remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !searchTerm.trim() || !selectedSites.length}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {loading ? "Searching…" : "Search Jobs"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Settings2 className="w-4 h-4" />
        Advanced options
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Boards</label>
            <div className="flex flex-wrap gap-2">
              {sites.map((site) => (
                <button
                  key={site.value}
                  type="button"
                  onClick={() => toggleSite(site.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedSites.includes(site.value)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {site.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Any</option>
                {jobTypes.map((jt) => (
                  <option key={jt.value} value={jt.value}>
                    {jt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Results ({resultsWanted})
              </label>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={resultsWanted}
                onChange={(e) => setResultsWanted(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posted within</label>
              <select
                value={hoursOld}
                onChange={(e) => setHoursOld(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Any time</option>
                <option value="24">Last 24 hours</option>
                <option value="72">Last 3 days</option>
                <option value="168">Last week</option>
                <option value="720">Last month</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div
              onClick={() => setIsRemote((v) => !v)}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                isRemote ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isRemote ? "translate-x-4" : ""
                }`}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">Remote only</span>
          </label>
        </div>
      )}
    </form>
  );
}
