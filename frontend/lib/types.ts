export interface JobResult {
  id: string | null;
  site: string | null;
  job_url: string | null;
  job_url_direct: string | null;
  title: string | null;
  company: string | null;
  location: string | null;
  date_posted: string | null;
  job_type: string | null;
  salary_source: string | null;
  interval: string | null;
  min_amount: number | null;
  max_amount: number | null;
  currency: string | null;
  is_remote: boolean | null;
  job_level: string | null;
  job_function: string | null;
  listing_type: string | null;
  emails: string | null;
  description: string | null;
  company_industry: string | null;
  company_url: string | null;
  company_logo: string | null;
  company_url_direct: string | null;
  company_addresses: string | null;
  company_num_employees: string | null;
  company_revenue: string | null;
  company_description: string | null;
  skills: string | null;
  experience_range: string | null;
  company_rating: number | null;
  company_reviews_count: number | null;
  vacancy_count: number | null;
  work_from_home_type: string | null;
}

export interface SearchResponse {
  jobs: JobResult[];
  total: number;
  search_term: string;
  location: string | null;
}

export interface SearchRequest {
  search_term: string;
  location?: string;
  site_name: string[];
  results_wanted: number;
  hours_old?: number;
  country_indeed: string;
  job_type?: string;
  is_remote: boolean;
  distance?: number;
  description_format: string;
  linkedin_fetch_description: boolean;
}

export interface SiteInfo {
  value: string;
  label: string;
}

export interface JobTypeInfo {
  value: string;
  label: string;
}

export interface CountryInfo {
  value: string;
  label: string;
}

export interface FilterState {
  sites: string[];
  jobType: string;
  isRemote: boolean | null;
  minSalary: number | null;
  maxSalary: number | null;
}
