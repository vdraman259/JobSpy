from __future__ import annotations

import math
from concurrent.futures import ThreadPoolExecutor
from typing import Any

import pandas as pd
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io

from app.models import (
    SearchRequest,
    SearchResponse,
    JobResult,
    SiteInfo,
    JobTypeInfo,
    CountryInfo,
)

router = APIRouter()

_executor = ThreadPoolExecutor(max_workers=4)


def _run_scrape(request: SearchRequest) -> pd.DataFrame:
    from jobspy import scrape_jobs

    return scrape_jobs(
        site_name=request.site_name,
        search_term=request.search_term,
        location=request.location,
        results_wanted=request.results_wanted,
        hours_old=request.hours_old,
        country_indeed=request.country_indeed,
        job_type=request.job_type,
        is_remote=request.is_remote,
        distance=request.distance,
        description_format=request.description_format,
        linkedin_fetch_description=request.linkedin_fetch_description,
        verbose=0,
    )


def _df_to_jobs(df: pd.DataFrame) -> list[JobResult]:
    jobs = []
    for _, row in df.iterrows():
        row_dict: dict[str, Any] = {}
        for col in df.columns:
            val = row[col]
            if pd.isna(val) if not isinstance(val, (list, dict)) else False:
                row_dict[col] = None
            elif isinstance(val, float) and math.isnan(val):
                row_dict[col] = None
            else:
                row_dict[col] = val

        date_posted = row_dict.get("date_posted")
        if date_posted is not None and not isinstance(date_posted, str):
            row_dict["date_posted"] = str(date_posted)

        jobs.append(JobResult(**{k: v for k, v in row_dict.items() if k in JobResult.model_fields}))
    return jobs


@router.post("/search", response_model=SearchResponse)
async def search_jobs(request: SearchRequest):
    import asyncio

    loop = asyncio.get_event_loop()
    try:
        df = await loop.run_in_executor(_executor, _run_scrape, request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    if df.empty:
        return SearchResponse(
            jobs=[],
            total=0,
            search_term=request.search_term,
            location=request.location,
        )

    jobs = _df_to_jobs(df)
    return SearchResponse(
        jobs=jobs,
        total=len(jobs),
        search_term=request.search_term,
        location=request.location,
    )


@router.post("/export/csv")
async def export_csv(request: SearchRequest):
    import asyncio

    loop = asyncio.get_event_loop()
    try:
        df = await loop.run_in_executor(_executor, _run_scrape, request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    output = io.StringIO()
    df.to_csv(output, index=False)
    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=jobs.csv"},
    )


@router.get("/sites", response_model=list[SiteInfo])
async def get_sites():
    return [
        SiteInfo(value="linkedin", label="LinkedIn"),
        SiteInfo(value="indeed", label="Indeed"),
        SiteInfo(value="zip_recruiter", label="ZipRecruiter"),
        SiteInfo(value="glassdoor", label="Glassdoor"),
        SiteInfo(value="google", label="Google Jobs"),
        SiteInfo(value="bayt", label="Bayt"),
        SiteInfo(value="naukri", label="Naukri"),
        SiteInfo(value="bdjobs", label="BDJobs"),
    ]


@router.get("/job-types", response_model=list[JobTypeInfo])
async def get_job_types():
    return [
        JobTypeInfo(value="fulltime", label="Full Time"),
        JobTypeInfo(value="parttime", label="Part Time"),
        JobTypeInfo(value="contract", label="Contract"),
        JobTypeInfo(value="internship", label="Internship"),
    ]


COUNTRY_LIST = [
    ("argentina", "Argentina"), ("australia", "Australia"), ("austria", "Austria"),
    ("bahrain", "Bahrain"), ("bangladesh", "Bangladesh"), ("belgium", "Belgium"),
    ("brazil", "Brazil"), ("bulgaria", "Bulgaria"), ("canada", "Canada"),
    ("chile", "Chile"), ("china", "China"), ("colombia", "Colombia"),
    ("costa rica", "Costa Rica"), ("croatia", "Croatia"), ("cyprus", "Cyprus"),
    ("czech republic", "Czech Republic"), ("denmark", "Denmark"), ("ecuador", "Ecuador"),
    ("egypt", "Egypt"), ("estonia", "Estonia"), ("finland", "Finland"),
    ("france", "France"), ("germany", "Germany"), ("greece", "Greece"),
    ("hong kong", "Hong Kong"), ("hungary", "Hungary"), ("india", "India"),
    ("indonesia", "Indonesia"), ("ireland", "Ireland"), ("israel", "Israel"),
    ("italy", "Italy"), ("japan", "Japan"), ("kuwait", "Kuwait"),
    ("latvia", "Latvia"), ("lithuania", "Lithuania"), ("luxembourg", "Luxembourg"),
    ("malaysia", "Malaysia"), ("malta", "Malta"), ("mexico", "Mexico"),
    ("morocco", "Morocco"), ("netherlands", "Netherlands"), ("new zealand", "New Zealand"),
    ("nigeria", "Nigeria"), ("norway", "Norway"), ("oman", "Oman"),
    ("pakistan", "Pakistan"), ("panama", "Panama"), ("peru", "Peru"),
    ("philippines", "Philippines"), ("poland", "Poland"), ("portugal", "Portugal"),
    ("qatar", "Qatar"), ("romania", "Romania"), ("saudi arabia", "Saudi Arabia"),
    ("singapore", "Singapore"), ("slovakia", "Slovakia"), ("slovenia", "Slovenia"),
    ("south africa", "South Africa"), ("south korea", "South Korea"),
    ("spain", "Spain"), ("sweden", "Sweden"), ("switzerland", "Switzerland"),
    ("taiwan", "Taiwan"), ("thailand", "Thailand"), ("turkey", "Turkey"),
    ("ukraine", "Ukraine"), ("united arab emirates", "United Arab Emirates"),
    ("uk", "UK"), ("usa", "USA"), ("uruguay", "Uruguay"),
    ("venezuela", "Venezuela"), ("vietnam", "Vietnam"),
]


@router.get("/countries", response_model=list[CountryInfo])
async def get_countries():
    return sorted(
        [CountryInfo(value=v, label=l) for v, l in COUNTRY_LIST],
        key=lambda c: c.label,
    )
