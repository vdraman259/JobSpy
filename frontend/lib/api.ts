import type { SearchRequest, SearchResponse, SiteInfo, JobTypeInfo, CountryInfo } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function searchJobs(request: SearchRequest): Promise<SearchResponse> {
  return apiFetch<SearchResponse>("/search", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getSites(): Promise<SiteInfo[]> {
  return apiFetch<SiteInfo[]>("/sites");
}

export async function getJobTypes(): Promise<JobTypeInfo[]> {
  return apiFetch<JobTypeInfo[]>("/job-types");
}

export async function getCountries(): Promise<CountryInfo[]> {
  return apiFetch<CountryInfo[]>("/countries");
}

export async function exportCsv(request: SearchRequest): Promise<Blob> {
  const res = await fetch(`${API_BASE}/export/csv`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  return res.blob();
}
