from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    search_term: str
    location: Optional[str] = None
    site_name: list[str] = Field(default=["indeed", "linkedin", "glassdoor", "google"])
    results_wanted: int = Field(default=20, ge=1, le=100)
    hours_old: Optional[int] = Field(default=None, ge=1)
    country_indeed: str = "usa"
    job_type: Optional[str] = None
    is_remote: bool = False
    distance: Optional[int] = Field(default=50, ge=0, le=500)
    description_format: str = "markdown"
    linkedin_fetch_description: bool = False


class JobResult(BaseModel):
    id: Optional[str] = None
    site: Optional[str] = None
    job_url: Optional[str] = None
    job_url_direct: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    date_posted: Optional[str] = None
    job_type: Optional[str] = None
    salary_source: Optional[str] = None
    interval: Optional[str] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    currency: Optional[str] = None
    is_remote: Optional[bool] = None
    job_level: Optional[str] = None
    job_function: Optional[str] = None
    listing_type: Optional[str] = None
    emails: Optional[str] = None
    description: Optional[str] = None
    company_industry: Optional[str] = None
    company_url: Optional[str] = None
    company_logo: Optional[str] = None
    company_url_direct: Optional[str] = None
    company_addresses: Optional[str] = None
    company_num_employees: Optional[str] = None
    company_revenue: Optional[str] = None
    company_description: Optional[str] = None
    skills: Optional[str] = None
    experience_range: Optional[str] = None
    company_rating: Optional[float] = None
    company_reviews_count: Optional[int] = None
    vacancy_count: Optional[int] = None
    work_from_home_type: Optional[str] = None


class SearchResponse(BaseModel):
    jobs: list[JobResult]
    total: int
    search_term: str
    location: Optional[str] = None


class SiteInfo(BaseModel):
    value: str
    label: str


class JobTypeInfo(BaseModel):
    value: str
    label: str


class CountryInfo(BaseModel):
    value: str
    label: str
