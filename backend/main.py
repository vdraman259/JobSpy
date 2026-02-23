from __future__ import annotations

import sys
import os
from contextlib import asynccontextmanager

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="JobSpy API",
    description="Job search API powered by JobSpy",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
