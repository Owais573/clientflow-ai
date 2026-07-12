from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import time

from core.exceptions import ClientFlowException
from core.logging import logger

from core.config import settings

from integrations.zoho_crm import init_zoho

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    init_zoho()
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    # Log requests
    logger.info(f"{request.method} {request.url.path} completed in {process_time:.4f}s")
    return response

@app.exception_handler(ClientFlowException)
async def clientflow_exception_handler(request: Request, exc: ClientFlowException):
    logger.error(f"Handled ClientFlowException: {exc.detail}", extra_info=exc.extra)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "extra": exc.extra},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
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
