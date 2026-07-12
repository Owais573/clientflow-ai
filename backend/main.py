from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions (e.g. init DB connection pool, Zoho SDK)
    yield
    # Shutdown actions
    pass

app = FastAPI(
    title="ClientFlow AI API",
    description="Production-grade AI-powered Client Onboarding & CRM Automation platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.NEXT_PUBLIC_API_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}

from api import clients, workflows, research, proposals, dashboard, webhooks

# Include routers
app.include_router(clients.router, prefix="/api/clients", tags=["clients"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["workflows"])
app.include_router(research.router, prefix="/api/research", tags=["research"])
app.include_router(proposals.router, prefix="/api/proposals", tags=["proposals"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])
