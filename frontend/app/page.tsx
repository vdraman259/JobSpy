"use client";

import { useState } from "react";
import { Briefcase, AlertCircle } from "lucide-react";
import SearchForm from "@/components/SearchForm";
import JobList from "@/components/JobList";
import { searchJobs } from "@/lib/api";
import type { SearchRequest, SearchResponse } from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<SearchRequest | null>(null);

  const handleSearch = async (req: SearchRequest) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setLastRequest(req);
    try {
      const data = await searchJobs(req);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2 text-blue-600">
            <Briefcase className="w-6 h-6" />
            <span className="font-bold text-lg text-gray-900">JobSpy</span>
          </div>
          <span className="text-gray-300 hidden sm:block">|</span>
          <span className="text-sm text-gray-500 hidden sm:block">
            Search across LinkedIn, Indeed, Glassdoor & more
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {!results && !loading && (
          <div className="text-center py-8 space-y-3">
            <div className="flex justify-center">
              <div className="p-4 bg-blue-100 rounded-2xl">
                <Briefcase className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Find Your Next Job</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Search millions of jobs across LinkedIn, Indeed, Glassdoor, ZipRecruiter, Google Jobs, and more — all in one place.
            </p>
          </div>
        )}

        <SearchForm onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Search failed</p>
              <p className="text-sm mt-0.5 text-red-600">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-medium text-gray-700">Searching job boards…</p>
              <p className="text-sm text-gray-500">This may take 15–30 seconds</p>
            </div>
          </div>
        )}

        {results && !loading && (
          <JobList
            jobs={results.jobs}
            total={results.total}
            searchTerm={results.search_term}
            location={results.location}
            lastRequest={lastRequest}
          />
        )}
      </main>
    </div>
  );
}
